import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSiteConfig } from "@/lib/morphing/gemini";

export async function POST(req: NextRequest) {
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

  const { spaceId } = await req.json();
  if (!spaceId) {
    return NextResponse.json({ error: "spaceId is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Fetch the space and verify ownership
  const { data: space, error: fetchError } = await admin
    .from("sovereign_spaces")
    .select("*")
    .eq("id", spaceId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  if (space.status === "active" && space.site_config) {
    return NextResponse.json({ spaceId: space.id });
  }

  // Mark as generating
  await admin
    .from("sovereign_spaces")
    .update({ status: "generating" })
    .eq("id", spaceId);

  try {
    const { config } = await generateSiteConfig(
      space.prompt,
      space.image_urls ?? [],
      0 // spaces don't use cycle numbers; use 0
    );
    // Tag the config with the space id
    config.id = `space-${space.id}`;

    await admin
      .from("sovereign_spaces")
      .update({ site_config: config, status: "active" })
      .eq("id", spaceId);

    return NextResponse.json({ spaceId: space.id });
  } catch (err) {
    console.error("Space generation error:", err);
    await admin
      .from("sovereign_spaces")
      .update({ status: "pending" })
      .eq("id", spaceId);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
