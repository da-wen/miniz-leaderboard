# GitHub Pages Deployment Guide

## Overview

The Mini-Z Leaderboard is deployed as a fully static site to GitHub Pages using GitHub Actions. The build process uses Next.js `output: 'export'` to generate plain HTML/CSS/JS files.

## Prerequisites

1. A GitHub repository for this project
2. GitHub Pages enabled in the repository settings

## One-Time Setup

### 1. Enable GitHub Pages

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", set **Source** to **"GitHub Actions"**
4. (Do NOT select "Deploy from a branch")

### 2. Verify `next.config.ts`

Ensure the config has `output: 'export'`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

**Important**: Do NOT set `basePath` manually. The GitHub Action `actions/configure-pages` with `static_site_generator: "next"` automatically injects the correct `basePath` at build time based on your repository name.

### 3. Ensure `.nojekyll` exists

A `public/.nojekyll` file (empty) must exist to prevent GitHub Pages from running Jekyll, which would ignore the `_next/` directory.

## GitHub Actions Workflow

The workflow lives at `.github/workflows/deploy.yml` and runs on every push to `main`.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          static_site_generator: "next"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npx next build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## How It Works

1. **Trigger**: Every push to `main` (or manual trigger via `workflow_dispatch`)
2. **Build**: Installs dependencies, `configure-pages` injects `basePath`, Next.js builds static files into `out/`
3. **Upload**: The `out/` directory is uploaded as a GitHub Pages artifact
4. **Deploy**: The artifact is deployed to GitHub Pages

## Deployment URL

After deployment, the site is available at:

- **User/org site**: `https://<username>.github.io/` (if repo is named `<username>.github.io`)
- **Project site**: `https://<username>.github.io/<repo-name>/`

## Updating the Leaderboard

To update lap times:

1. Edit the relevant file in `data/results/` (e.g., `data/results/hobby-carpet_stock.json`)
2. Commit and push to `main`
3. GitHub Actions automatically rebuilds and redeploys

To add a new track or class:

1. Add the class definition to `data/classes.json` (if new)
2. Add/update the track in `data/tracks.json` with the class assignment
3. Create the results file `data/results/{trackSlug}_{classSlug}.json`
4. Commit and push to `main`

## Troubleshooting

### Build fails with "Page couldn't be rendered statically"

All dynamic routes need `generateStaticParams()` and `export const dynamicParams = false`. Check that every `[param]` folder has these exports.

### Assets not loading (404 on `_next/`)

Ensure `public/.nojekyll` exists. Without it, GitHub Pages runs Jekyll which ignores directories starting with `_`.

### Wrong base path

Do NOT hardcode `basePath` in `next.config.ts`. Let `actions/configure-pages` handle it. If you must test locally with a base path:

```bash
NEXT_PUBLIC_BASE_PATH=/repo-name npx next build
npx serve out
```

### Checking deployment status

Go to the **Actions** tab in your GitHub repository to see build/deploy status and logs.

## Local Testing

```bash
# Build the static site
npm run build

# Serve the output directory
npx serve out

# Open http://localhost:3000
```

Note: Without `basePath`, links will work at root. On GitHub Pages with a subpath, the `configure-pages` action handles path prefixing.
