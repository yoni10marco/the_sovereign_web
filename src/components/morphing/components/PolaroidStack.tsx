"use client";
import { useState } from "react";
import type { PolaroidStackProps } from "@/lib/morphing/config-schema";
import { SafeImage } from "../SafeImage";

const BASE_ROTATIONS = [-6, 4, -3, 7, -5, 2, -8, 5];

export function PolaroidStack({ title, images }: PolaroidStackProps) {
  const [activeIndex, setActiveIndex] = useState((images?.length ?? 1) - 1);

  if (!images || images.length === 0) return null;

  return (
    <section className="px-4 sm:px-8 py-12">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: "var(--morph-text)" }}>{title}</h2>
      )}

      <div className="flex flex-wrap justify-center gap-8">
        {/* Stack */}
        <div className="relative flex items-center justify-center" style={{ width: 260, height: 300 }}>
          {images.map((img, i) => {
            const rot = BASE_ROTATIONS[i % BASE_ROTATIONS.length];
            const isActive = i === activeIndex;
            const zIndex = isActive ? 10 : i;
            return (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className="absolute cursor-pointer transition-all duration-300 shadow-xl hover:scale-105"
                style={{
                  width: 220,
                  backgroundColor: "#ffffff",
                  padding: "12px 12px 40px 12px",
                  transform: `rotate(${isActive ? 0 : rot}deg) ${isActive ? "scale(1.05)" : ""}`,
                  zIndex,
                  top: isActive ? 0 : i * 2,
                  left: isActive ? 0 : i * 1,
                }}
              >
                <SafeImage
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover"
                  style={{ height: 180 }}
                />
                {img.caption && (
                  <p className="mt-2 text-center text-xs font-handwriting text-gray-500 italic">{img.caption}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Thumbnails */}
        <div className="flex flex-col justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="w-12 h-12 overflow-hidden border-2 transition-all"
              style={{
                borderColor: i === activeIndex ? "var(--morph-primary)" : "transparent",
                borderRadius: "4px",
              }}
            >
              <SafeImage src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
