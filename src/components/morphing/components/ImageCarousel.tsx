"use client";

import { useEffect, useState } from "react";
import type { ImageCarouselProps } from "@/lib/morphing/config-schema";

export function ImageCarousel({ images, auto_play = true, interval = 4000 }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!auto_play || images.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [auto_play, interval, images.length]);

  if (!images || images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const current = images[index];

  return (
    <div className="relative w-full overflow-hidden" style={{ borderRadius: "var(--morph-radius)" }}>
      <div className="relative h-[420px] sm:h-[520px]">
        <img
          src={current.src}
          alt={current.alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/20" />
        {current.caption && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-black/40 text-white text-sm">
            {current.caption}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
            aria-label="Next"
          >
            ›
          </button>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ background: i === index ? "var(--morph-accent)" : "rgba(255,255,255,0.5)" }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
