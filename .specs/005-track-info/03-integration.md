# Integration: Track Layout & i18n

## Overview

Wire the `TrackInfoAccordion` into the track layout and add i18n dictionary entries. The info section renders between the track name `<h1>` and the `<ClassTabs>`, and only appears when the track has non-empty info content.

## 1. Track Layout Changes

### File: `src/app/[lang]/tracks/[trackSlug]/layout.tsx`

**Current code (lines 1-45):**

```tsx
import type { Metadata } from "next";
import { getTracks, getTrackBySlug, getClasses } from "@/lib/data";
import { ClassTabs } from "@/components/ClassTabs";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tracks = getTracks();
  return tracks.map((track) => ({ trackSlug: track.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);
  return { title: track?.name ?? trackSlug };
}

export default async function TrackLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; trackSlug: string }>;
}) {
  const { lang, trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);

  if (!track) notFound();

  const allClasses = getClasses();
  const trackClasses = track.classes
    .map((tc) => allClasses.find((c) => c.slug === tc.classSlug)!)
    .filter(Boolean);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-50">{track.name}</h1>
      <ClassTabs trackSlug={trackSlug} classes={trackClasses} lang={lang} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
```

**Updated code:**

```tsx
import type { Metadata } from "next";
import { getTracks, getTrackBySlug, getClasses, getLocalizedTrackInfo } from "@/lib/data";
import { ClassTabs } from "@/components/ClassTabs";
import { TrackInfoAccordion } from "@/components/TrackInfoAccordion";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export async function generateStaticParams() {
  const tracks = getTracks();
  return tracks.map((track) => ({ trackSlug: track.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);
  return { title: track?.name ?? trackSlug };
}

export default async function TrackLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; trackSlug: string }>;
}) {
  const { lang, trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);

  if (!track) notFound();

  const allClasses = getClasses();
  const trackClasses = track.classes
    .map((tc) => allClasses.find((c) => c.slug === tc.classSlug)!)
    .filter(Boolean);

  const trackInfo = getLocalizedTrackInfo(trackSlug, lang);
  const dict = await getDictionary(lang as Locale);

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
}
```

**Changes summary:**
1. Import `getLocalizedTrackInfo` from `@/lib/data`
2. Import `TrackInfoAccordion` from `@/components/TrackInfoAccordion`
3. Import `getDictionary` from `@/lib/i18n/dictionaries`
4. Import `Locale` type from `@/lib/i18n/config`
5. Call `getLocalizedTrackInfo(trackSlug, lang)` to get the localized info string
6. Load dictionary for the label
7. Conditionally render `<TrackInfoAccordion>` only when `trackInfo` is truthy (non-empty string)

### Conditional Rendering Logic

```tsx
{trackInfo && (
  <TrackInfoAccordion info={trackInfo} label={dict.trackInfo.label} />
)}
```

This ensures:
- `info` is `undefined` → `getLocalizedTrackInfo` returns `""` → falsy → not rendered
- `info` is `null` → `getLocalizedTrackInfo` returns `""` → falsy → not rendered
- `info` is `{ "en": "" }` → resolved to `""` → falsy → not rendered
- `info` is `{ "en": "<p>Content</p>" }` → resolved to `"<p>Content</p>"` → truthy → rendered

### Visual Placement

```
┌──────────────────────────────────┐
│ Track Name (h1)                  │
│                                  │
│ ▶ Track Info  (collapsed)        │  ← NEW: TrackInfoAccordion
│                                  │
│ [Stock] [Modified]  (class tabs) │
│                                  │
│ ▶ Stock Rules (collapsed)        │
│ ┌──────────────────────────────┐ │
│ │ Leaderboard Table            │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

---

## 2. i18n Dictionary Updates

### File: `src/lib/i18n/dictionaries/en.json`

**Add** `trackInfo` section:

```json
{
  "trackInfo": {
    "label": "Track Info"
  }
}
```

**Full file after change:**

```json
{
  "meta": {
    "title": "Mini-Z Leaderboard",
    "description": "Mini-Z RC car racing lap time leaderboard"
  },
  "nav": {
    "tracks": "Tracks",
    "navigation": "Navigation",
    "leaderboard": "Leaderboard"
  },
  "leaderboard": {
    "rank": "#",
    "driver": "Driver",
    "carModel": "Car Model",
    "bestLaptime": "Best Laptime",
    "threeConsecutiveLaps": "3 Consecutive Laps",
    "updated": "Updated",
    "noEntries": "No lap times recorded yet."
  },
  "rules": {
    "label": "{className} Rules"
  },
  "trackInfo": {
    "label": "Track Info"
  },
  "notFound": {
    "title": "404",
    "message": "Page not found.",
    "backHome": "Back to home"
  },
  "language": {
    "switch": "Language",
    "en": "English",
    "de": "Deutsch"
  },
  "footer": {
    "imprint": "Legal Notice"
  },
  "imprint": {
    "title": "Legal Notice",
    "contact": "Contact",
    "email": "Email"
  }
}
```

### File: `src/lib/i18n/dictionaries/de.json`

**Add** `trackInfo` section:

```json
{
  "trackInfo": {
    "label": "Streckeninfo"
  }
}
```

**Full file after change:**

```json
{
  "meta": {
    "title": "Mini-Z Bestenliste",
    "description": "Mini-Z RC Auto Rundenzeiten Bestenliste"
  },
  "nav": {
    "tracks": "Strecken",
    "navigation": "Navigation",
    "leaderboard": "Bestenliste"
  },
  "leaderboard": {
    "rank": "#",
    "driver": "Fahrer",
    "carModel": "Automodell",
    "bestLaptime": "Beste Rundenzeit",
    "threeConsecutiveLaps": "3 Aufeinanderfolgende Runden",
    "updated": "Aktualisiert",
    "noEntries": "Noch keine Rundenzeiten eingetragen."
  },
  "rules": {
    "label": "{className} Regeln"
  },
  "trackInfo": {
    "label": "Streckeninfo"
  },
  "notFound": {
    "title": "404",
    "message": "Seite nicht gefunden.",
    "backHome": "Zurück zur Startseite"
  },
  "language": {
    "switch": "Sprache",
    "en": "English",
    "de": "Deutsch"
  },
  "footer": {
    "imprint": "Impressum"
  },
  "imprint": {
    "title": "Impressum",
    "contact": "Kontakt",
    "email": "E-Mail"
  }
}
```

---

## 3. TypeScript Dictionary Type Safety

The dictionaries are loaded dynamically via `import()` and typed implicitly. Adding the `trackInfo` key to both JSON files is sufficient — TypeScript will infer the type from the JSON structure. No additional type definitions are needed.

If the codebase ever adds explicit dictionary types, `trackInfo: { label: string }` would need to be included.
