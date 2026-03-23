import type { FeaturesProps } from "@/lib/morphing/config-schema";

export function FeatureCards({ features }: FeaturesProps) {
  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {features?.map((f, i) => (
          <div
            key={i}
            className="p-5 sm:p-6 border border-current/10 hover:border-current/20 transition-colors"
            style={{ borderRadius: "var(--morph-radius)" }}
          >
            {f.icon && <span className="text-3xl mb-4 block">{f.icon}</span>}
            <h3 className="text-lg font-semibold" style={{ color: "var(--morph-primary)" }}>
              {f.title}
            </h3>
            <p className="mt-2 text-sm opacity-70">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
