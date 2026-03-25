import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();

  const { data: spaces, error } = await admin
    .from("sovereign_spaces")
    .select("id, title, prompt, status, expires_at, purchased_at, user_id")
    .eq("is_public", true)
    .eq("status", "active")
    .order("purchased_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch spaces" }, { status: 500 });
  }

  return NextResponse.json({ spaces: spaces ?? [] });
}
