import type { GlassmorphismPanelProps } from "@/lib/morphing/config-schema";

export function GlassmorphismPanel({ title, items, background_image }: GlassmorphismPanelProps) {
  return (
    <section
      className="px-4 sm:px-8 py-16 sm:py-24 relative overflow-hidden"
      style={{
        background: background_image
          ? `url(${background_image}) center/cover no-repeat`
          : "linear-gradient(135deg, var(--morph-primary) 0%, var(--morph-accent) 100%)",
      }}
    >
      {/* Blurred blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: "var(--morph-accent)" }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: "var(--morph-primary)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {title && (
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white drop-shadow">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/20 shadow-xl"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {item.icon && (
                <div className="text-3xl mb-3 text-white/80">{item.icon}</div>
              )}
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
