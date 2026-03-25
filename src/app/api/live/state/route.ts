import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const cycleId = req.nextUrl.searchParams.get("cycleId");
  if (!cycleId) {
    return NextResponse.json({ error: "cycleId required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("component_states")
    .select("component_index, state_data")
    .eq("cycle_id", cycleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return as a map: { [componentIndex]: state_data }
  const stateMap: Record<number, unknown> = {};
  for (const row of data ?? []) {
    stateMap[row.component_index] = row.state_data;
  }

  return NextResponse.json(stateMap);
}
