import type { TestimonialProps } from "@/lib/morphing/config-schema";

export function TestimonialCarousel({ testimonials }: TestimonialProps) {
  return (
    <section className="px-8 py-16">
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials?.map((t, i) => (
          <blockquote
            key={i}
            className="p-6 border border-current/10"
            style={{ borderRadius: "var(--morph-radius)", backgroundColor: "var(--morph-secondary)" }}
          >
            <p className="text-lg italic opacity-85">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              {t.avatar && (
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold text-sm">{t.author}</p>
                {t.role && <p className="text-xs opacity-60">{t.role}</p>}
              </div>
            </div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
