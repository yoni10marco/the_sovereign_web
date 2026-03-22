import { createClient } from "@/lib/supabase/server";
import { MorphRenderer } from "@/components/morphing/MorphRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function HallOfFameEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("hall_of_fame")
    .select("*")
    .eq("id", id)
    .single();

  if (!entry || !entry.site_config) {
    notFound();
  }

  return (
    <div>
      <div className="bg-gray-950 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/hall-of-fame" className="text-sm text-white/50 hover:text-white">
            ← Back
          </Link>
          <span className="text-sm font-mono text-purple-400">Cycle #{entry.cycle_number}</span>
          <span className="text-sm text-white/50">by {entry.winner_username}</span>
          <span className="text-sm text-white/30">❤️ {entry.total_votes}</span>
        </div>
      </div>
      <MorphRenderer config={entry.site_config} />
    </div>
  );
}
