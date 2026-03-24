"use client";
import { useState, useCallback } from "react";
import type { ReactionCloudProps } from "@/lib/morphing/config-schema";

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

let idCounter = 0;

export function ReactionCloud({ title, emojis = ["❤️", "🔥", "👏", "😂", "🎉", "😮", "💯", "⭐"] }: ReactionCloudProps) {
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const addReaction = useCallback((emoji: string) => {
    const id = idCounter++;
    const x = 20 + Math.random() * 60;
    setFloating((prev) => [...prev, { id, emoji, x }]);
    setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
    setTimeout(() => {
      setFloating((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
  }, []);

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
              className="flex flex-col items-center gap-1 px-4 py-2 border border-current/10 hover:scale-110 active:scale-95 transition-transform"
              style={{
                backgroundColor: "var(--morph-secondary)",
                borderRadius: "var(--morph-radius)",
                color: "var(--morph-text)",
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
      </div>
    </section>
  );
}
