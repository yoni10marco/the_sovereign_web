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
- **Gemini API** (`gemini-3.1-flash-lite-preview`) for morphing config generation
- **Polar** for payments (stubbed)
- **Google Fonts** — loaded dynamically per morph
- **Unsplash** — gallery images use `source.unsplash.com` URLs (no API key)

## Architecture

### Morphing Engine (core concept)

The homepage is a **stateless shell** that renders from a `SiteConfig` object (defined in `src/lib/morphing/config-schema.ts`). A `SiteConfig` contains a `ThemeConfig` (colors, fonts, border-radius) and an ordered array of `ComponentConfig` entries.

Each `ComponentConfig` has a `type` string (e.g. `"hero"`, `"bento_grid"`, `"ticker"`) mapped to a React component via `COMPONENT_REGISTRY` in `src/components/morphing/registry.ts`. There are 15 atomic components in `src/components/morphing/components/`. `MorphRenderer` iterates the config, loads Google Fonts dynamically, and renders them.

The AI output is restricted to JSON parameters — no raw JS injection. See `src/lib/morphing/sanitizer.ts`.

### Supabase Clients

- **Server client**: `src/lib/supabase/server.ts` — cookie-based auth for API routes
- **Admin client**: `src/lib/supabase/admin.ts` — uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS. Used by all server API routes that query/mutate data.
- **Browser client**: `src/lib/supabase/client.ts` — singleton, used only for auth state on the client side. **Do NOT use for data queries** — browser anon key + RLS causes queries to hang indefinitely. Route all data operations through server API endpoints using the admin client.
- Auth middleware: `src/middleware.ts`
- Auth flow: `src/app/(auth)/` route group (login, signup, callback)

### API Routes

- `POST /api/morph` — Triggers morphing cycle (picks winner, calls Gemini, stores config, creates next cycle)
- `POST /api/submit` — Submit a proposal (auth via cookies, DB via admin client). Accepts `{ title, prompt, imageUrls: string[] }`.
- `POST /api/upload-image` — Uploads a single image to Supabase Storage (`proposal-images` bucket, public). Returns `{ url }`. Auth required.
- `POST /api/vote` — Cast votes on proposals
- `POST /api/pulse/claim` — Claim pulse (regenerating likes)
- `GET /api/debug/status` — Inspect DB state (gated by `NEXT_PUBLIC_DEBUG_PANEL`)
- `POST /api/debug/end-cycle` — End active cycle immediately (gated by `NEXT_PUBLIC_DEBUG_PANEL`)

### Image Uploads

Proposals support up to 5 reference images. The submit page uploads each file to `/api/upload-image` (which uses the admin client to write to the `proposal-images` Supabase Storage bucket), collects the public URLs, and sends them as `imageUrls[]` to `/api/submit`. The DB stores them in `proposals.image_urls` (text[]) and `proposals.image_url` (first image, for backwards compat).

When a proposal wins, `generateSiteConfig` in `src/lib/morphing/gemini.ts` passes all image URLs to Gemini and also post-processes the output with `injectImagesIntoConfig` to guarantee the images appear in the gallery component regardless of what Gemini generated.

The Gemini system prompt includes color contrast rules (WCAG AA 4.5:1) to ensure readable color combinations, unless the user's prompt explicitly requests specific colors.

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
- `NEXT_PUBLIC_DEBUG_PANEL` — set to `"true"` to enable debug panel
