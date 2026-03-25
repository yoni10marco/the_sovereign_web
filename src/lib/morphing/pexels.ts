/**
 * Pexels image resolver.
 *
 * Gemini outputs placeholder URLs like `pexels://coffee/landscape` or
 * `pexels://architecture/square`. This module resolves them to real
 * Pexels CDN URLs server-side during config generation.
 *
 * Falls back to loremflickr if PEXELS_API_KEY is not set.
 */

import type { SiteConfig, ComponentConfig } from "./config-schema";

const PEXELS_API = "https://api.pexels.com/v1/search";
const FALLBACK_BASE = "https://loremflickr.com";

// Cache keyword → resolved URL within a single generation run
const cache = new Map<string, string[]>();

type Orientation = "landscape" | "portrait" | "square";

function parsePlaceholder(url: string): { keyword: string; orientation: Orientation } | null {
  if (!url?.startsWith("pexels://")) return null;
  // Format: pexels://KEYWORD or pexels://KEYWORD/ORIENTATION
  const rest = url.slice("pexels://".length);
  const parts = rest.split("/");
  const keyword = parts[0];
  const orientation = (["landscape", "portrait", "square"].includes(parts[1]) ? parts[1] : "landscape") as Orientation;
  return keyword ? { keyword, orientation } : null;
}

function fallbackUrl(keyword: string, orientation: Orientation): string {
  const dims = orientation === "portrait" ? "600/800" : orientation === "square" ? "600/600" : "800/600";
  return `${FALLBACK_BASE}/${dims}/${encodeURIComponent(keyword)}`;
}

async function fetchPexelsUrls(keyword: string, orientation: Orientation, count: number): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return Array.from({ length: count }, (_, i) =>
      fallbackUrl(keyword, orientation) + (i > 0 ? `?lock=${i}` : "")
    );
  }

  const cacheKey = `${keyword}:${orientation}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    // Return cycling through cached results
    return Array.from({ length: count }, (_, i) => cached[i % cached.length]);
  }

  try {
    const res = await fetch(
      `${PEXELS_API}?query=${encodeURIComponent(keyword)}&per_page=10&orientation=${orientation}`,
      { headers: { Authorization: apiKey } }
    );
    if (!res.ok) throw new Error(`Pexels ${res.status}`);
    const data = await res.json() as { photos: { src: { large: string; medium: string } }[] };
    const urls = data.photos.map((p) =>
      orientation === "portrait" ? p.src.medium : p.src.large
    );
    if (urls.length === 0) throw new Error("No results");
    cache.set(cacheKey, urls);
    return Array.from({ length: count }, (_, i) => urls[i % urls.length]);
  } catch (err) {
    console.warn(`Pexels fetch failed for "${keyword}": ${err}`);
    return Array.from({ length: count }, (_, i) =>
      fallbackUrl(keyword, orientation) + (i > 0 ? `?lock=${i}` : "")
    );
  }
}

// --- Config walker ---

type ImageEntry = { keyword: string; orientation: Orientation };

function collectImagePlaceholders(components: ComponentConfig[]): Map<string, ImageEntry> {
  const found = new Map<string, ImageEntry>(); // placeholder url → entry

  function check(url: unknown) {
    if (typeof url !== "string") return;
    const parsed = parsePlaceholder(url);
    if (parsed) found.set(url, parsed);
  }

  for (const comp of components) {
    const p = comp.props as Record<string, unknown>;
    switch (comp.type) {
      case "gallery":
      case "masonry_gallery":
      case "image_carousel":
      case "polaroid_stack":
        for (const img of ((p.images as { src?: unknown }[]) ?? [])) check(img.src);
        break;
      case "image_text_split": check(p.image); break;
      case "magazine_spread": check(p.image); break;
      case "profile_card": check(p.image); break;
      case "glassmorphism_panel": check(p.background_image); break;
      case "scratch_card": check(p.reveal_image); break;
      case "bento_grid":
        for (const item of ((p.items as { image?: unknown }[]) ?? [])) check(item.image);
        break;
      case "team":
        for (const m of ((p.members as { image?: unknown }[]) ?? [])) check(m.image);
        break;
      case "testimonials":
        for (const t of ((p.testimonials as { avatar?: unknown }[]) ?? [])) check(t.avatar);
        break;
      case "logo_cloud":
        for (const logo of ((p.logos as { src?: unknown }[]) ?? [])) check(logo.src);
        break;
    }
  }
  return found;
}

async function buildReplacementMap(placeholders: Map<string, ImageEntry>): Promise<Map<string, string>> {
  // Group by keyword+orientation to batch-fetch
  const groups = new Map<string, { placeholder: string; entry: ImageEntry }[]>();
  for (const [placeholder, entry] of placeholders) {
    const key = `${entry.keyword}:${entry.orientation}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ placeholder, entry });
  }

  const replacements = new Map<string, string>();

  await Promise.all(
    Array.from(groups.entries()).map(async ([, items]) => {
      const { keyword, orientation } = items[0].entry;
      const urls = await fetchPexelsUrls(keyword, orientation, items.length);
      items.forEach(({ placeholder }, i) => {
        replacements.set(placeholder, urls[i]);
      });
    })
  );

  return replacements;
}

function applyReplacements(components: ComponentConfig[], replacements: Map<string, string>) {
  function replace(url: unknown): unknown {
    if (typeof url !== "string") return url;
    return replacements.get(url) ?? url;
  }

  for (const comp of components) {
    const p = comp.props as Record<string, unknown>;
    switch (comp.type) {
      case "gallery":
      case "masonry_gallery":
      case "image_carousel":
      case "polaroid_stack":
        for (const img of ((p.images as { src?: unknown }[]) ?? [])) {
          img.src = replace(img.src);
        }
        break;
      case "image_text_split": p.image = replace(p.image); break;
      case "magazine_spread": p.image = replace(p.image); break;
      case "profile_card": p.image = replace(p.image); break;
      case "glassmorphism_panel": p.background_image = replace(p.background_image); break;
      case "scratch_card": p.reveal_image = replace(p.reveal_image); break;
      case "bento_grid":
        for (const item of ((p.items as { image?: unknown }[]) ?? [])) {
          item.image = replace(item.image);
        }
        break;
      case "team":
        for (const m of ((p.members as { image?: unknown }[]) ?? [])) {
          m.image = replace(m.image);
        }
        break;
      case "testimonials":
        for (const t of ((p.testimonials as { avatar?: unknown }[]) ?? [])) {
          t.avatar = replace(t.avatar);
        }
        break;
      case "logo_cloud":
        for (const logo of ((p.logos as { src?: unknown }[]) ?? [])) {
          logo.src = replace(logo.src);
        }
        break;
    }
  }
}

/**
 * Resolves all `pexels://keyword/orientation` placeholders in a SiteConfig
 * to real Pexels CDN URLs (or loremflickr fallbacks).
 * Mutates the config in place.
 */
export async function resolveConfigImages(config: SiteConfig): Promise<void> {
  cache.clear();

  const allComponents = [
    ...config.components,
    ...(config.pages ?? []).flatMap((p) => p.components),
  ];

  const placeholders = collectImagePlaceholders(allComponents);
  if (placeholders.size === 0) return;

  const replacements = await buildReplacementMap(placeholders);

  applyReplacements(config.components, replacements);
  for (const page of config.pages ?? []) {
    applyReplacements(page.components, replacements);
  }
}
