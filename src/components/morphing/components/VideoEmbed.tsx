import type { VideoEmbedProps } from "@/lib/morphing/config-schema";

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

export function VideoEmbed({ url, title, aspect = "16:9" }: VideoEmbedProps) {
  const paddingBottom = aspect === "4:3" ? "75%" : "56.25%";

  const ytId = extractYouTubeId(url);
  const vmId = extractVimeoId(url);

  if (!ytId && !vmId) {
    return (
      <div className="px-6 py-8 text-center opacity-50">
        <p className="text-sm">[Video unavailable: unrecognized URL]</p>
      </div>
    );
  }

  const src = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0`
    : `https://player.vimeo.com/video/${vmId}`;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {title && (
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--morph-primary)" }}>
          {title}
        </h2>
      )}
      <div className="relative w-full" style={{ paddingBottom }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          style={{ borderRadius: "var(--morph-radius)" }}
          src={src}
          title={title || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
