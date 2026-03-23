import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Auto-expire spaces past their expiry
  await admin
    .from("sovereign_spaces")
    .update({ status: "expired", is_active: false })
    .eq("user_id", user.id)
    .neq("status", "expired")
    .lt("expires_at", now);

  const { data: spaces, error } = await admin
    .from("sovereign_spaces")
    .select("id, title, prompt, status, expires_at, purchased_at")
    .eq("user_id", user.id)
    .order("purchased_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch spaces" }, { status: 500 });
  }

  return NextResponse.json({ spaces });
}
