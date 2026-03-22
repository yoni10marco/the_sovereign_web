import type { ArticleProps } from "@/lib/morphing/config-schema";

export function ArticleBlock({ title, body, image }: ArticleProps) {
  return (
    <article className="max-w-3xl mx-auto px-8 py-16">
      {image && (
        <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg mb-8" />
      )}
      <h2 className="text-3xl font-bold" style={{ color: "var(--morph-primary)" }}>
        {title}
      </h2>
      <div className="mt-6 text-lg leading-relaxed opacity-85 whitespace-pre-line">
        {body}
      </div>
    </article>
  );
}
