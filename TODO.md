# TODO — Remaining Work & Stubbed Features

## Critical — Must Fix

- [ ] **Browser RLS queries hang** — The browser Supabase client (anon key) cannot query tables even with "public read" RLS policies. Queries hang instead of returning errors. Affected components that likely need server API routes:
  - `PulseIndicator` — fetches pulses directly from browser
  - `VoteButton` / voting flow — casts votes from browser
  - `Leaderboard page` — fetches proposals from browser
  - `ClaimPulseButton` — claims pulse from browser

## Features — Not Yet Implemented

- [ ] **Image upload on submit** — Currently disabled (`imageUrl = null`). Need to either fix Supabase Storage RLS or route upload through a server API endpoint.
- [ ] **Vercel cron job** — `/api/morph` needs a daily trigger at 00:00 UTC. Add a `vercel.json` cron config or use Vercel Cron Jobs.
- [ ] **Google OAuth** — Login page has the button but OAuth is not configured in the Supabase dashboard. Need to add Google OAuth credentials in Supabase Auth settings.
- [ ] **Rate limiting** — Currently using an in-memory Map (resets on redeploy). Swap to Upstash Redis for persistent rate limiting when needed at scale.

## Stubbed — Placeholder Only

- [ ] **Polar payments** — `src/lib/polar.ts` has stub `createCheckout` and `verifyWebhook`. Shop page (`/shop`) shows products but checkout buttons do nothing. Need Polar API key and webhook setup.
- [ ] **Propeller Ads** — `src/components/layout/AdSlot.tsx` renders placeholder divs with `data-ad-placement`. Need Propeller Ads account and script injection.
- [ ] **Content moderation** — `src/lib/moderation/stub.ts` always returns `{ safe: true }`. Need to integrate a real moderation API (e.g., OpenAI Moderation, Google Cloud Vision) before launch.
- [ ] **Sovereign Spaces** — `src/app/spaces/page.tsx` shows "Coming Soon". Full feature: users pay for a personal subdomain with their own morphed site.

## Nice to Have

- [ ] **Hall of Fame screenshots** — `screenshot_url` column exists but nothing captures screenshots. Could use Puppeteer/Playwright or a screenshot API service.
- [ ] **Realtime vote updates** — `LiveVoteCount` component subscribes to Supabase Realtime but may not work due to the RLS issue. Test after fixing browser client.
- [ ] **Anti-snipe extension** — Logic exists in vote API but needs testing. Should extend cycle by 60s if vote comes in during final 60s.
