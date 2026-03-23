import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, GIF, or WebP images are allowed" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("proposal-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = admin.storage
    .from("proposal-images")
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
