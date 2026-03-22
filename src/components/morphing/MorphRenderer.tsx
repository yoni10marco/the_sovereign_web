"use client";

import type { SiteConfig } from "@/lib/morphing/config-schema";
import { COMPONENT_REGISTRY } from "./registry";

interface MorphRendererProps {
  config: SiteConfig;
}

export function MorphRenderer({ config }: MorphRendererProps) {
  const { theme, components } = config;

  const sorted = [...components].sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        "--morph-primary": theme.primary_color,
        "--morph-secondary": theme.secondary_color,
        "--morph-background": theme.background_color,
        "--morph-text": theme.text_color,
        "--morph-accent": theme.accent_color,
        "--morph-radius": theme.border_radius,
        backgroundColor: theme.background_color,
        color: theme.text_color,
        fontFamily: `"${theme.font_body}", sans-serif`,
      } as React.CSSProperties}
    >
      {sorted.map((comp) => {
        const Component = COMPONENT_REGISTRY[comp.type];
        if (!Component) return null;
        return <Component key={comp.id} {...comp.props} />;
      })}
    </div>
  );
}
