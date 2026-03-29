# Data Model Changes

## Overview

Two types of translatable content exist in the data layer:

1. **Class rules** — stored in `data/classes.json`, user-editable content
2. **Track/class names** — could be translated but are proper nouns (brand names, location names) — **keep untranslated**

Only class rules need multilingual data support. Track names ("Hobby Carpet", "RCP Mini 96") and class names ("Stock", "Modified") are proper nouns used internationally and should remain as-is.

## Changes to `data/classes.json`

### Current Format

```json
[
  {
    "name": "Stock",
    "slug": "stock",
    "rules": "Stock motors only. No modifications to the chassis allowed. Pinion gear must be stock. Tires must be from the approved list.",
    "defaultSort": "bestLaptime"
  }
]
```

### New Format

```json
[
  {
    "name": "Stock",
    "slug": "stock",
    "rules": {
      "en": "Stock motors only. No modifications to the chassis allowed. Pinion gear must be stock. Tires must be from the approved list.",
      "de": "Nur Serienmotoren. Keine Modifikationen am Chassis erlaubt. Ritzel muss original sein. Reifen müssen von der genehmigten Liste sein."
    },
    "defaultSort": "bestLaptime"
  },
  {
    "name": "Modified",
    "slug": "modified",
    "rules": {
      "en": "Any motor allowed. Chassis modifications permitted. Custom pinion gears allowed. Open tire choice.",
      "de": "Jeder Motor erlaubt. Chassis-Modifikationen gestattet. Eigene Ritzel erlaubt. Freie Reifenwahl."
    },
    "defaultSort": "threeConsecutiveLaps"
  }
]
```

### Fallback Behavior

If a translation is missing for a locale, fall back to the default locale:

```typescript
export function getLocalizedRules(classSlug: string, lang: string): string {
  const racingClass = getClassBySlug(classSlug);
  if (!racingClass) return "";

  const rules = racingClass.rules;
  if (typeof rules === "string") return rules;  // Backwards compat
  return rules[lang] ?? rules[i18n.defaultLocale] ?? Object.values(rules)[0] ?? "";
}
```

## TypeScript Type Changes

### `src/types/index.ts`

```typescript
import type { Locale } from "@/lib/i18n/config";

export type SortField = "bestLaptime" | "threeConsecutiveLaps";

// Multilingual text: a record of locale → string
export type LocalizedText = Partial<Record<Locale, string>>;

export interface RacingClass {
  name: string;
  slug: string;
  rules: LocalizedText;           // CHANGED: was string, now localized
  defaultSort: SortField;
}

export interface TrackClass {
  classSlug: string;
  defaultSort?: SortField;
}

export interface Track {
  name: string;                    // Unchanged — proper noun
  slug: string;
  classes: TrackClass[];
}

export interface LapTimeEntry {
  driver: string;                  // Unchanged — proper name
  carModel: string;                // Unchanged — product name
  bestLaptime: number | null;
  threeConsecutiveLaps: number | null;
  updatedBestLaptime: string | null;
  updatedThreeConsecutiveLaps: string | null;
}
```

## Changes to `src/lib/data.ts`

Add a new function:

```typescript
import { i18n } from "@/lib/i18n/config";

export function getLocalizedRules(classSlug: string, lang: string): string {
  const racingClass = getClassBySlug(classSlug);
  if (!racingClass) return "";

  const rules = racingClass.rules;

  // Support old format (plain string) for backwards compatibility during migration
  if (typeof rules === "string") return rules;

  return rules[lang as keyof typeof rules]
    ?? rules[i18n.defaultLocale as keyof typeof rules]
    ?? "";
}
```

## No Changes to Results Data

`data/results/*.json` files contain:
- `driver` — person name, not translated
- `carModel` — product name, not translated
- Numeric values — universal

These files remain unchanged.

## No Changes to `data/tracks.json`

Track names and class slug references are not translated. The file remains unchanged.

## Summary of Data Changes

| File | Change |
|------|--------|
| `data/classes.json` | `rules` field changes from `string` to `{ en: string, de: string }` |
| `data/tracks.json` | No change |
| `data/results/*.json` | No change |
| `src/types/index.ts` | New `LocalizedText` type, `RacingClass.rules` type updated |
| `src/lib/data.ts` | New `getLocalizedRules()` function |
