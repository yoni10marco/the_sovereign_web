import { createClient } from "@/lib/supabase/server";
import { ProposalCard } from "@/components/voting/ProposalCard";
import { Countdown } from "@/components/ui/Countdown";
import { AdSlot } from "@/components/layout/AdSlot";

export const revalidate = 0;

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Get current active cycle
  const { data: cycle } = await supabase
    .from("morph_cycles")
    .select("*")
    .eq("status", "active")
    .order("cycle_number", { ascending: false })
    .limit(1)
    .single();

  // Get proposals for this cycle
  const { data: proposals } = await supabase
    .from("proposals")
    .select("*, profiles(username)")
    .eq("cycle_id", cycle?.id ?? "")
    .order("vote_count", { ascending: false });

  const endsAt = cycle?.extended_until || cycle?.ends_at;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AdSlot placement="banner-top" className="mb-6" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          {cycle && (
            <p className="text-white/50 mt-1">Cycle #{cycle.cycle_number}</p>
          )}
        </div>
        {endsAt && (
          <div className="text-right">
            <p className="text-xs text-white/40 mb-1">Morph in</p>
            <Countdown targetDate={endsAt} />
          </div>
        )}
      </div>

      {!cycle && (
        <div className="text-center py-20 text-white/40">
          <p className="text-xl">No active cycle</p>
          <p className="mt-2">Check back soon for the next morphing cycle.</p>
        </div>
      )}

      {proposals && proposals.length === 0 && cycle && (
        <div className="text-center py-20 text-white/40">
          <p className="text-xl">No proposals yet</p>
          <p className="mt-2">Be the first to submit a vision!</p>
          <a href="/submit" className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg">
            Submit a Proposal
          </a>
        </div>
      )}

      <div className="grid gap-4">
        {proposals?.map((p) => (
          <ProposalCard
            key={p.id}
            id={p.id}
            title={p.title}
            prompt={p.prompt}
            imageUrl={p.image_url}
            voteCount={p.vote_count}
            username={p.profiles?.username ?? "Unknown"}
            cycleId={p.cycle_id}
          />
        ))}
      </div>

      <AdSlot placement="banner-bottom" className="mt-6" />
    </div>
  );
}
