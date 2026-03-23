import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  // Verify auth
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

  const { title, prompt, imageUrls = [] } = await req.json();
  if (!title || !prompt) {
    return NextResponse.json({ error: "Title and prompt are required" }, { status: 400 });
  }

  // Stub payment — in production this would call Polar createCheckout
  // and verify webhook before creating the space. For now we create it directly.
  const admin = createAdminClient();

  const slug = `${user.id.slice(0, 8)}-${Date.now()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data: space, error } = await admin
    .from("sovereign_spaces")
    .insert({
      user_id: user.id,
      slug,
      title,
      prompt,
      image_urls: imageUrls,
      status: "pending",
      expires_at: expiresAt,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Space creation error:", error);
    return NextResponse.json({ error: "Failed to create space" }, { status: 500 });
  }

  return NextResponse.json({ spaceId: space.id });
}
