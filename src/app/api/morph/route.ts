import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSiteConfig } from "@/lib/morphing/gemini";

// This endpoint is triggered by a cron job at 00:00 UTC (or manually during dev)
// It can also be protected with a secret header in production
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // In production, verify cron secret
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Get current active cycle
  const { data: cycle } = await supabase
    .from("morph_cycles")
    .select("*")
    .eq("status", "active")
    .order("cycle_number", { ascending: false })
    .limit(1)
    .single();

  if (!cycle) {
    return NextResponse.json({ error: "No active cycle found" }, { status: 404 });
  }

  // Update status to generating
  await supabase
    .from("morph_cycles")
    .update({ status: "generating" })
    .eq("id", cycle.id);

  // Find highest voted proposal
  const { data: winner } = await supabase
    .from("proposals")
    .select("*, profiles(username)")
    .eq("cycle_id", cycle.id)
    .order("vote_count", { ascending: false })
    .limit(1)
    .single();

  if (!winner) {
    // No proposals — revert to active and extend
    await supabase
      .from("morph_cycles")
      .update({
        status: "active",
        ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", cycle.id);

    return NextResponse.json({ message: "No proposals — cycle extended" });
  }

  // Generate site config
  const { config: siteConfig, error: geminiError } = await generateSiteConfig(
    winner.prompt,
    (winner.image_urls as string[] | null) ?? (winner.image_url ? [winner.image_url] : []),
    cycle.cycle_number
  );

  // Complete the cycle
  await supabase
    .from("morph_cycles")
    .update({
      status: "completed",
      winning_proposal_id: winner.id,
      site_config: siteConfig,
    })
    .eq("id", cycle.id);

  // Snapshot live component state for the cycle
  const { data: componentStates } = await supabase
    .from("component_states")
    .select("component_index, state_data")
    .eq("cycle_id", cycle.id);
  const liveStateSnapshot: Record<number, unknown> = {};
  for (const row of componentStates ?? []) {
    liveStateSnapshot[row.component_index] = row.state_data;
  }

  // Archive to hall of fame
  const { data: hofEntry } = await supabase.from("hall_of_fame").insert({
    cycle_id: cycle.id,
    cycle_number: cycle.cycle_number,
    winner_user_id: winner.user_id,
    winner_username: winner.profiles?.username ?? "Unknown",
    prompt: winner.prompt,
    image_url: winner.image_url,
    total_votes: winner.vote_count,
    site_config: siteConfig,
    live_state: liveStateSnapshot,
  }).select("id").single();

  // Async screenshot capture via microlink.io (fire-and-forget, does not block morph)
  if (hofEntry?.id) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    if (appUrl) {
      const entryUrl = `${appUrl}/hall-of-fame/${hofEntry.id}`;
      fetch(`https://api.microlink.io/?url=${encodeURIComponent(entryUrl)}&screenshot=true&meta=false`)
        .then((r) => r.json())
        .then((data) => {
          const screenshotUrl: string | undefined = data?.data?.screenshot?.url;
          if (screenshotUrl) {
            supabase
              .from("hall_of_fame")
              .update({ screenshot_url: screenshotUrl })
              .eq("id", hofEntry.id)
              .then(() => {});
          }
        })
        .catch(() => {});
    }
  }

  // Increment winner's total wins
  await supabase
    .from("profiles")
    .update({ total_wins: ((winner.profiles as { total_wins?: number })?.total_wins ?? 0) + 1 })
    .eq("id", winner.user_id);

  // Create next cycle
  const now = new Date();
  await supabase.from("morph_cycles").insert({
    cycle_number: cycle.cycle_number + 1,
    starts_at: now.toISOString(),
    ends_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  });

  // Purge cached homepage so the new config shows immediately
  revalidatePath("/");

  return NextResponse.json({
    message: "Morph complete",
    winner: winner.prompt,
    cycle: cycle.cycle_number,
    ...(geminiError ? { gemini_error: geminiError } : {}),
  });
}
