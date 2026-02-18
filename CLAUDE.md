# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WistaClinic is a multilingual website for a healthcare and beauty clinic in Istanbul, Turkey. It offers surgical and aesthetic services including rhinoplasty, hair transplant, body contouring, dental care, and more. The site supports 9 locales (en, tr, de, fr, es, it, ar, ru, zh).

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
- `pnpm start` — Serve production build

Package manager is **pnpm**.

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS v4** (imported via `@import "tailwindcss"` in `globals.css`, config in `tailwind.config.ts`)
- **Framer Motion** for component animations
- **GSAP** loaded dynamically via npm imports (code-split) — see `app/utils/loadGsap.ts`
- **canvas-confetti** also loaded dynamically via npm
- **lucide-react** for icons
- **next-themes** for dark mode
- **Radix UI** primitives (accordion, dialog, select, etc.)
- **Zod** for form validation
- Path alias: `@/*` maps to project root

## Architecture

All source code lives under `app/` using Next.js App Router conventions. There is no `src/` directory.

### Routing & i18n

- `app/page.tsx` — Root redirect to default locale
- `app/[locale]/` — All localized pages (home, about, procedures, doctors, gallery, testimonials, contact, privacy, terms, pricing)
- `app/[locale]/layout.tsx` — Locale layout with Header, Footer, StructuredData
- `app/(legacy)/page.tsx` — Legacy homepage (kept for backward compatibility)
- `proxy.ts` — Middleware for locale detection and redirection

### i18n System

- Dictionary-based: `lib/i18n/dictionaries/{locale}.json`
- English is the base; other locales are deep-merged on top
- `getDictionary(locale)` returns the merged dictionary
- Type: `Dictionary` derived from English JSON shape
- Config: `lib/i18n/config.ts` (locales list, `isValidLocale()`, `defaultLocale`)

### Key Patterns

- **Server components by default** for pages, with `'use client'` for interactive components
- **GSAP loaded via dynamic imports** (`app/utils/loadGsap.ts`), attaches to `window.gsap`, `window.ScrollTrigger`, etc. Components use `useGsap()` hook and check `gsapReady` before animating.
- **GsapProvider** wraps pages that need GSAP animations
- **AnimatedSection** wrapper for scroll-triggered fade/slide animations
- Components are organized under `app/components/` by section (home, about, contact, gallery, procedures, testimonials, doctors) plus shared and layout directories

### Brand Colors

- Primary gold: `#D4AF37` (Tailwind `gold-500`)
- Extended gold palette defined in `tailwind.config.ts`
- Bronze, champagne, cream, warm-gray palettes available
- Semantic tokens use oklch in `globals.css` (light + dark mode)

### Static Assets

Images are served from `public/images/` (logos at `logo/`). Some service images use external URLs.
