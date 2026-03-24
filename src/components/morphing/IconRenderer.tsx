/**
 * Maps Lucide icon name strings (from Gemini) to actual Lucide components.
 * Falls back to a generic circle if the icon name isn't found.
 */
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface IconRendererProps extends LucideProps {
  name: string;
}

export function IconRenderer({ name, size = 24, color, ...props }: IconRendererProps) {
  // Convert common name formats: "star", "Star", "star-circle", "StarCircle"
  const normalize = (s: string) =>
    s
      .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toUpperCase());

  const key = normalize(name) as IconName;
  const Icon = (LucideIcons[key] ?? LucideIcons["Circle"]) as React.FC<LucideProps>;

  return <Icon size={size} color={color ?? "currentColor"} {...props} />;
}
