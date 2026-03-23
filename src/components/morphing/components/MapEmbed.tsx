import type { MapEmbedProps } from "@/lib/morphing/config-schema";

export function MapEmbed({ location, height = 400 }: MapEmbedProps) {
  const encoded = encodeURIComponent(location);
  const src = `https://maps.google.com/maps?q=${encoded}&output=embed&z=13`;

  return (
    <div className="px-6 py-8">
      <div
        className="w-full overflow-hidden"
        style={{ height, borderRadius: "var(--morph-radius)" }}
      >
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${location}`}
        />
      </div>
    </div>
  );
}
