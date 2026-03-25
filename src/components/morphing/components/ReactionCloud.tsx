"use client";
import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ReactionCloudProps } from "@/lib/morphing/config-schema";

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

let idCounter = 0;

interface ReactionCloudInternalProps extends ReactionCloudProps {
  _cycleId?: string;
  _componentIndex?: number;
  _liveState?: { reactions?: Record<string, number> };
}

export function ReactionCloud({
  title,
  emojis = ["❤️", "🔥", "👏", "😂", "🎉", "😮", "💯", "⭐"],
  _cycleId,
  _componentIndex,
  _liveState,
}: ReactionCloudInternalProps) {
  const isArchived = _liveState !== undefined;
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>(
    isArchived ? (_liveState?.reactions ?? {}) : {}
  );

  // Live mode: fetch initial state + subscribe to realtime
  useEffect(() => {
    if (isArchived || !_cycleId || _componentIndex == null) return;

    fetch(`/api/live/state?cycleId=${_cycleId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data[_componentIndex]?.reactions) {
          setCounts(data[_componentIndex].reactions as Record<string, number>);
        }
      })
      .catch(() => {});

    const supabase = createClient();
    const channel = supabase
      .channel(`reaction-cloud-${_cycleId}-${_componentIndex}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "component_states",
          filter: `cycle_id=eq.${_cycleId}`,
        },
        (payload: { new: unknown }) => {
          const row = payload.new as { component_index: number; state_data: { reactions?: Record<string, number> } };
          if (row.component_index === _componentIndex && row.state_data?.reactions) {
            setCounts(row.state_data.reactions);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isArchived, _cycleId, _componentIndex]);

  const addReaction = useCallback(
    (emoji: string) => {
      if (isArchived) return;

      // Optimistic update
      const id = idCounter++;
      const x = 20 + Math.random() * 60;
      setFloating((prev) => [...prev, { id, emoji, x }]);
      setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
      setTimeout(() => {
        setFloating((prev) => prev.filter((r) => r.id !== id));
      }, 2200);

      // Persist to backend if live
      if (_cycleId && _componentIndex != null) {
        fetch("/api/live/interact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cycleId: _cycleId,
            componentIndex: _componentIndex,
            componentType: "reaction_cloud",
            action: { type: "react", emoji },
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.reactions) setCounts(data.reactions as Record<string, number>);
          })
          .catch(() => {});
      }
    },
    [isArchived, _cycleId, _componentIndex]
  );

  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-lg mx-auto text-center">
        {title && (
          <h3 className="text-xl font-bold mb-6" style={{ color: "var(--morph-text)" }}>{title}</h3>
        )}

        {/* Floating zone */}
        <div className="relative h-24 mb-6 overflow-hidden pointer-events-none">
          <style>{`
            @keyframes floatUp {
              0%   { transform: translateY(0) scale(0.8); opacity: 1; }
              100% { transform: translateY(-90px) scale(1.3); opacity: 0; }
            }
          `}</style>
          {floating.map((r) => (
            <span
              key={r.id}
              className="absolute text-3xl select-none"
              style={{
                left: `${r.x}%`,
                bottom: 0,
                animation: "floatUp 2.2s ease-out forwards",
              }}
            >
              {r.emoji}
            </span>
          ))}
        </div>

        {/* Reaction buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addReaction(emoji)}
              disabled={isArchived}
              className="flex flex-col items-center gap-1 px-4 py-2 border border-current/10 transition-transform"
              style={{
                backgroundColor: "var(--morph-secondary)",
                borderRadius: "var(--morph-radius)",
                color: "var(--morph-text)",
                cursor: isArchived ? "default" : "pointer",
              }}
            >
              <span className="text-2xl">{emoji}</span>
              {counts[emoji] ? (
                <span className="text-xs font-bold opacity-60">{counts[emoji]}</span>
              ) : (
                <span className="text-xs opacity-0">0</span>
              )}
            </button>
          ))}
        </div>

        {isArchived && (
          <p className="mt-4 text-xs opacity-40" style={{ color: "var(--morph-text)" }}>
            Final reaction counts
          </p>
        )}
      </div>
    </section>
  );
}
