# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Sovereign Web is a generative social platform where the website morphs every 24 hours based on community-voted proposals. Users vote using a regenerating "Pulse" currency (likes), and the winning proposal is sent to an AI (Gemini API) that generates a full site configuration JSON. The frontend re-renders from that config.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**
- **Supabase** for auth, database, realtime, and storage (`@supabase/ssr`)
- **Zustand** for client state
- **Gemini API** (`gemini-3-flash-preview`) for morphing config generation
- **Polar** for payments (stubbed)
- **Google Fonts** — loaded dynamically per morph
- **Pexels API** — images resolved server-side via `src/lib/morphing/pexels.ts`. Gemini outputs `pexels://keyword/orientation` placeholders; `resolveConfigImages()` fetches real CDN URLs after generation. Falls back to loremflickr if `PEXELS_API_KEY` is not set.

## Architecture

### Morphing Engine (core concept)

The homepage is a **stateless shell** that renders from a `SiteConfig` object (defined in `src/lib/morphing/config-schema.ts`). A `SiteConfig` contains a `ThemeConfig` (colors, fonts, border-radius) and an ordered array of `ComponentConfig` entries.

Each `ComponentConfig` has a `type` string (e.g. `"hero"`, `"bento_grid"`, `"ticker"`) mapped to a React component via `COMPONENT_REGISTRY` in `src/components/morphing/registry.ts`. There are 43 atomic components in `src/components/morphing/components/`. `MorphRenderer` iterates the config, loads Google Fonts dynamically, and renders them. All UI icons use Lucide React (no emojis).

The AI output is restricted to JSON parameters — no raw JS injection. See `src/lib/morphing/sanitizer.ts`.

**Multi-page support**: `SiteConfig` has an optional `pages?: PageConfig[]` array. Gemini generates 2-3 sub-pages by default. `MorphRenderer` holds `currentSlug` state and renders the active page's components. `_navigate`, `_currentSlug`, and `_pages` are injected into all `navigation` and `footer` components at render time. Sub-page nav buttons are sourced directly from `_pages` (not Gemini link urls) to guarantee reliability.

**Navigation styles**: `NavigationProps.nav_style` supports `"default"` | `"centered"` | `"pill"` | `"minimal"` | `"bold"` | `"sidebar"`. Gemini picks based on site vibe. Back button always shown on sub-pages.

**Background patterns**: `ThemeConfig.background_pattern` supports `"dots"` | `"grid"` | `"diagonal"` | `"gradient"` | `"crosshatch"` | `"noise"`. Rendered as CSS overlay in `MorphRenderer`.

### Supabase Clients

- **Server client**: `src/lib/supabase/server.ts` — cookie-based auth for API routes
- **Admin client**: `src/lib/supabase/admin.ts` — uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS. Used by all server API routes that query/mutate data.
- **Browser client**: `src/lib/supabase/client.ts` — singleton, used only for auth state on the client side. **Do NOT use for data queries** — browser anon key + RLS causes queries to hang indefinitely. Route all data operations through server API endpoints using the admin client.
- Auth middleware: `src/middleware.ts`
- Auth flow: `src/app/(auth)/` route group (login, signup, callback). **Email/password only** — Google OAuth has been removed.

### API Routes

- `POST /api/morph` — Triggers morphing cycle (picks winner, calls Gemini, stores config, creates next cycle)
- `POST /api/submit` — Submit a proposal (auth via cookies, DB via admin client). Accepts `{ title, prompt, imageUrls: string[] }`.
- `POST /api/upload-image` — Uploads a single image to Supabase Storage (`proposal-images` bucket, public). Returns `{ url }`. Auth required.
- `POST /api/vote` — Cast votes on proposals
- `GET /api/pulse` — Fetch active pulse data for the current user (totalLikes, nextExpiry). Uses admin client server-side.
- `POST /api/pulse/claim` — Claim pulse (regenerating likes)
- `GET /api/debug/status` — Inspect DB state (gated by `NEXT_PUBLIC_DEBUG_PANEL`)
- `POST /api/debug/end-cycle` — End active cycle immediately (gated by `NEXT_PUBLIC_DEBUG_PANEL`)
- `POST /api/spaces/purchase` — Create a sovereign space record (stub payment, free in beta). Accepts `{ title, prompt, imageUrls: string[] }`. Returns `{ spaceId }`.
- `POST /api/spaces/generate` — Generate the site config for a space via Gemini. Accepts `{ spaceId }`. Updates `sovereign_spaces.site_config` and sets status to `active`.
- `GET /api/spaces/my` — Fetch current user's spaces, auto-expires past-expiry records.
- `GET /api/spaces/[id]` — Fetch a specific space's data (public, no auth required).
- `GET /api/live/state?cycleId=` — Returns all `component_states` rows for the cycle as `{ [componentIndex]: state_data }`. No auth required.
- `POST /api/live/interact` — Persist a live component interaction (`react`, `vote`, `increment`). Rejects writes to completed cycles with 403.

### Image Uploads

Proposals support up to 5 reference images. The submit page uploads each file to `/api/upload-image` (which uses the admin client to write to the `proposal-images` Supabase Storage bucket), collects the public URLs, and sends them as `imageUrls[]` to `/api/submit`. The DB stores them in `proposals.image_urls` (text[]) and `proposals.image_url` (first image, for backwards compat).

When a proposal wins, `generateSiteConfig` in `src/lib/morphing/gemini.ts` passes all image URLs to Gemini and also post-processes the output with `injectImagesIntoConfig` to guarantee the images appear in the gallery component regardless of what Gemini generated.

**Image resolution pipeline**: After Gemini returns a config, `resolveConfigImages()` (in `src/lib/morphing/pexels.ts`) scans every image field across all components and pages, replaces `pexels://keyword/orientation` placeholders with real Pexels CDN URLs via the Pexels API, then `injectImagesIntoConfig` adds any user-uploaded images. All image components use `SafeImage` (in `src/components/morphing/SafeImage.tsx`) which shows an `ImageOff` placeholder on load failure instead of a broken icon. `HeroSection` uses a hidden probe `<img>` to detect background image failures and gracefully removes the background.

The Gemini system prompt includes color contrast rules (WCAG AA 4.5:1) to ensure readable color combinations, unless the user's prompt explicitly requests specific colors.

### Sovereign Spaces

Users can create a personal space — a privately-owned morphed site live for 24 hours. No community voting; the owner submits a prompt and the AI generates the full config immediately.

- **DB table**: `sovereign_spaces` — fields: `id`, `user_id`, `slug`, `title`, `prompt`, `image_urls` (text[]), `site_config` (jsonb), `status` (`pending`/`generating`/`active`/`expired`), `purchased_at`, `expires_at`, `is_active`, `is_public` (boolean, default false).
- **Pages**: `/spaces` (dashboard), `/spaces/create` (form), `/spaces/[id]` (renders the space via `MorphRenderer` with a fixed sub-header banner; owner sees a Public/Private toggle), `/spaces/explore` (public gallery of all `is_public=true` active spaces).
- **Public toggle**: `POST /api/spaces/[id]/toggle-public` — owner-only, flips `is_public`. `PublicToggle` client component in `src/components/spaces/PublicToggle.tsx`.
- **Payment**: stubbed via Polar (`sovereign_space` product, $9.99). Space is created directly without real payment until Polar is wired up.
- **Generation**: same `generateSiteConfig` used by the morph cycle. Config is tagged with `id: "space-<uuid>"`.

### Shared Live Component State

Three components have cross-user shared state backed by Supabase: `live_counter` (display-only, animated fluctuation — no real persistence), `reaction_cloud`, and `interactive_poll`.

- **DB table**: `component_states` — fields: `cycle_id` (FK to morph_cycles), `component_index` (position in config array), `component_type`, `state_data` (jsonb). Unique on `(cycle_id, component_index)`. Realtime enabled.
- **State shapes**: `live_counter` → `{ count }`, `reaction_cloud` → `{ reactions: { [emoji]: number } }`, `interactive_poll` → `{ votes: { [option]: number }, total }`.
- **MorphRenderer** injects `_cycleId`, `_componentIndex`, `_liveState` into these three component types. `_liveState` is only set when rendering Hall of Fame entries (triggers read-only frozen mode).
- **Archival**: `/api/morph` snapshots `component_states` into `hall_of_fame.live_state` (jsonb) before inserting the archive row. Hall of Fame entries render components as read-only with final counts.
- **Homepage** passes the active cycle's `id` as `cycleId` to `MorphRenderer`.

### Debug Panel

`src/components/debug/DebugPanel.tsx` — floating panel with Status, End Vote, and Morph Now buttons. Controlled by `NEXT_PUBLIC_DEBUG_PANEL=true` env var (works on Vercel, not just dev mode).

### Key Constants (`src/lib/constants.ts`)

Cycle duration (24h), pulse interval (5h), like allocations (free: 5, pro: 25), anti-snipe window (60s), rate limits.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `PEXELS_API_KEY` — Pexels API key for image resolution. Without this, falls back to loremflickr.
- `NEXT_PUBLIC_DEBUG_PANEL` — set to `"true"` to enable debug panel
- `NEXT_PUBLIC_APP_URL` — full URL of the deployment (e.g. `https://thesovereignweb.com`). Used by `/api/morph` to capture Hall of Fame screenshots via microlink.io.
