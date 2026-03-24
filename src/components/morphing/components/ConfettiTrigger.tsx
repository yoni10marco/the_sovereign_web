"use client";
import { useState, useCallback } from "react";
import type { ConfettiTriggerProps } from "@/lib/morphing/config-schema";

interface Piece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
}

const COLORS = ["#ff595e", "#ffca3a", "#6a4c93", "#1982c4", "#8ac926", "#ff6d00", "#f72585"];

export function ConfettiTrigger({ button_text = "Celebrate!", message, count = 80 }: ConfettiTriggerProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [key, setKey] = useState(0);

  const fire = useCallback(() => {
    const newPieces: Piece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.4,
      duration: 1.5 + Math.random() * 1.5,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    }));
    setKey((k) => k + 1);
    setPieces(newPieces);
    setTimeout(() => setPieces([]), 4000);
  }, [count]);

  return (
    <section className="px-4 sm:px-8 py-12 relative overflow-hidden">
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Confetti pieces */}
      {pieces.map((p) => (
        <div
          key={`${key}-${p.id}`}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${p.x}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 2,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}

      <div className="text-center max-w-md mx-auto">
        {message && (
          <p className="text-lg mb-6" style={{ color: "var(--morph-text)" }}>{message}</p>
        )}
        <button
          onClick={fire}
          className="px-10 py-4 text-base font-bold tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{
            backgroundColor: "var(--morph-primary)",
            color: "var(--morph-bg)",
            borderRadius: "var(--morph-radius)",
          }}
        >
          {button_text}
        </button>
      </div>
    </section>
  );
}
