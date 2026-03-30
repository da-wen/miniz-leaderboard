# Data Model Changes

## 1. `tracks.json` Schema Update

### Current Schema

```json
[
  {
    "name": "Fusselflitzer Hockenheim",
    "slug": "fusselflitzer-2026-03",
    "classes": [
      { "classSlug": "stock", "defaultSort": "threeConsecutiveLaps" },
      { "classSlug": "modified", "defaultSort": "threeConsecutiveLaps" }
    ]
  }
]
```

### New Schema

Add an optional `info` field of type `LocalizedText` (same as `rules` in `classes.json`):

```json
[
  {
    "name": "Fusselflitzer Hockenheim",
    "slug": "fusselflitzer-2026-03",
    "info": {
      "en": "<p>Indoor carpet track at <b>Fusselflitzer Hockenheim</b>.</p><p>Track length: ~18m</p>",
      "de": "<p>Indoor-Teppichstrecke bei <b>Fusselflitzer Hockenheim</b>.</p><p>Streckenlänge: ~18m</p>"
    },
    "classes": [
      { "classSlug": "stock", "defaultSort": "threeConsecutiveLaps" },
      { "classSlug": "modified", "defaultSort": "threeConsecutiveLaps" }
    ]
  }
]
```

### Field Specification

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `info` | `LocalizedText` | No | `undefined` | Localized HTML content for track info section |

### Handling Empty/Missing Values

The `info` field is **optional**. All of these are valid and result in **no info section being rendered**:

```json
// Option 1: Field omitted entirely
{ "name": "Track", "slug": "track", "classes": [...] }

// Option 2: Field set to null
{ "name": "Track", "slug": "track", "info": null, "classes": [...] }

// Option 3: Empty strings
{ "name": "Track", "slug": "track", "info": { "en": "", "de": "" }, "classes": [...] }
```

### Supported HTML Tags

Same whitelist as `RulesAccordion` (defined in `SANITIZE_CONFIG`):

- **Text formatting:** `b`, `i`, `em`, `strong`, `u`, `s`
- **Block elements:** `p`, `br`, `hr`
- **Headings:** `h3`, `h4`
- **Lists:** `ul`, `ol`, `li`
- **Links:** `a` (with `href`, `target`, `rel` attributes)
- **Inline:** `span`, `code`
- **Tables:** `table`, `thead`, `tbody`, `tr`, `th`, `td`
- **Allowed attributes:** `href`, `target`, `rel`, `class`

---

## 2. TypeScript Type Update

### File: `src/types/index.ts`

**Current `Track` interface (lines 19-23):**

```typescript
export interface Track {
  name: string;
  slug: string;
  classes: TrackClass[];
}
```

**Updated `Track` interface:**

```typescript
export interface Track {
  name: string;
  slug: string;
  info?: LocalizedText;
  classes: TrackClass[];
}
```

**Changes:**
- Add `info?: LocalizedText` — optional field using the existing `LocalizedText` type (`Partial<Record<Locale, string>>`)
- No other type changes needed
- `LocalizedText` is already defined at line 5: `export type LocalizedText = Partial<Record<Locale, string>>;`

---

## 3. Data Loader Update

### File: `src/lib/data.ts`

**Add new function** `getLocalizedTrackInfo()` — mirrors `getLocalizedRules()` (lines 47-55):

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

**Behavior:**
1. Look up the track by slug
2. If `track` doesn't exist or `info` is `undefined`/`null` → return `""`
3. Try the requested language (e.g., `"en"`)
4. Fall back to default locale (`"de"`)
5. Fall back to `""` if neither exists

**No changes** to existing functions (`getTracks`, `getTrackBySlug`, etc.) — they already return the full `Track` object, which will now include the optional `info` field if present in JSON.
