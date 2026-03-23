import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // Get authenticated user from cookies
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { title, prompt, imageUrls } = body;

  if (!title || !prompt) {
    return NextResponse.json({ error: "Title and prompt are required" }, { status: 400 });
  }

  const urls: string[] = Array.isArray(imageUrls) ? imageUrls.slice(0, 5) : [];

  const admin = createAdminClient();

  // Get active cycle
  const { data: cycle } = await admin
    .from("morph_cycles")
    .select("id")
    .eq("status", "active")
    .order("cycle_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!cycle) {
    return NextResponse.json({ error: "No active cycle found" }, { status: 404 });
  }

  // Check if user already submitted
  const { data: existing } = await admin
    .from("proposals")
    .select("id")
    .eq("cycle_id", cycle.id)
    .eq("user_id", user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "You've already submitted a proposal this cycle" }, { status: 409 });
  }

  // Insert proposal
  const { error: insertError } = await admin.from("proposals").insert({
    cycle_id: cycle.id,
    user_id: user.id,
    title,
    prompt,
    image_url: urls[0] ?? null,
    image_urls: urls,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, cycleId: cycle.id });
}
