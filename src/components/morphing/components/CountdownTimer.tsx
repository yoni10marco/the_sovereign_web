"use client";

import { useEffect, useState } from "react";
import type { CountdownTimerProps } from "@/lib/morphing/config-schema";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownTimer({ target_date, title, description }: CountdownTimerProps) {
  const target = new Date(target_date);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target_date]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="px-6 py-16 text-center">
      {title && (
        <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--morph-primary)" }}>
          {title}
        </h2>
      )}
      {description && <p className="mb-8 opacity-70">{description}</p>}
      {timeLeft ? (
        <div className="flex justify-center gap-6 flex-wrap">
          {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
            <div
              key={unit}
              className="flex flex-col items-center px-6 py-4 min-w-[80px]"
              style={{ background: "var(--morph-secondary)", borderRadius: "var(--morph-radius)" }}
            >
              <span className="text-4xl font-bold tabular-nums" style={{ color: "var(--morph-accent)" }}>
                {String(timeLeft[unit]).padStart(2, "0")}
              </span>
              <span className="text-xs uppercase tracking-widest mt-1 opacity-60">{unit}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl opacity-60">Event has passed.</p>
      )}
    </div>
  );
}
