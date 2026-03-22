import type { GalleryProps } from "@/lib/morphing/config-schema";

export function GalleryGrid({ images, columns = 3 }: GalleryProps) {
  return (
    <section className="px-8 py-16">
      <div
        className="grid gap-4 max-w-6xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${Math.min(columns, 6)}, minmax(0, 1fr))` }}
      >
        {images?.map((img, i) => (
          <figure key={i} className="group overflow-hidden" style={{ borderRadius: "var(--morph-radius)" }}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {img.caption && (
              <figcaption className="p-3 text-sm opacity-70">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
