"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

interface VoteButtonProps {
  proposalId: string;
}

export function VoteButton({ proposalId }: VoteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(1);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const handleVote = async () => {
    if (!user) {
      router.push("/login?redirect=/leaderboard");
      return;
    }

    setVoting(true);
    setError("");

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, likeCount }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to vote");
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
        <button
          onClick={() => setLikeCount(Math.max(1, likeCount - 1))}
          className="px-2 py-1 text-white/50 hover:text-white"
        >
          −
        </button>
        <span className="px-2 text-sm font-medium text-white">{likeCount}</span>
        <button
          onClick={() => setLikeCount(Math.min(25, likeCount + 1))}
          className="px-2 py-1 text-white/50 hover:text-white"
        >
          +
        </button>
      </div>
      <button
        onClick={handleVote}
        disabled={voting}
        className="px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition-colors"
      >
        {voting ? "..." : `Vote ❤️`}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
