# Translation System

## i18n Configuration

### `src/lib/i18n/config.ts`

Central configuration for supported locales and the default language.

```typescript
export const i18n = {
  defaultLocale: "en",
  locales: ["en", "de"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function isValidLocale(lang: string): lang is Locale {
  return i18n.locales.includes(lang as Locale);
}

export function localizedHref(lang: string, path: string): string {
  return `/${lang}${path}`;
}
```

**Configurable default:** Changing `defaultLocale` to `"de"` makes the site default to German. The root `/` redirect and any fallback behavior uses this value.

## Dictionary Files

### Location

```
src/lib/i18n/
├── config.ts           # Locale config + helpers
├── dictionaries.ts     # Dictionary loader
└── dictionaries/
    ├── en.json         # English translations
    └── de.json         # German translations
```

### `src/lib/i18n/dictionaries/en.json`

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
  "notFound": {
    "title": "404",
    "message": "Page not found.",
    "backHome": "Back to home"
  },
  "language": {
    "switch": "Language",
    "en": "English",
    "de": "Deutsch"
  }
}
```

### `src/lib/i18n/dictionaries/de.json`

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
  "notFound": {
    "title": "404",
    "message": "Seite nicht gefunden.",
    "backHome": "Zurück zur Startseite"
  },
  "language": {
    "switch": "Sprache",
    "en": "English",
    "de": "Deutsch"
  }
}
```

### `{className}` Placeholder

The rules label uses a simple string replacement pattern. No library needed — just:

```typescript
function t(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (str, [key, val]) => str.replace(`{${key}}`, val),
    template
  );
}

// Usage:
t(dict.rules.label, { className: "Stock" })  // → "Stock Rules"
t(dict.rules.label, { className: "Stock" })  // → "Stock Regeln" (German dict)
```

## Dictionary Loader

### `src/lib/i18n/dictionaries.ts`

```typescript
import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
```

**`server-only`:** This ensures the dictionary loader is never accidentally imported in a client component. Client components receive dictionary strings as props.

**Note:** The `server-only` package may need to be installed: `npm install server-only`. This is the **one exception** to "no new dependencies" — it's a tiny Next.js utility (zero runtime code) that prevents server imports in client bundles.

## Type Safety

The `Dictionary` type is inferred from the JSON structure. TypeScript will catch missing keys at build time. Both `en.json` and `de.json` must have identical structure.

To enforce this during development, add a type check:

```typescript
// In dictionaries.ts
import type enDict from "./dictionaries/en.json";
type DictionaryShape = typeof enDict;

// Verify de.json matches en.json shape
const _deCheck: DictionaryShape = await import("./dictionaries/de.json").then(m => m.default);
```

Or simpler: just let TypeScript's strict mode catch mismatches when components use `dict.leaderboard.driver` etc.

## How Dictionaries Flow Through Components

```
[lang]/layout.tsx (Server Component)
  ├── getDictionary(lang)
  ├── passes dict + lang to Sidebar, MobileNav
  └── passes lang to children via params
        │
        └── [lang]/tracks/[trackSlug]/layout.tsx (Server Component)
              ├── getDictionary(lang)
              ├── passes dict sections to ClassTabs
              └── passes lang to children via params
                    │
                    └── [lang]/tracks/[trackSlug]/[classSlug]/page.tsx (Server)
                          ├── getDictionary(lang)
                          ├── passes dict.leaderboard to LeaderboardTable (Client)
                          └── passes dict.rules to RulesAccordion (Server)
```

**Key rule:** Server components call `getDictionary()` themselves. Client components receive only the translation strings they need as props — not the whole dictionary.
