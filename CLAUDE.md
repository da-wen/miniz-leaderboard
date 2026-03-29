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

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · GitHub Pages

## Architecture

**Static Generation (SSG):** All pages are pre-rendered at build time. `generateStaticParams()` in `src/app/tracks/[trackSlug]/[classSlug]/page.tsx` generates all route combinations. Data is loaded from the filesystem via `src/lib/data.ts` using Node.js `fs` — this works because Next.js builds server-side.

**Routing:** `/ → /tracks/[trackSlug]/[classSlug]`. Home page redirects to the first track. Each track has class tabs for different racing categories.

**Data flow:** JSON files in `data/` → `src/lib/data.ts` loaders → page components → client components for interactivity (sorting, navigation).

**Sort priority:** Track-class override (`tracks.json`) > class default (`classes.json`) > `bestLaptime`.

**Responsive layout:** Desktop uses a fixed left sidebar; mobile uses a hamburger drawer. Breakpoint at `lg`.

## Data Schema

- `data/classes.json` — racing class definitions (name, slug, rules, defaultSort)
- `data/tracks.json` — track definitions with assigned classes (supports per-track sort overrides)
- `data/results/{trackSlug}_{classSlug}.json` — lap time entries (driver, carModel, bestLaptime, threeConsecutiveLaps, update dates)

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) handles build + deploy on push to `main`. `actions/configure-pages` sets `basePath` automatically. `public/.nojekyll` prevents Jekyll interference.

## Key Config

- `next.config.ts`: `output: "export"`, `images.unoptimized: true`
- `tsconfig.json`: path alias `@/*` → `src/*`, strict mode
- Components use `"use client"` directive for interactive features (sorting, nav toggling)
