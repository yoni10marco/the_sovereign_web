import type { BentoGridProps } from "@/lib/morphing/config-schema";
import { SafeImage } from "../SafeImage";

export function BentoGrid({ items }: BentoGridProps) {
  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {items?.map((item, i) => (
          <div
            key={i}
            className="p-4 sm:p-6 border border-current/10 hover:border-current/20 transition-colors"
            style={{
              borderRadius: "var(--morph-radius)",
              gridColumn: item.span ? `span ${item.span}` : undefined,
              backgroundColor: "var(--morph-secondary)",
            }}
          >
            {item.image && (
              <SafeImage src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-4" />
            )}
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm opacity-70">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
