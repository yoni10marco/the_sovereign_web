import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Action =
  | { type: "react"; emoji: string }
  | { type: "vote"; option: string }
  | { type: "increment" };

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    cycleId: string;
    componentIndex: number;
    componentType: string;
    action: Action;
  };

  const { cycleId, componentIndex, componentType, action } = body;
  if (!cycleId || componentIndex == null || !componentType || !action) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Validate that cycleId refers to an active cycle (not completed)
  const { data: cycle, error: cycleError } = await supabase
    .from("morph_cycles")
    .select("id, status")
    .eq("id", cycleId)
    .single();

  if (cycleError || !cycle) {
    return NextResponse.json({ error: "Cycle not found" }, { status: 404 });
  }
  if (cycle.status === "completed") {
    return NextResponse.json({ error: "Cycle is archived — interactions are frozen" }, { status: 403 });
  }

  // Get or create the component state row
  const { data: existing } = await supabase
    .from("component_states")
    .select("state_data")
    .eq("cycle_id", cycleId)
    .eq("component_index", componentIndex)
    .maybeSingle();

  let stateData = (existing?.state_data ?? {}) as Record<string, unknown>;

  // Apply the action
  if (action.type === "react") {
    // Rate-limit: check via user session (best-effort; not blocking if anonymous)
    const serverClient = await createClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const reactions = (stateData.reactions ?? {}) as Record<string, number>;
    reactions[action.emoji] = (reactions[action.emoji] ?? 0) + 1;
    stateData = { ...stateData, reactions };

    // Simple per-user per-emoji throttle stored in DB (optional enhancement — skip for now)
    void user; // user available if needed for future rate limiting
  } else if (action.type === "vote") {
    const votes = (stateData.votes ?? {}) as Record<string, number>;
    votes[action.option] = (votes[action.option] ?? 0) + 1;
    const total = Object.values(votes).reduce((s, v) => s + v, 0);
    stateData = { ...stateData, votes, total };
  } else if (action.type === "increment") {
    const count = ((stateData.count as number) ?? 0) + 1;
    stateData = { ...stateData, count };
  }

  // Upsert the updated state
  const { data: updated, error: upsertError } = await supabase
    .from("component_states")
    .upsert(
      {
        cycle_id: cycleId,
        component_index: componentIndex,
        component_type: componentType,
        state_data: stateData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cycle_id,component_index" }
    )
    .select("state_data")
    .single();

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json(updated.state_data);
}
