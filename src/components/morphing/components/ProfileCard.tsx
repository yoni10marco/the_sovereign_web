import type { ProfileCardProps } from "@/lib/morphing/config-schema";

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "𝕏 Twitter",
  x: "𝕏",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  website: "Website",
};

export function ProfileCard({ name, role, bio, image, social_links }: ProfileCardProps) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="px-6 py-12 flex justify-center">
      <div
        className="flex flex-col items-center text-center p-8 max-w-sm w-full"
        style={{ background: "var(--morph-secondary)", borderRadius: "var(--morph-radius)" }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4"
            style={{ background: "var(--morph-accent)", color: "var(--morph-background)" }}
          >
            {initials}
          </div>
        )}
        <h2 className="text-2xl font-bold" style={{ color: "var(--morph-primary)" }}>
          {name}
        </h2>
        {role && <p className="text-sm opacity-60 mt-1 font-medium uppercase tracking-wider">{role}</p>}
        {bio && <p className="mt-4 opacity-70 leading-relaxed text-sm">{bio}</p>}
        {social_links && social_links.length > 0 && (
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            {social_links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                style={{ background: "var(--morph-accent)", color: "var(--morph-background)" }}
              >
                {PLATFORM_LABELS[link.platform.toLowerCase()] ?? link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
