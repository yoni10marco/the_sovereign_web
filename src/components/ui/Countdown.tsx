"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string;
  onComplete?: () => void;
}

export function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1 font-mono text-lg">
      <span className="bg-white/10 px-2 py-1 rounded">{pad(timeLeft.hours)}</span>
      <span className="text-white/30">:</span>
      <span className="bg-white/10 px-2 py-1 rounded">{pad(timeLeft.minutes)}</span>
      <span className="text-white/30">:</span>
      <span className="bg-white/10 px-2 py-1 rounded">{pad(timeLeft.seconds)}</span>
    </div>
  );
}
