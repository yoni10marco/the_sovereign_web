"use client";
import { useState } from "react";
import type { HeroProps } from "@/lib/morphing/config-schema";

export function HeroSection({ headline, subheadline, background_image, cta_text, alignment = "center" }: HeroProps) {
  const [bgFailed, setBgFailed] = useState(false);
  const alignClass = alignment === "left" ? "text-left items-start" : alignment === "right" ? "text-right items-end" : "text-center items-center";
  const effectiveBg = background_image && !bgFailed ? background_image : undefined;

  return (
    <section
      className={`relative flex flex-col justify-center ${alignClass} min-h-[60vh] px-4 sm:px-8 py-12 sm:py-20`}
      style={{
        backgroundImage: effectiveBg ? `url(${effectiveBg})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {background_image && !bgFailed && (
        <img
          src={background_image}
          alt=""
          aria-hidden="true"
          className="hidden"
          onError={() => setBgFailed(true)}
        />
      )}
      {effectiveBg && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight" style={{ color: "var(--morph-primary)" }}>
          {headline}
        </h1>
        <p className="mt-4 text-base sm:text-xl md:text-2xl opacity-80">{subheadline}</p>
        {cta_text && (
          <button
            className="mt-8 px-6 sm:px-8 py-3 font-semibold rounded-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: "var(--morph-accent)",
              color: "var(--morph-background)",
              borderRadius: "var(--morph-radius)",
            }}
          >
            {cta_text}
          </button>
        )}
      </div>
    </section>
  );
}
