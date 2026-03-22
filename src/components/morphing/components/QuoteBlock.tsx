import type { QuoteProps } from "@/lib/morphing/config-schema";

export function QuoteBlock({ quote, author, source }: QuoteProps) {
  return (
    <section className="px-8 py-20 text-center">
      <blockquote className="max-w-3xl mx-auto">
        <p className="text-2xl md:text-3xl font-light italic leading-relaxed opacity-90">
          &ldquo;{quote}&rdquo;
        </p>
        <footer className="mt-6">
          <span className="font-semibold" style={{ color: "var(--morph-primary)" }}>
            {author}
          </span>
          {source && <span className="ml-2 text-sm opacity-50">— {source}</span>}
        </footer>
      </blockquote>
    </section>
  );
}
