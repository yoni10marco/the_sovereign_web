import type { MeshGradientProps } from "@/lib/morphing/config-schema";

export function MeshGradient({ title, subtitle, cta_text, cta_url, colors }: MeshGradientProps) {
  const c = colors && colors.length >= 3 ? colors : ["var(--morph-primary)", "var(--morph-accent)", "var(--morph-secondary)"];

  return (
    <section className="relative px-4 sm:px-8 py-20 sm:py-32 overflow-hidden">
      {/* Animated mesh blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-60"
          style={{
            background: c[0],
            top: "-20%",
            left: "-10%",
            animation: "meshMove1 8s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
          style={{
            background: c[1],
            bottom: "-20%",
            right: "-10%",
            animation: "meshMove2 10s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-40"
          style={{
            background: c[2],
            top: "40%",
            left: "40%",
            animation: "meshMove3 12s ease-in-out infinite alternate",
          }}
        />
      </div>

      <style>{`
        @keyframes meshMove1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,40px) scale(1.15); } }
        @keyframes meshMove2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-50px,-30px) scale(1.1); } }
        @keyframes meshMove3 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-50px) scale(1.2); } }
      `}</style>

      <div className="relative text-center max-w-3xl mx-auto z-10">
        {title && <h2 className="text-4xl sm:text-6xl font-bold mb-4" style={{ color: "var(--morph-text)" }}>{title}</h2>}
        {subtitle && <p className="text-lg sm:text-xl opacity-80 mb-8" style={{ color: "var(--morph-text)" }}>{subtitle}</p>}
        {cta_text && (
          <a
            href={cta_url ?? "#"}
            className="inline-block px-8 py-3 font-semibold text-sm uppercase tracking-wide shadow-lg hover:scale-105 transition-transform"
            style={{
              backgroundColor: "var(--morph-primary)",
              color: "var(--morph-bg)",
              borderRadius: "var(--morph-radius)",
            }}
          >
            {cta_text}
          </a>
        )}
      </div>
    </section>
  );
}
