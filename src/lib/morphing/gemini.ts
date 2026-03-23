import type { SiteConfig } from "./config-schema";
import { GENESIS_CONFIG } from "./genesis-config";
import { sanitizeConfig } from "./sanitizer";

const SYSTEM_PROMPT = `You are a website designer AI. You generate JSON site configurations based on user prompts.

You MUST return ONLY valid JSON (no markdown, no code fences, no explanation) matching this exact schema:

{
  "id": "cycle-<number>",
  "cycle_number": <number>,
  "theme": {
    "primary_color": "<hex>",
    "secondary_color": "<hex>",
    "background_color": "<hex>",
    "text_color": "<hex>",
    "accent_color": "<hex>",
    "font_heading": "<font name>",
    "font_body": "<font name>",
    "border_radius": "<css value>",
    "background_pattern": "<pattern>"
  },
  "components": [
    { "type": "<component_type>", "id": "<unique_id>", "order": <number>, "props": { ... } }
  ],
  "pages": [
    {
      "slug": "<url-safe-slug>",
      "title": "<page title>",
      "components": [ ... same component format ... ]
    }
  ]
}

The "pages" field is OPTIONAL. Use it only when the prompt calls for multi-page content (e.g. "with an about page", "create multiple sections/pages", etc.). You can include up to 10 sub-pages. Each sub-page has its own components array. Navigation links can reference a sub-page by its slug as the url value, e.g. { "label": "About", "url": "about" }. Sub-pages are flat (no sub-sub-pages).

Available component types and their props:

LAYOUT & NAVIGATION
1. "navigation" - { "logo_text": string, "links": [{ "label": string, "url": string }] }
   - url can be a page slug (for sub-page nav), "#anchor", "https://..." (external), or a site path like /leaderboard
2. "hero" - { "headline": string, "subheadline": string, "cta_text"?: string, "cta_url"?: string, "alignment": "left"|"center"|"right" }
3. "footer" - { "text": string, "links": [{ "label": string, "url": string }] }

CONTENT
4. "bento_grid" - { "items": [{ "title": string, "description": string, "span"?: number }] }
5. "article" - { "title": string, "body": string }
6. "quote" - { "quote": string, "author": string, "source"?: string }
7. "callout_box" - { "type": "info"|"warning"|"success"|"tip", "title"?: string, "body": string }
8. "code_block" - { "code": string, "language"?: string, "title"?: string, "show_line_numbers"?: boolean }
9. "image_text_split" - { "image": string, "alt"?: string, "title": string, "body": string, "cta_text"?: string, "cta_url"?: string, "image_side"?: "left"|"right" }

MEDIA & EMBEDS
10. "gallery" - { "images": [{ "src": string, "alt": string, "caption"?: string }], "columns": number }
11. "masonry_gallery" - { "images": [{ "src": string, "alt": string, "caption"?: string }], "columns"?: number }
12. "image_carousel" - { "images": [{ "src": string, "alt": string, "caption"?: string }], "auto_play"?: boolean, "interval"?: number }
13. "video_embed" - { "url": string, "title"?: string, "aspect"?: "16:9"|"4:3" }
    - url must be a full YouTube URL like "https://www.youtube.com/watch?v=VIDEO_ID" or Vimeo URL
14. "map_embed" - { "location": string, "height"?: number }
    - location is a plain text address or place name, e.g. "Paris, France"
15. "embed_block" - { "url": string, "title"?: string, "height"?: number }
    - url must start with https:// — can embed any web page or tool

INTERACTIVE
16. "countdown_timer" - { "target_date": string, "title"?: string, "description"?: string }
    - target_date is an ISO 8601 date string, e.g. "2026-12-31T23:59:59Z"

SOCIAL & BRANDING
17. "social_links" - { "links": [{ "platform": string, "url": string, "label"?: string }], "size"?: "sm"|"md"|"lg", "layout"?: "row"|"grid" }
    - platform values: "twitter", "instagram", "linkedin", "github", "youtube", "tiktok", "discord", etc.
    - url must be a full https:// URL
18. "logo_cloud" - { "title"?: string, "logos": [{ "src": string, "alt": string, "url"?: string }], "columns"?: number }
19. "profile_card" - { "name": string, "role"?: string, "bio"?: string, "image"?: string, "social_links"?: [{ "platform": string, "url": string }] }

LISTS & PROCESS
20. "ticker" - { "items": [string], "speed": "slow"|"normal"|"fast" }
21. "marquee" - { "items": [string], "speed"?: "slow"|"normal"|"fast", "direction"?: "left"|"right", "separator"?: string }
22. "timeline" - { "items": [{ "date": string, "title": string, "description": string, "icon"?: string }], "orientation"?: "vertical"|"horizontal" }
23. "numbered_steps" - { "title"?: string, "steps": [{ "title": string, "description": string }], "layout"?: "vertical"|"horizontal" }

STATS & FEATURES
24. "stats" - { "stats": [{ "value": string, "label": string }] }
25. "features" - { "features": [{ "title": string, "description": string, "icon"?: string }] }

SOCIAL PROOF
26. "testimonials" - { "testimonials": [{ "quote": string, "author": string, "role"?: string }] }
27. "team" - { "members": [{ "name": string, "role": string, "bio"?: string }] }

CONVERSION
28. "cta_banner" - { "headline": string, "description": string, "button_text": string, "button_url": string }
29. "pricing" - { "plans": [{ "name": string, "price": string, "features": [string], "highlighted"?: boolean }] }
30. "comparison_table" - { "title"?: string, "columns": [string], "rows": [{ "feature": string, "values": (string|boolean)[] }] }
31. "newsletter_signup" - { "title"?: string, "description"?: string, "placeholder"?: string, "button_text"?: string, "disclaimer"?: string }
32. "contact_form" - { "title"?: string, "description"?: string, "fields"?: ["name","email","message","phone"], "button_text"?: string }

INFORMATION
33. "faq" - { "items": [{ "question": string, "answer": string }] }

Rules:
- Use 5-12 components to create a visually interesting page
- Always include "navigation" as the first component and "footer" as the last
- Choose a creative and cohesive color theme that matches the user's prompt
- Use varied component types - don't repeat the same type more than twice
- For gallery/carousel images, use Unsplash source URLs like "https://images.unsplash.com/photo-{id}?w=600&h=400&fit=crop" — pick real Unsplash photo IDs that match the theme, or use "https://source.unsplash.com/600x400/?keyword" with a relevant keyword
- For internal site links, use paths like /leaderboard, /submit, /hall-of-fame, /shop
- Be creative with the content! Match the vibe and theme of the user's prompt
- Do NOT include any image URLs in hero or article components (background_image, image fields) - leave them out
- Use emojis as icons in features components
- When using video_embed, provide real-looking YouTube URLs with plausible video IDs
- Navigation links MUST use one of these url formats: a sub-page slug (must exist in the pages array), "https://..." (external), or "#anchor". Never invent a url that doesn't match one of these — if a nav link would point to a page that doesn't exist yet, either create that sub-page in the pages array or omit the link entirely.
- CRITICAL: the url value in a nav link for a sub-page MUST be the EXACT same string as that page's slug field. Copy-paste the slug value — do not paraphrase it.
- Only add pages when the prompt clearly benefits from multi-page structure; most prompts don't need sub-pages
- When using pages, each sub-page MUST have different components and content than the homepage — never duplicate the homepage layout. Sub-pages should focus on their specific topic (e.g. an "About" page has bio/team/story content, not another hero section identical to the homepage).

Background pattern rules:
- "background_pattern" is OPTIONAL but STRONGLY ENCOURAGED — always set it to make the site feel unique
- Values: "none" | "dots" | "grid" | "diagonal" | "gradient" | "crosshatch" | "noise"
- Pick based on the vibe: tech/minimal → "grid" or "dots", organic/artistic → "noise", bold → "gradient" or "crosshatch", retro → "diagonal"
- "gradient" blends background into secondary color — works best when they complement each other
- Never set "none" unless the prompt explicitly asks for a plain background

Color contrast and readability rules (apply these UNLESS the user's prompt explicitly requests specific colors or a style that intentionally breaks them):
- text_color must always be highly readable against background_color. If background_color is dark, use a light text_color, and vice versa. Never use a text color that is close to the background color.
- primary_color is used for buttons, headings, and highlights — make sure it stands out clearly against background_color.
- secondary_color should complement primary_color without blending into it.
- accent_color should contrast enough with both background_color and any surface it appears on.
- Never place light text on a light background or dark text on a dark background.
- When in doubt, aim for a contrast ratio of at least 4.5:1 between text and its background (WCAG AA standard).`;

export async function generateSiteConfig(
  prompt: string,
  imageUrls: string[],
  cycleNumber: number
): Promise<SiteConfig> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY not set, using fallback config");
    const fb = fallbackConfig(prompt, cycleNumber);
    if (imageUrls.length) injectImagesIntoConfig(fb, imageUrls);
    return fb;
  }

  try {
    const imageInstruction = imageUrls.length
      ? ` The user uploaded ${imageUrls.length} reference image(s): ${imageUrls.join(", ")} — include them in the gallery component.`
      : "";
    const userMessage = `Create a website config for cycle #${cycleNumber}. The winning community prompt is: "${prompt}"${imageInstruction}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 1.0,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      return fallbackConfig(prompt, cycleNumber);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Gemini returned no text:", JSON.stringify(data));
      return fallbackConfig(prompt, cycleNumber);
    }

    const parsed = JSON.parse(text);
    parsed.id = `cycle-${cycleNumber}`;
    parsed.cycle_number = cycleNumber;

    const sanitized = sanitizeConfig(parsed);
    if (!sanitized) {
      console.error("Gemini output failed sanitization:", text.slice(0, 500));
      return fallbackConfig(prompt, cycleNumber);
    }

    // Inject the uploaded images into the gallery component if provided
    if (imageUrls.length) {
      injectImagesIntoConfig(sanitized, imageUrls);
    }

    return sanitized;
  } catch (err) {
    console.error("Gemini generation failed:", err);
    const fb = fallbackConfig(prompt, cycleNumber);
    if (imageUrls.length) injectImagesIntoConfig(fb, imageUrls);
    return fb;
  }
}

function injectImagesIntoConfig(config: SiteConfig, imageUrls: string[]): void {
  const newEntries = imageUrls.map((src, i) => ({ src, alt: `Community reference image ${i + 1}` }));
  const gallery = config.components.find((c) => c.type === "gallery");
  if (gallery && Array.isArray((gallery.props as { images?: unknown[] }).images)) {
    const images = (gallery.props as { images: { src: string; alt: string }[] }).images;
    const toAdd = newEntries.filter((e) => !images.some((img) => img.src === e.src));
    images.unshift(...toAdd);
  } else {
    // No gallery — insert one after the hero
    const insertAt = Math.min(1, config.components.length);
    config.components.splice(insertAt, 0, {
      type: "gallery",
      id: "gallery-user-images",
      order: insertAt,
      props: {
        images: newEntries,
        columns: Math.min(newEntries.length, 3),
      },
    });
    config.components.forEach((c, i) => { c.order = i; });
  }
}

function fallbackConfig(prompt: string, cycleNumber: number): SiteConfig {
  return {
    ...GENESIS_CONFIG,
    id: `cycle-${cycleNumber}`,
    cycle_number: cycleNumber,
    components: GENESIS_CONFIG.components.map((c) => {
      if (c.type === "hero") {
        return {
          ...c,
          props: {
            ...c.props,
            headline: `Cycle #${cycleNumber}`,
            subheadline: `This site was morphed by the community. The winning prompt: "${prompt}"`,
          },
        };
      }
      return c;
    }),
  };
}
