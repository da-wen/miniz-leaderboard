# Architecture

## Project Structure

```
miniz-leaderboard/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages deployment
├── data/                           # DATA FILES (edit these to update leaderboard)
│   ├── classes.json                # Global class definitions
│   ├── tracks.json                 # Track definitions + class assignments
│   └── results/                    # Lap time results per track+class
│       ├── hobby-carpet_stock.json
│       └── ...
├── src/
│   ├── app/                        # Next.js App Router (routing only)
│   │   ├── layout.tsx              # Root layout: HTML shell + sidebar
│   │   ├── page.tsx                # Home page (redirects to first track)
│   │   ├── globals.css             # Global styles + Tailwind imports
│   │   ├── not-found.tsx           # Custom 404 page
│   │   └── tracks/
│   │       └── [trackSlug]/
│   │           ├── layout.tsx      # Track layout: track title + class tabs
│   │           └── [classSlug]/
│   │               └── page.tsx    # Leaderboard page: rules + table
│   ├── components/                 # React components
│   │   ├── Sidebar.tsx             # Track navigation sidebar
│   │   ├── MobileNav.tsx           # Mobile hamburger + drawer
│   │   ├── ClassTabs.tsx           # Tab navigation for classes
│   │   ├── RulesAccordion.tsx      # Expandable rules section
│   │   ├── LeaderboardTable.tsx    # Sortable data table (client component)
│   │   └── LapTime.tsx             # Formatted time display
│   ├── lib/                        # Data loading utilities
│   │   └── data.ts                 # Read JSON files at build time
│   └── types/                      # TypeScript type definitions
│       └── index.ts                # All shared types
├── public/
│   └── .nojekyll                   # Prevent GitHub Pages Jekyll processing
├── next.config.ts                  # Next.js config (output: 'export')
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
└── README.md
```

## Routing

| URL Path | File | Description |
|----------|------|-------------|
| `/` | `app/page.tsx` | Redirects to first track |
| `/tracks/[trackSlug]` | `app/tracks/[trackSlug]/layout.tsx` | Track layout with tabs (redirects to first class) |
| `/tracks/[trackSlug]/[classSlug]` | `app/tracks/[trackSlug]/[classSlug]/page.tsx` | Leaderboard for track + class |

## Static Generation

### `generateStaticParams` in `[trackSlug]/[classSlug]/page.tsx`

```typescript
export async function generateStaticParams() {
  const tracks = getTracks();
  const params: { trackSlug: string; classSlug: string }[] = [];

  for (const track of tracks) {
    for (const trackClass of track.classes) {
      params.push({
        trackSlug: track.slug,
        classSlug: trackClass.classSlug,
      });
    }
  }

  return params;
}

// Reject any path not generated at build time
export const dynamicParams = false;
```

### `generateStaticParams` in `[trackSlug]/layout.tsx`

```typescript
export async function generateStaticParams() {
  const tracks = getTracks();
  return tracks.map((track) => ({ trackSlug: track.slug }));
}
```

## Data Loading (`src/lib/data.ts`)

All data loading happens at build time via Node.js `fs`. Server Components call these functions directly.

```typescript
import fs from "fs";
import path from "path";
import type { Track, RacingClass, LapTimeEntry } from "@/types";

const dataDir = path.join(process.cwd(), "data");

export function getTracks(): Track[] {
  const raw = fs.readFileSync(path.join(dataDir, "tracks.json"), "utf-8");
  return JSON.parse(raw);
}

export function getClasses(): RacingClass[] {
  const raw = fs.readFileSync(path.join(dataDir, "classes.json"), "utf-8");
  return JSON.parse(raw);
}

export function getClassBySlug(slug: string): RacingClass | undefined {
  return getClasses().find((c) => c.slug === slug);
}

export function getTrackBySlug(slug: string): Track | undefined {
  return getTracks().find((t) => t.slug === slug);
}

export function getResults(trackSlug: string, classSlug: string): LapTimeEntry[] {
  const filePath = path.join(dataDir, "results", `${trackSlug}_${classSlug}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getDefaultSort(trackSlug: string, classSlug: string): SortField {
  const track = getTrackBySlug(trackSlug);
  const trackClass = track?.classes.find((c) => c.classSlug === classSlug);
  const racingClass = getClassBySlug(classSlug);

  // Track-level override > Class-level default
  return trackClass?.defaultSort ?? racingClass?.defaultSort ?? "bestLaptime";
}
```

## Component Rendering Model

| Component | Server/Client | Why |
|-----------|--------------|-----|
| `layout.tsx` (root) | Server | Reads tracks.json, renders sidebar |
| `layout.tsx` (track) | Server | Reads track data, renders tabs |
| `page.tsx` (class) | Server | Reads results, passes to table |
| `Sidebar` | Server | Static track list, uses `Link` |
| `MobileNav` | Client | Needs `useState` for drawer toggle |
| `ClassTabs` | Server | Static tab links |
| `RulesAccordion` | Client | Needs `useState` for expand/collapse (or use `<details>`) |
| `LeaderboardTable` | Client | Needs `useState` for sort column/direction |
| `LapTime` | Server | Pure formatting |

## `next.config.ts`

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

**Note**: `basePath` is injected automatically by `actions/configure-pages` during CI build. Do not hardcode it.

## Key Architectural Decisions

1. **App Router over Pages Router** — modern patterns, layouts persist across navigation
2. **Server Components by default** — only interactive components are Client Components
3. **Data outside `src/`** — `data/` directory is clearly separated from code
4. **`fs.readFileSync` for data** — runs only at build time, simple and reliable
5. **`dynamicParams = false`** — strict static generation, 404 for unknown routes
6. **No `basePath` hardcoded** — GitHub Actions handles this automatically
7. **Tailwind CSS** — utility-first, no component library dependency beyond icons
8. **`<details>/<summary>`** for rules accordion — zero JS, progressive enhancement (can be enhanced with CSS transitions)
