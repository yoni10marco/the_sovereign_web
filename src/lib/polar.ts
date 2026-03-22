// Polar payment integration placeholder
// TODO: Replace with actual Polar SDK integration

export interface CheckoutOptions {
  userId: string;
  product: "like_pack" | "dislike_bomb" | "sovereign_space" | "subscription";
  metadata?: Record<string, string>;
}

export async function createCheckout(_options: CheckoutOptions): Promise<{ url: string }> {
  // TODO: Implement with Polar API
  return { url: "/shop?checkout=stub" };
}

export async function verifyWebhook(
  _body: string,
  _signature: string
): Promise<{ valid: boolean; event?: string }> {
  // TODO: Implement Polar webhook verification
  return { valid: false };
}

export const PRODUCTS = {
  like_pack: { name: "50 Likes Pack", price_cents: 99, description: "50 instant likes" },
  dislike_bomb: { name: "Dislike Bomb", price_cents: 499, description: "-20 votes to a rival proposal" },
  sovereign_space: { name: "Sovereign Space (24h)", price_cents: 999, description: "Your own private space for 24 hours" },
  subscription: { name: "Sovereign Pass", price_cents: 249, period: "week", description: "Ad-free, 25 likes/pulse, Pro badge" },
} as const;
