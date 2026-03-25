import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { MorphRenderer } from "@/components/morphing/MorphRenderer";
import { GENESIS_CONFIG } from "@/lib/morphing/genesis-config";
import type { SiteConfig } from "@/lib/morphing/config-schema";
import { PublicToggle } from "@/components/spaces/PublicToggle";
import Link from "next/link";
import { Castle, ArrowLeft, Clock } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SpacePage({ params }: Props) {
  const { id } = await params;
  const admin = createAdminClient();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: space } = await admin
    .from("sovereign_spaces")
    .select("id, title, prompt, site_config, status, expires_at, user_id, is_public")
    .eq("id", id)
    .single();

  if (!space) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">Space Not Found</h1>
        <p className="text-white/50 mb-6">This space doesn&apos;t exist or has been removed.</p>
        <Link href="/spaces" className="text-amber-400 hover:underline">
          <ArrowLeft size={14} className="inline mr-1" />Back to Spaces
        </Link>
      </div>
    );
  }

  const now = new Date();
  const expiresAt = new Date(space.expires_at);
  const isExpired = now > expiresAt;
  const hoursLeft = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

  if (space.status === "generating") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Castle size={48} className="text-amber-400/60 mx-auto mb-6 animate-pulse" />
        <h2 className="text-2xl font-bold mb-3">Building Your Space...</h2>
        <p className="text-white/50 mb-6">The AI is still conjuring your site. Refresh in a moment.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg"
        >
          Refresh
        </button>
      </div>
    );
  }

  if (space.status === "pending" || !space.site_config) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Clock size={48} className="text-white/30 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-3">Space Pending Generation</h2>
        <p className="text-white/50 mb-6">Something went wrong during generation.</p>
        <Link href="/spaces" className="text-amber-400 hover:underline">
          <ArrowLeft size={14} className="inline mr-1" />Back to Spaces
        </Link>
      </div>
    );
  }

  const config: SiteConfig = space.site_config ?? GENESIS_CONFIG;
  const isOwner = user?.id === space.user_id;

  return (
    <div>
      {/* Space banner */}
      <div className="fixed top-16 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-black/80 backdrop-blur border-b border-white/10 text-sm">
        <div className="flex items-center gap-2">
          <Castle size={14} className="text-amber-400" />
          <span className="font-semibold text-amber-400">{space.title}</span>
          {isExpired ? (
            <span className="text-red-400 text-xs">(expired)</span>
          ) : (
            <span className="text-white/40 text-xs">{hoursLeft}h remaining</span>
          )}
          {isOwner && !isExpired && (
            <PublicToggle spaceId={space.id} initialIsPublic={space.is_public ?? false} />
          )}
        </div>
        <Link href="/spaces" className="text-white/50 hover:text-white text-xs transition-colors">
          <ArrowLeft size={14} className="inline mr-1" />My Spaces
        </Link>
      </div>
      {/* Offset content below banner */}
      <div className="pt-9">
        <MorphRenderer config={config} />
      </div>
    </div>
  );
}
