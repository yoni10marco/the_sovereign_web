import type { SiteConfig } from "./config-schema";
import { GENESIS_CONFIG } from "./genesis-config";

// TODO: Replace with actual Gemini API call
// The real implementation will:
// 1. Send the prompt + image to Gemini with a system prompt describing available components and the JSON schema
// 2. Parse the JSON response
// 3. Run it through sanitizer.ts
export async function generateSiteConfig(
  _prompt: string,
  _imageUrl: string | null,
  cycleNumber: number
): Promise<SiteConfig> {
  // Stub: return a variation of the genesis config with the prompt reflected
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
            subheadline: `This site was morphed by the community. The winning prompt: "${_prompt}"`,
          },
        };
      }
      return c;
    }),
  };
}
