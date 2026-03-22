"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import dayjs from "dayjs";

export function PulseIndicator() {
  const { user } = useAuth();
  const [totalLikes, setTotalLikes] = useState(0);
  const [nextExpiry, setNextExpiry] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [claiming, setClaiming] = useState(false);

  const fetchPulses = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("pulses")
      .select("*")
      .eq("user_id", user.id)
      .gt("expires_at", new Date().toISOString())
      .gt("likes_remaining", 0)
      .order("expires_at", { ascending: true });

    const pulses = data ?? [];
    setTotalLikes(pulses.reduce((s, p) => s + p.likes_remaining, 0));
    setNextExpiry(pulses[0]?.expires_at ?? null);
  };

  useEffect(() => {
    fetchPulses();
    const interval = setInterval(fetchPulses, 30_000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!nextExpiry) {
      setTimeLeft("");
      return;
    }
    const tick = () => {
      const diff = dayjs(nextExpiry).diff(dayjs());
      if (diff <= 0) {
        setTimeLeft("Expired");
        fetchPulses();
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    };
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, [nextExpiry]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch("/api/pulse/claim", { method: "POST" });
      if (res.ok) {
        await fetchPulses();
      }
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
        <span className="text-purple-400 text-sm">❤️</span>
        <span className="text-sm font-medium text-purple-300">{totalLikes}</span>
        {timeLeft && (
          <span className="text-xs text-white/40 ml-1">({timeLeft})</span>
        )}
      </div>
      {totalLikes === 0 && (
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-full transition-colors"
        >
          {claiming ? "..." : "Claim Pulse"}
        </button>
      )}
    </div>
  );
}
