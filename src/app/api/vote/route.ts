import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { spendLikes } from "@/lib/pulse/engine";
import { rateLimit } from "@/lib/rate-limit";
import { ANTI_SNIPE_WINDOW_SECONDS, ANTI_SNIPE_EXTENSION_SECONDS } from "@/lib/constants";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`vote:${ip}`, 30, 60 * 1000).allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { proposalId, likeCount = 1 } = await request.json();

  if (!proposalId || likeCount < 1 || likeCount > 25) {
    return NextResponse.json({ error: "Invalid vote parameters" }, { status: 400 });
  }

  // Get the proposal and its cycle
  const { data: proposal } = await supabase
    .from("proposals")
    .select("*, morph_cycles(*)")
    .eq("id", proposalId)
    .single();

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const cycle = proposal.morph_cycles;
  const now = new Date();
  const endsAt = new Date(cycle.extended_until || cycle.ends_at);

  if (cycle.status === "completed" || cycle.status === "generating") {
    return NextResponse.json({ error: "This cycle has ended" }, { status: 400 });
  }

  if (now > endsAt) {
    return NextResponse.json({ error: "Voting period has ended" }, { status: 400 });
  }

  // Spend likes from user's pulse
  const spendResult = await spendLikes(supabase, user.id, likeCount);
  if ("error" in spendResult) {
    return NextResponse.json({ error: spendResult.error }, { status: 400 });
  }

  // Insert vote
  const { error: voteError } = await supabase.from("votes").insert({
    proposal_id: proposalId,
    user_id: user.id,
    like_count: likeCount,
  });

  if (voteError) {
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 });
  }

  // Anti-snipe: if within 60s of end, extend by 60s
  const secondsUntilEnd = (endsAt.getTime() - now.getTime()) / 1000;
  if (secondsUntilEnd <= ANTI_SNIPE_WINDOW_SECONDS) {
    const newEnd = new Date(endsAt.getTime() + ANTI_SNIPE_EXTENSION_SECONDS * 1000);
    await supabase
      .from("morph_cycles")
      .update({ extended_until: newEnd.toISOString() })
      .eq("id", cycle.id);
  }

  // Get updated vote count
  const { data: updated } = await supabase
    .from("proposals")
    .select("vote_count")
    .eq("id", proposalId)
    .single();

  return NextResponse.json({ voteCount: updated?.vote_count ?? 0 });
}
