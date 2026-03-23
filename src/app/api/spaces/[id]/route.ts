import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: space, error } = await admin
    .from("sovereign_spaces")
    .select("id, title, prompt, site_config, status, expires_at, user_id")
    .eq("id", id)
    .single();

  if (error || !space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  return NextResponse.json({ space });
}
