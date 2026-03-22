import type { SiteConfig, ComponentType } from "./config-schema";

const VALID_TYPES: ComponentType[] = [
  "navigation", "hero", "bento_grid", "article", "gallery", "ticker",
  "cta_banner", "testimonials", "stats", "features", "faq", "pricing",
  "team", "footer", "quote",
];

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

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
  const components = config.components as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(components) || components.length === 0) return null;

  const sanitized = components.filter((c) => {
    if (!c.type || !VALID_TYPES.includes(c.type as ComponentType)) return false;
    if (typeof c.order !== "number") return false;

    // Strip any props that look like script injection
    if (c.props && typeof c.props === "object") {
      const propsStr = JSON.stringify(c.props);
      if (/<script/i.test(propsStr) || /javascript:/i.test(propsStr) || /on\w+\s*=/i.test(propsStr)) {
        return false;
      }
    }

    return true;
  });

  if (sanitized.length === 0) return null;

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
    components: sanitized.map((c) => ({
      type: c.type as ComponentType,
      id: String(c.id || crypto.randomUUID()),
      props: (c.props as Record<string, unknown>) || {},
      order: Number(c.order),
    })),
  };
}
