"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/morphing/config-schema";
import { COMPONENT_REGISTRY } from "./registry";

const LIVE_COMPONENT_TYPES = new Set(["live_counter", "reaction_cloud", "interactive_poll"]);

interface MorphRendererProps {
  config: SiteConfig;
  cycleId?: string;
  liveState?: Record<number, unknown>;
}

function getBgPatternStyle(pattern: string | undefined, secondary: string): React.CSSProperties {
  switch (pattern) {
    case "dots":
      return { backgroundImage: "radial-gradient(circle, rgba(128,128,128,0.18) 1px, transparent 1px)", backgroundSize: "24px 24px" };
    case "grid":
      return { backgroundImage: "linear-gradient(rgba(128,128,128,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px" };
    case "diagonal":
      return { backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(128,128,128,0.07) 18px, rgba(128,128,128,0.07) 19px)" };
    case "crosshatch":
      return { backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(128,128,128,0.07) 14px, rgba(128,128,128,0.07) 15px), repeating-linear-gradient(-45deg, transparent, transparent 14px, rgba(128,128,128,0.07) 14px, rgba(128,128,128,0.07) 15px)" };
    case "gradient":
      return { backgroundImage: `linear-gradient(135deg, transparent 0%, ${secondary}55 100%)` };
    case "noise":
      return { backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px 256px" };
    default:
      return {};
  }
}

export function MorphRenderer({ config, cycleId, liveState }: MorphRendererProps) {
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

  // Normalize slug the same way the sanitizer does, so lookup always matches
  const normalizeSlug = (s: string) => s.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

  // Determine which page's components to render
  const activePage = currentSlug
    ? config.pages?.find((p) => p.slug === normalizeSlug(currentSlug))
    : null;
  // If slug was set but no page found, fall back to homepage (don't show a ghost page)
  const componentsToRender = activePage ? activePage.components : config.components;

  const sorted = [...componentsToRender].sort((a, b) => a.order - b.order);
  const pages = config.pages ?? [];
  const patternStyle = getBgPatternStyle(theme.background_pattern, theme.secondary_color);

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
        ...patternStyle,
      } as React.CSSProperties}
    >
      <style>{`
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--morph-font-heading) !important;
        }
      `}</style>
      {sorted.map((comp, idx) => {
        const Component = COMPONENT_REGISTRY[comp.type];
        if (!Component) return null;
        // Inject navigation helpers into nav/footer components
        const navProps =
          comp.type === "navigation" || comp.type === "footer"
            ? {
                _navigate: (slug: string | null) => setCurrentSlug(slug ? normalizeSlug(slug) : null),
                _currentSlug: currentSlug,
                _pages: pages,
              }
            : {};
        // Inject live state props into live interactive components
        const liveProps = LIVE_COMPONENT_TYPES.has(comp.type)
          ? {
              _cycleId: cycleId,
              _componentIndex: idx,
              _liveState: liveState ? liveState[idx] : undefined,
            }
          : {};
        return <Component key={comp.id} {...comp.props} {...navProps} {...liveProps} />;
      })}
    </div>
  );
}
