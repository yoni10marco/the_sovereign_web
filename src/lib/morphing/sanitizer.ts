import type { SiteConfig, ComponentType, PageConfig } from "./config-schema";

const VALID_TYPES: ComponentType[] = [
  "navigation", "hero", "bento_grid", "article", "gallery", "ticker",
  "cta_banner", "testimonials", "stats", "features", "faq", "pricing",
  "team", "footer", "quote",
  "video_embed", "map_embed", "countdown_timer", "image_carousel",
  "timeline", "logo_cloud", "social_links", "image_text_split",
  "callout_box", "masonry_gallery", "contact_form", "embed_block",
  "code_block", "marquee", "profile_card", "numbered_steps",
  "comparison_table", "newsletter_signup",
];

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

function sanitizeComponentArray(components: unknown): Array<{
  type: ComponentType;
  id: string;
  props: Record<string, unknown>;
  order: number;
}> {
  if (!Array.isArray(components)) return [];

  return components.filter((c) => {
    if (!c || typeof c !== "object") return false;
    const comp = c as Record<string, unknown>;
    if (!comp.type || !VALID_TYPES.includes(comp.type as ComponentType)) return false;
    if (typeof comp.order !== "number") return false;

    // Strip any props that look like script injection
    if (comp.props && typeof comp.props === "object") {
      const propsStr = JSON.stringify(comp.props);
      if (/<script/i.test(propsStr) || /javascript:/i.test(propsStr) || /on\w+\s*=/i.test(propsStr)) {
        return false;
      }
    }

    return true;
  }).map((c) => ({
    type: c.type as ComponentType,
    id: String(c.id || crypto.randomUUID()),
    props: (c.props as Record<string, unknown>) || {},
    order: Number(c.order),
  }));
}

export function sanitizeConfig(raw: unknown): SiteConfig | null {
  if (!raw || typeof raw !== "object") return null;

  const config = raw as Record<string, unknown>;

  // Validate theme
  const theme = config.theme as Record<string, string> | undefined;
  if (!theme) return null;

  const colorFields = ["primary_color", "secondary_color", "background_color", "text_color", "accent_color"];
  for (const field of colorFields) {
    if (!theme[field] || !HEX_COLOR.test(theme[field])) return null;
  }

  // Validate components
  const components = sanitizeComponentArray(config.components);
  if (components.length === 0) return null;

  // Sanitize optional pages (max 10 sub-pages, max depth is homepage + 1 level)
  let pages: PageConfig[] | undefined;
  if (Array.isArray(config.pages) && config.pages.length > 0) {
    const sanitizedPages = (config.pages as unknown[])
      .slice(0, 10)
      .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
      .map((p) => ({
        slug: String(p.slug || "").replace(/[^a-z0-9-]/gi, "-").toLowerCase(),
        title: String(p.title || "Page"),
        components: sanitizeComponentArray(p.components),
      }))
      .filter((p) => p.slug && p.components.length > 0);

    if (sanitizedPages.length > 0) pages = sanitizedPages;
  }

  return {
    id: String(config.id || "unknown"),
    cycle_number: Number(config.cycle_number || 0),
    theme: {
      primary_color: theme.primary_color,
      secondary_color: theme.secondary_color,
      background_color: theme.background_color,
      text_color: theme.text_color,
      accent_color: theme.accent_color,
      font_heading: String(theme.font_heading || "Inter"),
      font_body: String(theme.font_body || "Inter"),
      border_radius: String(theme.border_radius || "0.5rem"),
    },
    components,
    ...(pages ? { pages } : {}),
  };
}
