import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Globe, Heart } from "lucide-react";

export const revalidate = 60;

export default async function HallOfFamePage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("hall_of_fame")
    .select("*")
    .order("cycle_number", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Hall of Fame</h1>
      <p className="text-white/50 mb-8">Every past life of The Sovereign Web, preserved forever.</p>

      {(!entries || entries.length === 0) && (
        <div className="text-center py-20 text-white/40">
          <p className="text-xl">No morphs archived yet</p>
          <p className="mt-2">The first morph will appear here after Cycle #1 completes.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries?.map((entry) => (
          <Link
            key={entry.id}
            href={`/hall-of-fame/${entry.id}`}
            className="block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors group"
          >
            {(entry.screenshot_url || entry.image_url) ? (
              <img
                src={entry.screenshot_url ?? entry.image_url}
                alt={entry.prompt ?? ""}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-purple-900/30 to-purple-600/10 flex items-center justify-center">
                <Globe size={40} className="text-purple-400/40" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-purple-400">Cycle #{entry.cycle_number}</span>
                <span className="text-xs text-white/40 flex items-center gap-1"><Heart size={11} />  {entry.total_votes ?? 0}</span>
              </div>
              <p className="text-sm text-white/70 line-clamp-2">{entry.prompt}</p>
              <p className="text-xs text-white/40 mt-2">Winner: {entry.winner_username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
