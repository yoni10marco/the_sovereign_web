"use client";

import { VoteButton } from "./VoteButton";
import { LiveVoteCount } from "./LiveVoteCount";

interface ProposalCardProps {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string | null;
  voteCount: number;
  username: string;
  cycleId: string;
}

export function ProposalCard({ id, title, prompt, imageUrl, voteCount, username }: ProposalCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
            <p className="text-sm text-white/50 mt-1">by {username}</p>
          </div>
          <LiveVoteCount proposalId={id} initialCount={voteCount} />
        </div>
        <p className="mt-3 text-sm text-white/70 line-clamp-3">{prompt}</p>
        <div className="mt-4">
          <VoteButton proposalId={id} />
        </div>
      </div>
    </div>
  );
}
