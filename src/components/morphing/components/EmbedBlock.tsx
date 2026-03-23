import type { EmbedBlockProps } from "@/lib/morphing/config-schema";

export function EmbedBlock({ url, title, height = 500 }: EmbedBlockProps) {
  // Only allow https URLs
  if (!url || !/^https:\/\//i.test(url)) {
    return (
      <div className="px-6 py-8 text-center opacity-50">
        <p className="text-sm">[Embed blocked: only HTTPS URLs are allowed]</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {title && (
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--morph-primary)" }}>
          {title}
        </h2>
      )}
      <div className="w-full overflow-hidden" style={{ height, borderRadius: "var(--morph-radius)" }}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          title={title || "Embedded content"}
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
