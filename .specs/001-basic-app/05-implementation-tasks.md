# Implementation Tasks

Step-by-step tasks for implementing the Mini-Z Leaderboard. Each task is small and self-contained. Complete them in order.

---

## Phase 1: Project Setup

### Task 1.1: Initialize Next.js project

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --no-turbopack
```

If the directory already has files, initialize in place. Select these options:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: `@/*` (default)

**Verify**: `npm run dev` starts without errors.

### Task 1.2: Configure Next.js for static export

Edit `next.config.ts`:

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

### Task 1.3: Add `.nojekyll` file

Create `public/.nojekyll` (empty file) to prevent GitHub Pages from running Jekyll, which ignores `_next/` directories.

### Task 1.4: Set up fonts

In `src/app/layout.tsx`, configure Geist fonts:

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
```

Apply as CSS variables on `<body>`.

### Task 1.5: Install Lucide React

```bash
npm install lucide-react
```

**Verify**: `npm run build` succeeds.

---

## Phase 2: Data Layer

### Task 2.1: Create TypeScript types

Create `src/types/index.ts` with all types as defined in `01-data-model.md`:
- `SortField`
- `RacingClass`
- `TrackClass`
- `Track`
- `LapTimeEntry`

### Task 2.2: Create sample data files

Create the `data/` directory with sample data:

**`data/classes.json`**:
```json
[
  {
    "name": "Stock",
    "slug": "stock",
    "rules": "Stock motors only. No modifications to the chassis allowed. Pinion gear must be stock. Tires must be from the approved list.",
    "defaultSort": "bestLaptime"
  },
  {
    "name": "Modified",
    "slug": "modified",
    "rules": "Any motor allowed. Chassis modifications permitted. Custom pinion gears allowed. Open tire choice.",
    "defaultSort": "threeConsecutiveLaps"
  }
]
```

**`data/tracks.json`**:
```json
[
  {
    "name": "Hobby Carpet",
    "slug": "hobby-carpet",
    "classes": [
      { "classSlug": "stock" },
      { "classSlug": "modified" }
    ]
  },
  {
    "name": "RCP Mini 96",
    "slug": "rcp-mini-96",
    "classes": [
      { "classSlug": "stock", "defaultSort": "threeConsecutiveLaps" }
    ]
  }
]
```

**`data/results/hobby-carpet_stock.json`**:
```json
[
  {
    "driver": "Daniel",
    "carModel": "Rima Raptor Evo",
    "bestLaptime": 8.425,
    "threeConsecutiveLaps": 26.459,
    "updatedBestLaptime": "2026-03-27",
    "updatedThreeConsecutiveLaps": "2026-03-28"
  },
  {
    "driver": "Max",
    "carModel": "Kyosho MR-04",
    "bestLaptime": 8.612,
    "threeConsecutiveLaps": null,
    "updatedBestLaptime": "2026-03-25",
    "updatedThreeConsecutiveLaps": null
  },
  {
    "driver": "Sarah",
    "carModel": "GL Racing GLA",
    "bestLaptime": 8.731,
    "threeConsecutiveLaps": 26.891,
    "updatedBestLaptime": "2026-03-24",
    "updatedThreeConsecutiveLaps": "2026-03-24"
  }
]
```

Create similar sample files for other track+class combos.

### Task 2.3: Create data loading utilities

Create `src/lib/data.ts` with all functions as defined in `02-architecture.md`:
- `getTracks()`
- `getClasses()`
- `getClassBySlug()`
- `getTrackBySlug()`
- `getResults()`
- `getDefaultSort()`

**Verify**: Import and call in a test page, `npm run build` succeeds.

---

## Phase 3: Layout & Navigation

### Task 3.1: Create root layout with sidebar

Implement `src/app/layout.tsx`:
- Dark theme HTML shell with font variables
- Flex layout: sidebar (hidden on mobile) + main content
- Sidebar reads tracks from `getTracks()`

### Task 3.2: Create Sidebar component

Create `src/components/Sidebar.tsx`:
- App title at top
- "TRACKS" section label
- List of track links, each linking to `/tracks/{slug}/{firstClassSlug}`

Create `src/components/SidebarNav.tsx` (Client Component):
- Wraps track links with active state detection via `usePathname()`
- Active track: left border accent + background tint

### Task 3.3: Create MobileNav component

Create `src/components/MobileNav.tsx` (Client Component):
- Fixed top bar with hamburger icon (visible on `lg:hidden`)
- Drawer slides from left with backdrop
- Reuses sidebar content
- Closes on route change

### Task 3.4: Create global styles

Update `src/app/globals.css`:
- Tailwind directives
- Dark background on html/body
- Custom scrollbar styling (optional)
- Ensure `details > summary::-webkit-details-marker { display: none; }` for custom chevron

**Verify**: Layout renders with sidebar, `npm run dev` shows correct structure.

---

## Phase 4: Track & Class Pages

### Task 4.1: Create track layout

Create `src/app/tracks/[trackSlug]/layout.tsx`:
- `generateStaticParams` returning all track slugs
- Reads track data, resolves class names
- Renders track title + `ClassTabs` component
- Wraps `{children}`

### Task 4.2: Create ClassTabs component

Create `src/components/ClassTabs.tsx`:
- Underline tab style
- Each tab is a `<Link>` to `/tracks/{trackSlug}/{classSlug}`
- Active tab detection via `usePathname()` (Client Component wrapper)
- Horizontal scroll on mobile overflow

### Task 4.3: Create track index page (redirect)

Create `src/app/tracks/[trackSlug]/page.tsx`:
- `generateStaticParams` returning all track slugs
- Redirects to first class: `redirect(\`/tracks/${trackSlug}/${firstClassSlug}\`)`

### Task 4.4: Create class leaderboard page

Create `src/app/tracks/[trackSlug]/[classSlug]/page.tsx`:
- `generateStaticParams` returning all `{trackSlug, classSlug}` combos
- `dynamicParams = false`
- Reads results and default sort
- Renders `RulesAccordion` + `LeaderboardTable`

**Verify**: Navigation works — sidebar → track → class tabs → leaderboard content.

---

## Phase 5: Leaderboard Components

### Task 5.1: Create RulesAccordion

Create `src/components/RulesAccordion.tsx`:
- Native `<details>/<summary>` element
- Chevron icon rotates on expand (CSS only via `group-open`)
- Collapsed by default
- Styled with dark theme

### Task 5.2: Create LapTime component

Create `src/components/LapTime.tsx`:
- Formats number to 3 decimal places
- Shows "—" for null values
- Monospace font class

### Task 5.3: Create LeaderboardTable component

Create `src/components/LeaderboardTable.tsx` (Client Component — `"use client"`):
- Receives `entries` and `defaultSort` as props
- State: `sortField`, `sortDirection`
- Sort logic with null-last behavior
- Clickable column headers with sort indicator arrows
- Position column with medal styling for top 3
- Columns: #, Driver, Car Model, Best Laptime, 3 Consecutive Laps, Updated
- Empty state message when no entries
- Responsive: horizontal scroll wrapper

**Verify**: Sorting works, medals show for top 3, null times display as "—".

---

## Phase 6: Home Page & 404

### Task 6.1: Create home page redirect

Update `src/app/page.tsx`:
- Reads first track, redirects to `/tracks/{firstTrackSlug}/{firstClassSlug}`

### Task 6.2: Create 404 page

Create `src/app/not-found.tsx`:
- Simple "Page not found" message with link back to home
- Styled consistently with dark theme

---

## Phase 7: Polish & Responsive

### Task 7.1: Responsive table

- Wrap table in `overflow-x-auto` container
- Sticky first column (position + driver) on mobile via `sticky left-0`
- Test on narrow viewport

### Task 7.2: Mobile navigation testing

- Verify hamburger menu works
- Verify drawer closes on navigation
- Verify backdrop scroll lock

### Task 7.3: Metadata

Add `generateMetadata` to pages:
- Page title: `{Track Name} - {Class Name} | Mini-Z Leaderboard`
- Root metadata in layout: title template, description

---

## Phase 8: Deployment

### Task 8.1: Create GitHub Actions workflow

Create `.github/workflows/deploy.yml` as defined in `06-deployment.md`.

### Task 8.2: Build verification

```bash
npm run build
```

Verify `out/` directory is generated with:
- `index.html` (redirects to first track)
- `tracks/{trackSlug}/{classSlug}/index.html` for each combo
- `404.html`
- `_next/` static assets

### Task 8.3: Local static serving test

```bash
npx serve out
```

Navigate through the site, verify all links work, sorting works.

---

## Phase 9: Documentation

### Task 9.1: Write README

Create `README.md` as defined in `07-readme.md`.

### Task 9.2: Create deployment documentation

Ensure `06-deployment.md` is complete and accurate.

---

## Completion Checklist

- [ ] Next.js project initialized with TypeScript + Tailwind
- [ ] Static export configured
- [ ] Data model: classes.json, tracks.json, results files
- [ ] Data loading utilities with TypeScript types
- [ ] Root layout with sidebar navigation
- [ ] Mobile responsive navigation (drawer)
- [ ] Track layout with class tabs
- [ ] Class page with rules accordion
- [ ] Sortable leaderboard table
- [ ] Default sort from track/class config
- [ ] Medal styling for top 3
- [ ] Null time handling (display as "—", sort to bottom)
- [ ] Home page redirect
- [ ] 404 page
- [ ] GitHub Actions deployment workflow
- [ ] README documentation
- [ ] Build succeeds with `npm run build`
- [ ] Static site works with `npx serve out`
