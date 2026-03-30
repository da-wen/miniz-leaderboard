# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mini-Z RC car racing lap time leaderboard — a fully static, data-driven site. All race data lives in JSON files under `data/`; no backend or database. Auto-deploys to GitHub Pages on push to `main`.

## Commands

```bash
npm run dev       # Dev server at localhost:3000
npm run build     # Static export to out/
npm run lint      # ESLint
npx serve out     # Test static build locally
```

## Tech Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · @tailwindcss/typography · GitHub Pages

## Architecture

**Static Generation (SSG):** All pages are pre-rendered at build time. `generateStaticParams()` in `src/app/tracks/[trackSlug]/[classSlug]/page.tsx` generates all route combinations. Data is loaded from the filesystem via `src/lib/data.ts` using Node.js `fs` — this works because Next.js builds server-side.

**Routing:** `/ → /[lang]/tracks/[trackSlug]/[classSlug]`. Home page redirects to the first track. Each track has class tabs for different racing categories. `/[lang]/impressum` serves the bilingual imprint/legal notice page.

**Data flow:** JSON files in `data/` → `src/lib/data.ts` loaders → page components → client components for interactivity (sorting, navigation).

**HTML in rules:** The `rules` field in `classes.json` supports a subset of HTML tags (headings, lists, links, tables, inline formatting). `RulesAccordion` sanitizes via `isomorphic-dompurify` before rendering with `dangerouslySetInnerHTML`. Plain text rules continue to work as-is.

**HTML in track info:** The `info` field in `tracks.json` supports the same HTML subset as rules. `TrackInfoAccordion` sanitizes via `isomorphic-dompurify` before rendering. If `info` is null/empty, the section is not displayed.

**Sort priority:** Track-class override (`tracks.json`) > class default (`classes.json`) > `bestLaptime`.

**Responsive layout:** Desktop uses a fixed left sidebar; mobile uses a hamburger drawer. Breakpoint at `lg`.

**Footer:** Server component (`src/components/Footer.tsx`) rendered inside `<main>` in `[lang]/layout.tsx`. Shows copyright year and an "Impressum"/"Legal Notice" link to the imprint page.

## Data Schema

- `data/classes.json` — racing class definitions (name, slug, rules, defaultSort); `rules` supports HTML subset
- `data/tracks.json` — track definitions with assigned classes (supports per-track sort overrides and optional localized HTML `info`)
- `data/results/{trackSlug}_{classSlug}.json` — lap time entries (driver, carModel, bestLaptime, threeConsecutiveLaps, update dates)
- `data/imprint.json` — personal data for imprint page (name, address array, email)

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) handles build + deploy on push to `main`. `actions/configure-pages` sets `basePath` automatically. `public/.nojekyll` prevents Jekyll interference.

## Key Config

- `next.config.ts`: `output: "export"`, `images.unoptimized: true`
- `tsconfig.json`: path alias `@/*` → `src/*`, strict mode
- Components use `"use client"` directive for interactive features (sorting, nav toggling)
- `globals.css`: `@plugin "@tailwindcss/typography"` enables prose styling in `RulesAccordion`
