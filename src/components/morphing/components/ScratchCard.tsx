"use client";
import { useEffect, useRef, useState } from "react";
import type { ScratchCardProps } from "@/lib/morphing/config-schema";

export function ScratchCard({ title = "Scratch to Reveal!", cover_text = "Scratch here...", reveal_text, reveal_image }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);
  const scratched = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#888888";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#cccccc";
    ctx.textAlign = "center";
    ctx.fillText(cover_text, canvas.width / 2, canvas.height / 2);
  }, [cover_text]);

  function scratch(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Check coverage
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] === 0) transparent++;
    const percent = (transparent / (canvas.width * canvas.height)) * 100;
    scratched.current = percent;
    if (percent > 55) setRevealed(true);
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  }

  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-sm mx-auto text-center">
        {title && <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--morph-text)" }}>{title}</h2>}
        <div className="relative inline-block" style={{ borderRadius: "var(--morph-radius)", overflow: "hidden" }}>
          {/* Reveal layer */}
          <div
            className="flex items-center justify-center p-8 font-semibold text-lg"
            style={{
              width: 300,
              height: 200,
              backgroundColor: "var(--morph-secondary)",
              color: "var(--morph-text)",
            }}
          >
            {reveal_image
              ? <img src={reveal_image} alt="Revealed" className="w-full h-full object-cover" />
              : <span>{reveal_text ?? "You won!"}</span>
            }
          </div>
          {/* Scratch canvas */}
          {!revealed && (
            <canvas
              ref={canvasRef}
              width={300}
              height={200}
              className="absolute inset-0 cursor-crosshair touch-none"
              style={{ borderRadius: "var(--morph-radius)" }}
              onMouseDown={(e) => { isDrawing.current = true; const p = getPos(e); scratch(p.x, p.y); }}
              onMouseMove={(e) => { if (!isDrawing.current) return; const p = getPos(e); scratch(p.x, p.y); }}
              onMouseUp={() => { isDrawing.current = false; }}
              onTouchStart={(e) => { isDrawing.current = true; const p = getPos(e); scratch(p.x, p.y); }}
              onTouchMove={(e) => { const p = getPos(e); scratch(p.x, p.y); }}
              onTouchEnd={() => { isDrawing.current = false; }}
            />
          )}
        </div>
        {revealed && (
          <p className="mt-4 text-sm opacity-60" style={{ color: "var(--morph-text)" }}>Revealed!</p>
        )}
      </div>
    </section>
  );
}
