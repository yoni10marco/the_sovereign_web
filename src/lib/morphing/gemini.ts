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
    "border_radius": "<css value>"
  },
  "components": [
    { "type": "<component_type>", "id": "<unique_id>", "order": <number>, "props": { ... } }
  ]
}

Available component types and their props:

1. "navigation" - { "logo_text": string, "links": [{ "label": string, "url": string }] }
2. "hero" - { "headline": string, "subheadline": string, "cta_text"?: string, "cta_url"?: string, "alignment": "left"|"center"|"right" }
3. "bento_grid" - { "items": [{ "title": string, "description": string, "span"?: number }] }
4. "article" - { "title": string, "body": string }
5. "gallery" - { "images": [{ "src": string, "alt": string, "caption"?: string }], "columns": number }
6. "ticker" - { "items": [string], "speed": "slow"|"normal"|"fast" }
7. "cta_banner" - { "headline": string, "description": string, "button_text": string, "button_url": string }
8. "testimonials" - { "testimonials": [{ "quote": string, "author": string, "role"?: string }] }
9. "stats" - { "stats": [{ "value": string, "label": string }] }
10. "features" - { "features": [{ "title": string, "description": string, "icon"?: string }] }
11. "faq" - { "items": [{ "question": string, "answer": string }] }
12. "pricing" - { "plans": [{ "name": string, "price": string, "features": [string], "highlighted"?: boolean }] }
13. "team" - { "members": [{ "name": string, "role": string, "bio"?: string }] }
14. "footer" - { "text": string, "links": [{ "label": string, "url": string }] }
15. "quote" - { "quote": string, "author": string, "source"?: string }

Rules:
- Use 5-10 components to create a visually interesting page
- Always include "navigation" as the first component and "footer" as the last
- Choose a creative and cohesive color theme that matches the user's prompt
- Use varied component types - don't repeat the same type more than twice
- For gallery images, use Unsplash source URLs like "https://images.unsplash.com/photo-{id}?w=600&h=400&fit=crop" — pick real Unsplash photo IDs that match the theme, or use "https://source.unsplash.com/600x400/?keyword" with a relevant keyword
- For internal links, use paths like /leaderboard, /submit, /hall-of-fame, /shop
- Be creative with the content! Match the vibe and theme of the user's prompt
- Do NOT include any image URLs in hero or article components (background_image, image fields) - leave them out
- Use emojis as icons in features components

Color contrast and readability rules (apply these UNLESS the user's prompt explicitly requests specific colors or a style that intentionally breaks them):
- text_color must always be highly readable against background_color. If background_color is dark, use a light text_color, and vice versa. Never use a text color that is close to the background color.
- primary_color is used for buttons, headings, and highlights — make sure it stands out clearly against background_color.
- secondary_color should complement primary_color without blending into it.
- accent_color should contrast enough with both background_color and any surface it appears on.
- Never place light text on a light background or dark text on a dark background.
- When in doubt, aim for a contrast ratio of at least 4.5:1 between text and its background (WCAG AA standard).`;

export async function generateSiteConfig(
  prompt: string,
  imageUrl: string | null,
  cycleNumber: number
): Promise<SiteConfig> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY not set, using fallback config");
    const fb = fallbackConfig(prompt, cycleNumber);
    if (imageUrl) injectImageIntoConfig(fb, imageUrl);
    return fb;
  }

  try {
    const imageInstruction = imageUrl
      ? ` The user also uploaded a reference image (${imageUrl}) — include it as the first image in the gallery component.`
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

    // Inject the uploaded image into the gallery component if provided
    if (imageUrl) {
      injectImageIntoConfig(sanitized, imageUrl);
    }

    return sanitized;
  } catch (err) {
    console.error("Gemini generation failed:", err);
    const fb = fallbackConfig(prompt, cycleNumber);
    if (imageUrl) injectImageIntoConfig(fb, imageUrl);
    return fb;
  }
}

function injectImageIntoConfig(config: SiteConfig, imageUrl: string): void {
  const gallery = config.components.find((c) => c.type === "gallery");
  if (gallery && Array.isArray((gallery.props as { images?: unknown[] }).images)) {
    const images = (gallery.props as { images: { src: string; alt: string }[] }).images;
    // Only inject if not already present
    if (!images.some((img) => img.src === imageUrl)) {
      images.unshift({ src: imageUrl, alt: "Community reference image" });
    }
  } else {
    // No gallery — insert one after the hero (or at position 1)
    const insertAt = Math.min(1, config.components.length);
    config.components.splice(insertAt, 0, {
      type: "gallery",
      id: "gallery-user-image",
      order: insertAt,
      props: {
        images: [{ src: imageUrl, alt: "Community reference image" }],
        columns: 1,
      },
    });
    // Fix order values
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
