import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  if (process.env.NEXT_PUBLIC_DEBUG_PANEL !== "true") {
    return NextResponse.json({ error: "Debug only" }, { status: 403 });
  }

  const supabase = createAdminClient();

  const { data: cycles, error: cyclesError } = await supabase
    .from("morph_cycles")
    .select("id, cycle_number, status, winning_proposal_id, site_config")
    .order("cycle_number", { ascending: false })
    .limit(5);

  const { data: proposals, error: proposalsError } = await supabase
    .from("proposals")
    .select("id, cycle_id, title, prompt, vote_count")
    .order("vote_count", { ascending: false })
    .limit(10);

  return NextResponse.json({
    cycles: cycles?.map((c) => ({
      ...c,
      has_site_config: !!c.site_config,
    })),
    cyclesError,
    proposals,
    proposalsError,
  });
}
