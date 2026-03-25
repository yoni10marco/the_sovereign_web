"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LiveCounterProps } from "@/lib/morphing/config-schema";

interface LiveCounterInternalProps extends LiveCounterProps {
  _cycleId?: string;
  _componentIndex?: number;
  _liveState?: { count?: number };
}

export function LiveCounter({
  label = "people are viewing this right now",
  base_count = 42,
  show_pulse = true,
  _cycleId,
  _componentIndex,
  _liveState,
}: LiveCounterInternalProps) {
  const isArchived = _liveState !== undefined;
  const [count, setCount] = useState<number>(
    isArchived ? (_liveState?.count ?? base_count) : base_count
  );

  // Live mode: subscribe to realtime updates
  useEffect(() => {
    if (isArchived || !_cycleId || _componentIndex == null) return;

    // Fetch initial state
    fetch(`/api/live/state?cycleId=${_cycleId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data[_componentIndex]?.count != null) {
          setCount(data[_componentIndex].count as number);
        }
      })
      .catch(() => {});

    // Subscribe to realtime changes
    const supabase = createClient();
    const channel = supabase
      .channel(`live-counter-${_cycleId}-${_componentIndex}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "component_states",
          filter: `cycle_id=eq.${_cycleId}`,
        },
        (payload) => {
          const row = payload.new as { component_index: number; state_data: { count?: number } };
          if (row.component_index === _componentIndex && row.state_data?.count != null) {
            setCount(row.state_data.count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isArchived, _cycleId, _componentIndex]);

  // Live mode: simulate fluctuation locally (visual only, not persisted)
  useEffect(() => {
    if (isArchived || !_cycleId) return;
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        return Math.max(base_count - 10, Math.min(base_count + 20, c + delta));
      });
    }, 2500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [isArchived, _cycleId, base_count]);

  // Fallback animation when no cycleId (preview/storybook mode)
  useEffect(() => {
    if (_cycleId || isArchived) return;
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        return Math.max(base_count - 10, Math.min(base_count + 20, c + delta));
      });
    }, 2500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [_cycleId, isArchived, base_count]);

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
          {show_pulse && !isArchived && (
            <span className="relative flex h-3 w-3">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "var(--morph-accent)" }}
              />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: "var(--morph-accent)" }} />
            </span>
          )}
          {show_pulse && isArchived && (
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 opacity-40" style={{ backgroundColor: "var(--morph-accent)" }} />
            </span>
          )}
          <span className="text-2xl font-black tabular-nums" style={{ color: "var(--morph-primary)" }}>{count}</span>
          <span className="text-sm font-medium opacity-70">{label}</span>
          {isArchived && <span className="text-xs opacity-40 ml-1">(final)</span>}
        </div>
      </div>
    </section>
  );
}
