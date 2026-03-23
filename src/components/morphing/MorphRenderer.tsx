"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/morphing/config-schema";
import { COMPONENT_REGISTRY } from "./registry";

interface MorphRendererProps {
  config: SiteConfig;
}

export function MorphRenderer({ config }: MorphRendererProps) {
  const { theme } = config;
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  // Dynamically load Google Fonts for the theme's fonts
  useEffect(() => {
    const fonts = [theme.font_heading, theme.font_body].filter(
      (f) => f && f !== "Inter" && f !== "sans-serif" && f !== "serif"
    );
    const unique = [...new Set(fonts)];
    if (unique.length === 0) return;

    const families = unique.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`).join("&");
    const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;

    // Don't add duplicate links
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [theme.font_heading, theme.font_body]);

  // Determine which page's components to render
  const activePage = currentSlug
    ? config.pages?.find((p) => p.slug === currentSlug)
    : null;
  const componentsToRender = activePage ? activePage.components : config.components;

  const sorted = [...componentsToRender].sort((a, b) => a.order - b.order);
  const pages = config.pages ?? [];

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
        "--morph-font-heading": `"${theme.font_heading}", sans-serif`,
        "--morph-font-body": `"${theme.font_body}", sans-serif`,
        backgroundColor: theme.background_color,
        color: theme.text_color,
        fontFamily: `"${theme.font_body}", sans-serif`,
      } as React.CSSProperties}
    >
      <style>{`
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--morph-font-heading) !important;
        }
      `}</style>
      {sorted.map((comp) => {
        const Component = COMPONENT_REGISTRY[comp.type];
        if (!Component) return null;
        // Inject navigation helpers into nav/footer components
        const extraProps =
          comp.type === "navigation" || comp.type === "footer"
            ? { _navigate: setCurrentSlug, _currentSlug: currentSlug, _pages: pages }
            : {};
        return <Component key={comp.id} {...comp.props} {...extraProps} />;
      })}
    </div>
  );
}
