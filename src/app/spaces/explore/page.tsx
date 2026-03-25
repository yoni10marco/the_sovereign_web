import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Castle, Globe } from "lucide-react";

export const revalidate = 0;

export default async function ExploreSpacesPage() {
  const admin = createAdminClient();

  const { data: spaces } = await admin
    .from("sovereign_spaces")
    .select("id, title, prompt, expires_at, purchased_at")
    .eq("is_public", true)
    .eq("status", "active")
    .order("purchased_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Spaces</h1>
          <p className="text-white/50">Public Sovereign Spaces — built by the community.</p>
        </div>
        <Link
          href="/spaces"
          className="shrink-0 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors text-sm"
        >
          My Spaces
        </Link>
      </div>

      {(!spaces || spaces.length === 0) && (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <Globe size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-xl">No public spaces yet</p>
          <p className="text-white/30 mt-2 text-sm">Create a space and make it public to appear here.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces?.map((space) => {
          const expiresAt = new Date(space.expires_at);
          const hoursLeft = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)));
          return (
            <Link
              key={space.id}
              href={`/spaces/${space.id}`}
              className="block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/40 transition-colors group"
            >
              <div className="w-full h-36 bg-gradient-to-br from-amber-900/20 to-amber-600/5 flex items-center justify-center">
                <Castle size={36} className="text-amber-400/40 group-hover:text-amber-400/60 transition-colors" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1 line-clamp-1">{space.title}</h3>
                <p className="text-white/40 text-sm line-clamp-2 mb-3">{space.prompt}</p>
                <div className="flex items-center justify-between text-xs text-white/30">
                  <span>{hoursLeft}h remaining</span>
                  <span className="text-amber-400 font-semibold">Visit Space →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
