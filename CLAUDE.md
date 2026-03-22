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
- **Gemini API** for morphing config generation
- **Polar** for payments

## Architecture

### Morphing Engine (core concept)

The homepage is a **stateless shell** that renders from a `SiteConfig` object (defined in `src/lib/morphing/config-schema.ts`). A `SiteConfig` contains a `ThemeConfig` (colors, fonts, border-radius) and an ordered array of `ComponentConfig` entries.

Each `ComponentConfig` has a `type` string (e.g. `"hero"`, `"bento_grid"`, `"ticker"`) mapped to a React component via `COMPONENT_REGISTRY` in `src/components/morphing/registry.ts`. There are 15 atomic components in `src/components/morphing/components/`. `MorphRenderer` iterates the config and renders them.

The AI output is restricted to JSON parameters — no raw JS injection. See `src/lib/morphing/sanitizer.ts`.

### API Routes

- `POST /api/morph` — Triggers morphing cycle (calls Gemini, stores new config)
- `POST /api/pulse/claim` — Claim pulse (regenerating likes)
- `POST /api/vote` — Cast votes on proposals

### Supabase Integration

- Server client: `src/lib/supabase/server.ts` (uses `@supabase/ssr` with cookie-based auth)
- Browser client: `src/lib/supabase/client.ts`
- Auth middleware: `src/middleware.ts`
- Auth flow: `src/app/(auth)/` route group (login, signup, callback)

### Key Constants (`src/lib/constants.ts`)

Cycle duration (24h), pulse interval (5h), like allocations (free: 5, pro: 25), anti-snipe window (60s), rate limits.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
