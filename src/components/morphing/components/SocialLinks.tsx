import type { SocialLinksProps } from "@/lib/morphing/config-schema";
import { Music2, MessageCircle, Play, Video, Rss, Hash, AtSign, Share2, Link as LinkIcon } from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconComp = React.FC<LucideProps>;

const PLATFORM_ICONS: Record<string, IconComp> = {
  twitter:   AtSign,
  x:         AtSign,
  instagram: Hash,
  facebook:  Share2,
  linkedin:  LinkIcon,
  youtube:   Play,
  github:    MessageCircle,
  tiktok:    Music2,
  discord:   MessageCircle,
  twitch:    Video,
  spotify:   Music2,
  rss:       Rss,
};

const PLATFORM_TEXT: Record<string, string> = {
  pinterest: "P",
  snapchat:  "Snap",
  reddit:    "r/",
};

export function SocialLinks({ links, size = "md", layout = "row" }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  const iconSize = size === "sm" ? 14 : size === "lg" ? 22 : 18;
  const btnClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm";
  const containerClass = layout === "grid" ? "grid grid-cols-4 gap-3" : "flex flex-wrap gap-3 justify-center";

  return (
    <div className="px-6 py-8 flex justify-center">
      <div className={containerClass}>
        {links.map((link, i) => {
          const key = link.platform.toLowerCase();
          const Icon = PLATFORM_ICONS[key];
          const text = PLATFORM_TEXT[key] ?? link.platform[0].toUpperCase();
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label || link.platform}
              className={`${btnClass} flex items-center justify-center font-bold rounded-full transition-all hover:scale-110`}
              style={{
                background: "var(--morph-secondary)",
                color: "var(--morph-primary)",
                borderRadius: "var(--morph-radius)",
              }}
            >
              {Icon ? <Icon size={iconSize} /> : text}
            </a>
          );
        })}
      </div>
    </div>
  );
}
