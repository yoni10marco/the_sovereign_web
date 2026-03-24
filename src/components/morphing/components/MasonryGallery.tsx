import type { MasonryGalleryProps } from "@/lib/morphing/config-schema";
import { SafeImage } from "../SafeImage";

export function MasonryGallery({ images, columns = 3 }: MasonryGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="px-6 py-8">
      <div
        style={{
          columns: `${columns}`,
          columnGap: "1rem",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden mb-4 group"
            style={{ breakInside: "avoid", borderRadius: "var(--morph-radius)" }}
          >
            <SafeImage src={img.src} alt={img.alt} className="w-full h-auto block" />
            {img.caption && (
              <div className="absolute inset-0 flex items-end bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                <p className="w-full px-3 py-2 text-white text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {img.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
