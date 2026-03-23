import type { LogoCloudProps } from "@/lib/morphing/config-schema";

export function LogoCloud({ title, logos, columns = 4 }: LogoCloudProps) {
  if (!logos || logos.length === 0) return null;

  return (
    <div className="px-6 py-12">
      {title && (
        <h2 className="text-center text-xl font-semibold opacity-60 mb-8 uppercase tracking-widest text-sm">
          {title}
        </h2>
      )}
      <div
        className="grid gap-8 items-center justify-items-center"
        style={{ gridTemplateColumns: `repeat(${Math.min(columns, logos.length)}, minmax(0, 1fr))` }}
      >
        {logos.map((logo, i) => {
          const img = (
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            />
          );
          return logo.url ? (
            <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer">
              {img}
            </a>
          ) : (
            <div key={i}>{img}</div>
          );
        })}
      </div>
    </div>
  );
}
