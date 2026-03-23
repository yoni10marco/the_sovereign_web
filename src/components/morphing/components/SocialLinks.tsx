import type { SocialLinksProps } from "@/lib/morphing/config-schema";

const PLATFORM_ICONS: Record<string, string> = {
  twitter: "𝕏",
  x: "𝕏",
  instagram: "📸",
  facebook: "f",
  linkedin: "in",
  youtube: "▶",
  tiktok: "♪",
  github: "</>",
  discord: "💬",
  twitch: "🎮",
  pinterest: "P",
  snapchat: "👻",
  reddit: "🤖",
  spotify: "🎵",
};

export function SocialLinks({ links, size = "md", layout = "row" }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm";
  const containerClass = layout === "grid" ? "grid grid-cols-4 gap-3" : "flex flex-wrap gap-3 justify-center";

  return (
    <div className="px-6 py-8 flex justify-center">
      <div className={containerClass}>
        {links.map((link, i) => {
          const icon = PLATFORM_ICONS[link.platform.toLowerCase()] ?? link.platform[0].toUpperCase();
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label || link.platform}
              className={`${sizeClass} flex items-center justify-center font-bold rounded-full transition-all hover:scale-110`}
              style={{
                background: "var(--morph-secondary)",
                color: "var(--morph-primary)",
                borderRadius: "var(--morph-radius)",
              }}
            >
              {icon}
            </a>
          );
        })}
      </div>
    </div>
  );
}
