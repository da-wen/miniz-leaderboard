# Implementation Tasks

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional, collapsible track info section below the track name headline, supporting localized HTML content.

**Architecture:** Extend `Track` type with `info?: LocalizedText`, add data loader, create `TrackInfoAccordion` client component, integrate into track layout with conditional rendering, update i18n dictionaries and documentation.

**Tech Stack:** Next.js 16 (App Router, SSG), React 19, TypeScript, Tailwind CSS 4, isomorphic-dompurify, lucide-react

---

## Phase 1: Data Layer

### Task 1: Add `info` field to Track type

**Files:**
- Modify: `src/types/index.ts:19-23`

- [ ] **Step 1: Add `info` to the Track interface**

Open `src/types/index.ts` and add the `info` field to the `Track` interface:

```typescript
export interface Track {
  name: string;
  slug: string;
  info?: LocalizedText;
  classes: TrackClass[];
}
```

The `LocalizedText` type is already defined at line 5 as `Partial<Record<Locale, string>>`.

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors (the field is optional, so existing code is unaffected)

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add optional info field to Track type"
```

---

### Task 2: Add `getLocalizedTrackInfo()` data loader

**Files:**
- Modify: `src/lib/data.ts`

- [ ] **Step 1: Add the `getLocalizedTrackInfo` function**

Add the following function to `src/lib/data.ts`, after the existing `getLocalizedRules` function (after line 55):

```typescript
export function getLocalizedTrackInfo(trackSlug: string, lang: string): string {
  const track = getTrackBySlug(trackSlug);
  if (!track?.info) return "";

  const info = track.info;
  return info[lang as keyof typeof info]
    ?? info[i18n.defaultLocale as keyof typeof info]
    ?? "";
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/data.ts
git commit -m "feat: add getLocalizedTrackInfo data loader"
```

---

### Task 3: Add track info to `tracks.json`

**Files:**
- Modify: `data/tracks.json`

- [ ] **Step 1: Add `info` field to the existing track**

Update `data/tracks.json`:

```json
[
  {
    "name": "Fusselflitzer Hockenheim",
    "slug": "fusselflitzer-2026-03",
    "info": {
      "en": "<p>Indoor carpet track at <b>Fusselflitzer Hockenheim</b>.</p>",
      "de": "<p>Indoor-Teppichstrecke bei <b>Fusselflitzer Hockenheim</b>.</p>"
    },
    "classes": [
      { "classSlug": "stock", "defaultSort": "threeConsecutiveLaps" },
      { "classSlug": "modified", "defaultSort": "threeConsecutiveLaps" }
    ]
  }
]
```

Note: The actual content is a placeholder. The project maintainer can update the info text later with real track details.

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('data/tracks.json','utf-8')); console.log('Valid JSON')"`
Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add data/tracks.json
git commit -m "feat: add info content to tracks.json"
```

---

## Phase 2: Component

### Task 4: Create `TrackInfoAccordion` component

**Files:**
- Create: `src/components/TrackInfoAccordion.tsx`

- [ ] **Step 1: Create the component file**

Create `src/components/TrackInfoAccordion.tsx`:

```tsx
"use client";

import DOMPurify from "isomorphic-dompurify";
import { ChevronRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SANITIZE_CONFIG: any = {
  ALLOWED_TAGS: [
    "b", "i", "em", "strong", "u", "s",
    "p", "br", "hr",
    "h3", "h4",
    "ul", "ol", "li",
    "a",
    "span", "code",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
};

interface TrackInfoAccordionProps {
  info: string;
  label: string;
}

export function TrackInfoAccordion({ info, label }: TrackInfoAccordionProps) {
  const sanitizedInfo = DOMPurify.sanitize(info, SANITIZE_CONFIG);

  return (
    <details className="group mb-6 rounded-lg border border-slate-800 bg-slate-900">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white list-none">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        {label}
      </summary>
      <div
        className="px-4 pb-4 prose prose-sm prose-invert max-w-none prose-p:text-slate-400 prose-li:text-slate-400 prose-headings:text-slate-300 prose-a:text-blue-400 prose-code:text-slate-300 prose-hr:border-slate-700 prose-table:text-slate-400 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: sanitizedInfo }}
      />
    </details>
  );
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Verify lint passes**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/TrackInfoAccordion.tsx
git commit -m "feat: create TrackInfoAccordion component"
```

---

## Phase 3: Integration

### Task 5: Add i18n dictionary entries

**Files:**
- Modify: `src/lib/i18n/dictionaries/en.json`
- Modify: `src/lib/i18n/dictionaries/de.json`

- [ ] **Step 1: Add `trackInfo` to English dictionary**

In `src/lib/i18n/dictionaries/en.json`, add after the `"rules"` section:

```json
"trackInfo": {
  "label": "Track Info"
},
```

- [ ] **Step 2: Add `trackInfo` to German dictionary**

In `src/lib/i18n/dictionaries/de.json`, add after the `"rules"` section:

```json
"trackInfo": {
  "label": "Streckeninfo"
},
```

- [ ] **Step 3: Verify JSON validity**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/lib/i18n/dictionaries/en.json','utf-8')); JSON.parse(require('fs').readFileSync('src/lib/i18n/dictionaries/de.json','utf-8')); console.log('Valid')"`
Expected: `Valid`

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n/dictionaries/en.json src/lib/i18n/dictionaries/de.json
git commit -m "feat: add trackInfo i18n dictionary entries"
```

---

### Task 6: Wire TrackInfoAccordion into track layout

**Files:**
- Modify: `src/app/[lang]/tracks/[trackSlug]/layout.tsx`

- [ ] **Step 1: Add imports**

Add these imports at the top of `src/app/[lang]/tracks/[trackSlug]/layout.tsx`:

```typescript
import { getLocalizedTrackInfo } from "@/lib/data";
import { TrackInfoAccordion } from "@/components/TrackInfoAccordion";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
```

Update the existing data import to include the new function:

```typescript
import { getTracks, getTrackBySlug, getClasses, getLocalizedTrackInfo } from "@/lib/data";
```

- [ ] **Step 2: Add data loading in the layout function**

Inside the `TrackLayout` function, after the `trackClasses` variable, add:

```typescript
const trackInfo = getLocalizedTrackInfo(trackSlug, lang);
const dict = await getDictionary(lang as Locale);
```

- [ ] **Step 3: Add conditional rendering in JSX**

In the return JSX, add the `TrackInfoAccordion` between the `<h1>` and `<ClassTabs>`:

```tsx
return (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold mb-6 text-slate-50">{track.name}</h1>
    {trackInfo && (
      <TrackInfoAccordion info={trackInfo} label={dict.trackInfo.label} />
    )}
    <ClassTabs trackSlug={trackSlug} classes={trackClasses} lang={lang} />
    <div className="mt-6">{children}</div>
  </div>
);
```

- [ ] **Step 4: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Verify lint passes**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/app/[lang]/tracks/[trackSlug]/layout.tsx
git commit -m "feat: integrate TrackInfoAccordion into track layout"
```

---

## Phase 4: Verification

### Task 7: Build and visual verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors. All static pages are generated.

- [ ] **Step 2: Start local server**

Run: `npx serve out`
Expected: Server starts at http://localhost:3000

- [ ] **Step 3: Verify track info section appears**

Open the browser and navigate to any track page.

Verify:
- The "Track Info" / "Streckeninfo" accordion appears between the track name and class tabs
- It starts **collapsed** (only the label and chevron are visible)
- Clicking it expands the info section with rendered HTML content
- The chevron rotates 90° when expanded
- The content is styled with the dark theme (slate colors, prose formatting)
- Switching language updates both the label and the info content

- [ ] **Step 4: Verify empty info behavior**

Temporarily remove the `info` field from a track in `tracks.json`:

```json
{
  "name": "Fusselflitzer Hockenheim",
  "slug": "fusselflitzer-2026-03",
  "classes": [...]
}
```

Run `npm run build && npx serve out`.
Verify: No info accordion is displayed for that track. No errors.

Restore the `info` field after verification.

- [ ] **Step 5: Verify responsive behavior**

Open browser dev tools and test at different breakpoints:
- Desktop (1024px+): Info section has `lg:p-8` padding
- Mobile (<1024px): Info section has `p-6` padding
- Tables in info content scroll horizontally on narrow viewports

---

## Phase 5: Documentation

### Task 8: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add track info documentation**

In `README.md`, after the "Adding a New Track" section (after the track JSON example around line 95), add a new section:

```markdown
### Track Info

Tracks can have an optional info section that appears as a collapsible accordion below the track name. The `info` field supports the same HTML tags as rules.

```json
{
  "name": "New Track",
  "slug": "new-track",
  "info": {
    "en": "<p>Indoor carpet track. Track length: ~18m.</p>",
    "de": "<p>Indoor-Teppichstrecke. Streckenlänge: ~18m.</p>"
  },
  "classes": [
    { "classSlug": "stock" }
  ]
}
```

If `info` is omitted or empty, no info section is displayed.
```

- [ ] **Step 2: Update Features list**

In the Features section at the top of README.md, add:

```markdown
- Collapsible track info section (optional, supports HTML)
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add track info documentation to README"
```

---

### Task 9: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update Data Schema section**

In the `CLAUDE.md` Data Schema section, update the `data/tracks.json` entry:

```markdown
- `data/tracks.json` — track definitions with assigned classes (supports per-track sort overrides and optional localized HTML `info`)
```

- [ ] **Step 2: Update Architecture section**

In the Architecture section, after the existing "HTML in rules" paragraph, add:

```markdown
**HTML in track info:** The `info` field in `tracks.json` supports the same HTML subset as rules. `TrackInfoAccordion` sanitizes via `isomorphic-dompurify` before rendering. If `info` is null/empty, the section is not displayed.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add track info documentation to CLAUDE.md"
```
