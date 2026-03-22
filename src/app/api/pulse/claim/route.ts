import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { claimPulse, getActivePulses } from "@/lib/pulse/engine";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`pulse:${ip}`, 12, 60 * 60 * 1000).allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile to check pro status
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user.id)
    .single();

  const isPro = profile?.is_pro ?? false;

  // TODO: For free users, this should be gated behind a reward ad view
  // The client should send proof of ad completion (e.g., a token from Propeller)

  const result = await claimPulse(supabase, user.id, isPro);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const activePulses = await getActivePulses(supabase, user.id);
  const totalLikes = activePulses.reduce((s, p) => s + p.likes_remaining, 0);

  return NextResponse.json({
    pulse: result.pulse,
    totalLikes,
    activePulses,
  });
}
