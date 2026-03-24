import type { MagazineSpreadProps } from "@/lib/morphing/config-schema";

export function MagazineSpread({ headline, kicker, body, image, pull_quote, author, tag }: MagazineSpreadProps) {
  return (
    <section className="px-4 sm:px-8 py-12 max-w-6xl mx-auto">
      {/* Kicker + tag row */}
      <div className="flex items-center gap-4 mb-4">
        {tag && (
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1"
            style={{ backgroundColor: "var(--morph-primary)", color: "var(--morph-bg)", borderRadius: "var(--morph-radius)" }}
          >
            {tag}
          </span>
        )}
        {kicker && (
          <span className="text-xs font-semibold uppercase tracking-widest opacity-60" style={{ color: "var(--morph-text)" }}>
            {kicker}
          </span>
        )}
      </div>

      {/* Big headline */}
      <h1
        className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none mb-8 uppercase"
        style={{ color: "var(--morph-text)" }}
      >
        {headline}
      </h1>

      <div className="border-t border-current/15 mb-8" />

      {/* Magazine grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main image */}
        {image && (
          <div className="lg:col-span-5">
            <img src={image} alt={headline} className="w-full h-auto object-cover shadow-lg" style={{ borderRadius: "var(--morph-radius)" }} />
          </div>
        )}

        {/* Body text in columns */}
        <div className={image ? "lg:col-span-7" : "lg:col-span-12"}>
          {pull_quote && (
            <blockquote
              className="text-2xl sm:text-3xl font-black italic border-l-4 pl-6 mb-6 leading-snug"
              style={{ borderColor: "var(--morph-primary)", color: "var(--morph-text)" }}
            >
              &ldquo;{pull_quote}&rdquo;
            </blockquote>
          )}
          <div
            className="text-sm sm:text-base leading-relaxed opacity-80"
            style={{
              color: "var(--morph-text)",
              columnCount: image ? 1 : 2,
              columnGap: "2rem",
            }}
          >
            {body?.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>
          {author && (
            <p className="mt-6 text-xs uppercase tracking-widest font-semibold opacity-50" style={{ color: "var(--morph-text)" }}>
              By {author}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
