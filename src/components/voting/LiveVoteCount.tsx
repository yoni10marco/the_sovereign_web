"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LiveVoteCountProps {
  proposalId: string;
  initialCount: number;
}

export function LiveVoteCount({ proposalId, initialCount }: LiveVoteCountProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`votes-${proposalId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "proposals",
          filter: `id=eq.${proposalId}`,
        },
        (payload: { new: { vote_count: number } }) => {
          setCount(payload.new.vote_count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [proposalId]);

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 rounded-full shrink-0">
      <Heart size={14} className="text-purple-400" />
      <span className="text-sm font-bold text-purple-300">{count}</span>
    </div>
  );
}
