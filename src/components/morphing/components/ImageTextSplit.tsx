import type { ImageTextSplitProps } from "@/lib/morphing/config-schema";

export function ImageTextSplit({ image, alt, title, body, cta_text, cta_url, image_side = "left" }: ImageTextSplitProps) {
  const imgEl = (
    <div className="relative h-64 md:h-auto overflow-hidden" style={{ borderRadius: "var(--morph-radius)" }}>
      <img src={image} alt={alt || title} className="w-full h-full object-cover" />
    </div>
  );

  const textEl = (
    <div className="flex flex-col justify-center py-6 md:py-0">
      <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--morph-primary)" }}>
        {title}
      </h2>
      <p className="opacity-70 leading-relaxed mb-6">{body}</p>
      {cta_text && (
        <div>
          <a
            href={cta_url || "#"}
            target={cta_url?.startsWith("http") ? "_blank" : undefined}
            rel={cta_url?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-block px-6 py-3 font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "var(--morph-accent)",
              color: "var(--morph-background)",
              borderRadius: "var(--morph-radius)",
            }}
          >
            {cta_text}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {image_side === "left" ? (
          <>{imgEl}{textEl}</>
        ) : (
          <>{textEl}{imgEl}</>
        )}
      </div>
    </div>
  );
}
