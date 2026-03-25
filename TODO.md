# TODO — Remaining Work & Stubbed Features

## Critical — Must Fix

- [x] **Browser RLS queries hang** — Fixed. `PulseIndicator` now fetches via `GET /api/pulse` (admin client server-side). `VoteButton` and `ClaimPulseButton` were already routing through API endpoints.

## Features — Not Yet Implemented

- [x] **Image upload on submit** — Fully implemented. Up to 5 images per proposal. Uploads via `/api/upload-image` (admin client, `proposal-images` bucket). Winner images are injected into the generated site gallery.
- [ ] **Vercel cron job** — `/api/morph` needs a daily trigger at 00:00 UTC. Add a `vercel.json` cron config or use Vercel Cron Jobs.
- [ ] **Rate limiting** — Currently using an in-memory Map (resets on redeploy). Swap to Upstash Redis for persistent rate limiting when needed at scale.

## Stubbed — Placeholder Only

- [ ] **Polar payments** — `src/lib/polar.ts` has stub `createCheckout` and `verifyWebhook`. Shop page (`/shop`) shows products but checkout buttons do nothing. Need Polar API key and webhook setup.
- [ ] **Propeller Ads** — `src/components/layout/AdSlot.tsx` renders placeholder divs with `data-ad-placement`. Need Propeller Ads account and script injection.
- [ ] **Content moderation** — `src/lib/moderation/stub.ts` always returns `{ safe: true }`. Need to integrate a real moderation API (e.g., OpenAI Moderation, Google Cloud Vision) before launch.
- [x] **Sovereign Spaces** — Fully implemented. `/spaces` dashboard, `/spaces/create` form, `/spaces/[id]` renderer. API routes: `purchase`, `generate`, `my`, `[id]`. Payment stubbed (free in beta). Uses same Gemini generation as morph cycle.
- [ ] **Public Spaces gallery** — Allow users to make their Sovereign Space public so it appears in a browsable gallery for everyone. Needs: a `is_public` boolean on `sovereign_spaces`, a public gallery page (e.g. `/spaces/explore`), and a toggle UI on the space dashboard/detail page.

## Design & Flexibility

- [x] **More morphing components** — 43 components now in registry. Includes video_embed, map_embed, countdown_timer, image_carousel, timeline, logo_cloud, social_links, image_text_split, callout_box, masonry_gallery, contact_form, embed_block, code_block, marquee, profile_card, numbered_steps, comparison_table, newsletter_signup, confetti_trigger, glassmorphism_panel, interactive_poll, live_counter, magazine_spread, mesh_gradient, polaroid_stack, reaction_cloud, retro_terminal, scratch_card.
- [x] **Multi-page morphing** — Sub-pages supported via `SiteConfig.pages`. Gemini generates 2-3 sub-pages by default. Client-side navigation via MorphRenderer state. Back button always shown on sub-pages.
- [x] **Navigation bar styles** — 6 styles: default, centered, pill, minimal, bold, sidebar. Gemini picks based on vibe.
- [x] **Background patterns** — 6 pattern overlays: dots, grid, diagonal, gradient, crosshatch, noise.
- [ ] **Website design overhaul** — Evaluate and potentially redesign the overall platform UI/UX (the shell outside the morphed content: nav, auth pages, proposal/vote pages, etc.).
- [ ] **Verify likes system logic** — Audit the full pulse/likes flow: regeneration timing, allocation amounts (free: 5, pro: 25), expiry, claiming, vote deduction, and edge cases (e.g., what happens to votes if cycle ends early).

## Shared Components (Cross-User)

- [x] **Shared live components** — `reaction_cloud` and `interactive_poll` now persist state in the `component_states` table (keyed by `cycle_id` + `component_index`) with Supabase Realtime subscriptions for cross-user sync. `live_counter` remains a display-only widget with animated fluctuation (intentional). At morph time, state is snapshotted into `hall_of_fame.live_state` and rendered read-only in the Hall of Fame. API routes: `GET /api/live/state`, `POST /api/live/interact`.

## Nice to Have

- [ ] **Hall of Fame screenshots** — `screenshot_url` column exists but nothing captures screenshots. Could use Puppeteer/Playwright or a screenshot API service.
- [ ] **Realtime vote updates** — `LiveVoteCount` component subscribes to Supabase Realtime but may not work due to the RLS issue. Test after fixing browser client.
- [ ] **Anti-snipe extension** — Logic exists in vote API but needs testing. Should extend cycle by 60s if vote comes in during final 60s.
