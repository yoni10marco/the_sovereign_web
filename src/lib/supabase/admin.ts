import { createClient } from "@supabase/supabase-js";

// Admin client that bypasses RLS — use only in server-side API routes
// Requires SUPABASE_SERVICE_ROLE_KEY env variable
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(url, serviceKey);
}
