# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**rainskiss** is a Next.js multimedia content platform for music, AI-powered creative tools, and pose references. It integrates Firebase (auth, database, storage), Anthropic Claude API, and Google Gemini.

## Commands

```bash
bun dev        # Start development server
bun build      # Production build
bun start      # Start production server
bun lint       # Run ESLint (next lint)
```

No test suite is configured. Use `ts-node` to run one-off TypeScript scripts (e.g., `src/api/` uploaders).

## Environment Variables

```
NEXT_PUBLIC_FIREBASE_*    # Firebase project config
NEXT_PUBLIC_ADMIN_UID     # UID with admin privileges
NEXT_PUBLIC_GEMINI_API_KEY
ANTHROPIC_API_KEY
```

## Architecture

### App Router Structure

`src/app/` uses Next.js 13+ App Router. Server Components by default; add `"use client"` only for interactivity. API routes live in `src/app/api/`.

Key routes:
- `/mix` — Mix Advisor (Claude vision model analyzes DAW screenshots)
- `/prompts` — Fuzzy-searchable prompt library (Fuse.js)
- `/shop` — Product shop backed by Firebase
- `/pose` — Pose reference gallery with dynamic routing
- `/letters` — Firebase-backed user message submission

### Auth Flow

`AuthContextProvider` wraps the root layout and provides Google OAuth state via Firebase. Consume with `useAuthContext()`. Admin checks use `NEXT_PUBLIC_ADMIN_UID` comparison.

### Data & API Flow

- **Firebase Realtime Database** — products, prompts, letters
- **Cloudinary** (`next-cloudinary`) — image uploads and serving
- **`/api/mix-chat`** — Next.js API route proxying requests to Anthropic Claude API with a system prompt for audio engineering expertise

### Component Conventions

- UI primitives from shadcn/ui (Radix UI + CVA variants) in `src/components/ui/`
- Class composition with `clsx` + `tailwind-merge` via a `cn()` helper
- Path alias `@/` maps to `src/`

### Key Files

- `src/api/firebase.js` — all Firebase operations (CRUD for products, prompts, letters)
- `src/components/AuthContext.tsx` — auth state provider
- `src/app/api/mix-chat/route.ts` — Anthropic API proxy
- `tailwind.config.ts` — custom color variables and theme
- `components.json` — shadcn/ui config (new-york style, RSC enabled)
