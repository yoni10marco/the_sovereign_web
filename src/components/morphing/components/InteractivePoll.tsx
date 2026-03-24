"use client";
import { useState } from "react";
import type { InteractivePollProps } from "@/lib/morphing/config-schema";

export function InteractivePoll({ question, options, allow_multiple = false }: InteractivePollProps) {
  const [votes, setVotes] = useState<number[]>(options?.map(() => Math.floor(Math.random() * 40 + 5)) ?? []);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const total = votes.reduce((a, b) => a + b, 0);

  function handleSelect(i: number) {
    if (submitted) return;
    if (allow_multiple) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(i)) { next.delete(i); } else { next.add(i); }
        return next;
      });
    } else {
      setSelected(new Set([i]));
    }
  }

  function handleSubmit() {
    if (selected.size === 0) return;
    setVotes((prev) => prev.map((v, i) => (selected.has(i) ? v + 1 : v)));
    setSubmitted(true);
  }

  return (
    <section className="px-4 sm:px-8 py-12">
      <div
        className="max-w-lg mx-auto p-8 border border-current/10"
        style={{ backgroundColor: "var(--morph-secondary)", borderRadius: "var(--morph-radius)" }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: "var(--morph-text)" }}>{question}</h3>

        <div className="space-y-3">
          {options?.map((opt, i) => {
            const pct = total > 0 ? Math.round((votes[i] / total) * 100) : 0;
            const isSelected = selected.has(i);
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="relative w-full text-left px-4 py-3 overflow-hidden border transition-colors"
                style={{
                  borderRadius: "var(--morph-radius)",
                  borderColor: isSelected ? "var(--morph-primary)" : "transparent",
                  backgroundColor: "var(--morph-bg)",
                  color: "var(--morph-text)",
                }}
              >
                {/* Progress bar */}
                {submitted && (
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: "var(--morph-primary)",
                      opacity: 0.2,
                    }}
                  />
                )}
                <span className="relative flex items-center justify-between">
                  <span className="font-medium text-sm">{opt}</span>
                  {submitted && <span className="text-sm font-bold opacity-70">{pct}%</span>}
                </span>
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="mt-6 w-full py-2.5 text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{
              backgroundColor: "var(--morph-primary)",
              color: "var(--morph-bg)",
              borderRadius: "var(--morph-radius)",
            }}
          >
            Vote
          </button>
        ) : (
          <p className="mt-4 text-center text-sm opacity-60" style={{ color: "var(--morph-text)" }}>
            {total} votes total
          </p>
        )}
      </div>
    </section>
  );
}
