"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { InteractivePollProps } from "@/lib/morphing/config-schema";

interface InteractivePollInternalProps extends InteractivePollProps {
  _cycleId?: string;
  _componentIndex?: number;
  _liveState?: { votes?: Record<string, number>; total?: number };
}

export function InteractivePoll({
  question,
  options,
  allow_multiple = false,
  _cycleId,
  _componentIndex,
  _liveState,
}: InteractivePollInternalProps) {
  const isArchived = _liveState !== undefined;

  // votes keyed by option string
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    if (isArchived && _liveState?.votes) return _liveState.votes;
    // Seed random initial counts so the UI looks populated before real data loads
    const seed: Record<string, number> = {};
    for (const opt of options ?? []) seed[opt] = Math.floor(Math.random() * 40 + 5);
    return seed;
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(isArchived);

  const total = Object.values(votes).reduce((a, b) => a + b, 0);

  // Live mode: fetch real state + subscribe to realtime
  useEffect(() => {
    if (isArchived || !_cycleId || _componentIndex == null) return;

    fetch(`/api/live/state?cycleId=${_cycleId}`)
      .then((r) => r.json())
      .then((data) => {
        const state = data[_componentIndex] as { votes?: Record<string, number> } | undefined;
        if (state?.votes) setVotes(state.votes);
      })
      .catch(() => {});

    const supabase = createClient();
    const channel = supabase
      .channel(`poll-${_cycleId}-${_componentIndex}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "component_states",
          filter: `cycle_id=eq.${_cycleId}`,
        },
        (payload: { new: unknown }) => {
          const row = payload.new as { component_index: number; state_data: { votes?: Record<string, number> } };
          if (row.component_index === _componentIndex && row.state_data?.votes) {
            setVotes(row.state_data.votes);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isArchived, _cycleId, _componentIndex]);

  function handleSelect(opt: string) {
    if (submitted) return;
    if (allow_multiple) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(opt)) { next.delete(opt); } else { next.add(opt); }
        return next;
      });
    } else {
      setSelected(new Set([opt]));
    }
  }

  function handleSubmit() {
    if (selected.size === 0) return;

    // Optimistic update
    setVotes((prev) => {
      const next = { ...prev };
      for (const opt of selected) next[opt] = (next[opt] ?? 0) + 1;
      return next;
    });
    setSubmitted(true);

    // Persist each selected option
    if (_cycleId && _componentIndex != null) {
      for (const opt of selected) {
        fetch("/api/live/interact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cycleId: _cycleId,
            componentIndex: _componentIndex,
            componentType: "interactive_poll",
            action: { type: "vote", option: opt },
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.votes) setVotes(data.votes as Record<string, number>);
          })
          .catch(() => {});
      }
    }
  }

  return (
    <section className="px-4 sm:px-8 py-12">
      <div
        className="max-w-lg mx-auto p-8 border border-current/10"
        style={{ backgroundColor: "var(--morph-secondary)", borderRadius: "var(--morph-radius)" }}
      >
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--morph-text)" }}>{question}</h3>
        {isArchived && (
          <p className="text-xs opacity-50 mb-5" style={{ color: "var(--morph-text)" }}>Final Results</p>
        )}
        {!isArchived && <div className="mb-6" />}

        <div className="space-y-3">
          {options?.map((opt) => {
            const v = votes[opt] ?? 0;
            const pct = total > 0 ? Math.round((v / total) * 100) : 0;
            const isSelected = selected.has(opt);
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={submitted}
                className="relative w-full text-left px-4 py-3 overflow-hidden border transition-colors"
                style={{
                  borderRadius: "var(--morph-radius)",
                  borderColor: isSelected ? "var(--morph-primary)" : "transparent",
                  backgroundColor: "var(--morph-bg)",
                  color: "var(--morph-text)",
                  cursor: submitted ? "default" : "pointer",
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
