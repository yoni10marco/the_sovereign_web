"use client";
import { useEffect, useState } from "react";
import type { LiveCounterProps } from "@/lib/morphing/config-schema";

export function LiveCounter({ label = "people are viewing this right now", base_count = 42, show_pulse = true }: LiveCounterProps) {
  const [count, setCount] = useState(base_count);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        return Math.max(base_count - 10, Math.min(base_count + 20, c + delta));
      });
    }, 2500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [base_count]);

  return (
    <section className="px-4 sm:px-8 py-6">
      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-3 px-5 py-3 shadow-md border border-current/10"
          style={{
            backgroundColor: "var(--morph-secondary)",
            borderRadius: "9999px",
            color: "var(--morph-text)",
          }}
        >
          {show_pulse && (
            <span className="relative flex h-3 w-3">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "var(--morph-accent)" }}
              />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: "var(--morph-accent)" }} />
            </span>
          )}
          <span className="text-2xl font-black tabular-nums" style={{ color: "var(--morph-primary)" }}>{count}</span>
          <span className="text-sm font-medium opacity-70">{label}</span>
        </div>
      </div>
    </section>
  );
}
