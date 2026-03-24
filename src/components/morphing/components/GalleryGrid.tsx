import type { GalleryProps } from "@/lib/morphing/config-schema";
import { SafeImage } from "../SafeImage";

export function GalleryGrid({ images, columns = 3 }: GalleryProps) {
  const cols = Math.min(columns, 6);
  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16">
      <div
        className="grid gap-3 sm:gap-4 max-w-6xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {images?.map((img, i) => (
          <figure key={i} className="group overflow-hidden" style={{ borderRadius: "var(--morph-radius)" }}>
            <SafeImage
              src={img.src}
              alt={img.alt}
              className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {img.caption && (
              <figcaption className="p-2 sm:p-3 text-sm opacity-70">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
