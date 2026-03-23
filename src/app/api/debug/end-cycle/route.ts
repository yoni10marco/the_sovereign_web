import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Debug-only: ends the active cycle immediately by setting ends_at to now
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Debug only" }, { status: 403 });
  }

  const supabase = await createClient();

  const { data: cycle, error } = await supabase
    .from("morph_cycles")
    .select("*")
    .eq("status", "active")
    .order("cycle_number", { ascending: false })
    .limit(1)
    .single();

  if (!cycle) {
    return NextResponse.json({ error: "No active cycle", details: error }, { status: 404 });
  }

  const now = new Date().toISOString();

  await supabase
    .from("morph_cycles")
    .update({ ends_at: now })
    .eq("id", cycle.id);

  return NextResponse.json({
    message: "Cycle ended",
    cycle_number: cycle.cycle_number,
    ended_at: now,
  });
}
