import { createClient } from "@/lib/supabase/server";
import { MorphRenderer } from "@/components/morphing/MorphRenderer";
import { GENESIS_CONFIG } from "@/lib/morphing/genesis-config";
import type { SiteConfig } from "@/lib/morphing/config-schema";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  // Get the latest completed cycle's config
  const { data: cycle } = await supabase
    .from("morph_cycles")
    .select("site_config, cycle_number")
    .eq("status", "completed")
    .order("cycle_number", { ascending: false })
    .limit(1)
    .single();

  const config: SiteConfig = cycle?.site_config ?? GENESIS_CONFIG;

  return <MorphRenderer config={config} />;
}
