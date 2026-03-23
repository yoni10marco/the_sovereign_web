import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActivePulses } from "@/lib/pulse/engine";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activePulses = await getActivePulses(supabase, user.id);
  const totalLikes = activePulses.reduce((s, p) => s + p.likes_remaining, 0);
  const nextExpiry = activePulses[0]?.expires_at ?? null;

  return NextResponse.json({ totalLikes, nextExpiry });
}
