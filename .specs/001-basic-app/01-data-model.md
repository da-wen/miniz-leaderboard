# Data Model

## Design Goals

- **No redundancy**: Classes defined once globally, tracks reference classes by slug
- **Separation**: Config (tracks, classes) vs. data (results) are separate files
- **Simple editing**: Only JSON files need editing to update the leaderboard
- **Validation**: TypeScript types enforce structure at build time

## File Structure

```
data/
├── classes.json                    # Global class definitions
├── tracks.json                     # Track definitions with assigned classes
└── results/
    ├── hobby-carpet_stock.json     # Results per track+class combo
    ├── hobby-carpet_modified.json
    └── ...
```

Results file naming convention: `{trackSlug}_{classSlug}.json`

---

## Schema: `data/classes.json`

Global definitions for all racing classes. Each class has rules and a default sort column.

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

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name of the class |
| `slug` | string | yes | URL-safe identifier (lowercase, hyphens) |
| `rules` | string | yes | Rules description (plain text, can contain line breaks) |
| `defaultSort` | `"bestLaptime"` \| `"threeConsecutiveLaps"` | yes | Default column to sort the leaderboard by |

---

## Schema: `data/tracks.json`

Track definitions. Each track references classes by slug and can override the default sort per class.

```json
[
  {
    "name": "Hobby Carpet",
    "slug": "hobby-carpet",
    "classes": [
      {
        "classSlug": "stock",
        "defaultSort": "bestLaptime"
      },
      {
        "classSlug": "modified"
      }
    ]
  },
  {
    "name": "RCP Mini 96",
    "slug": "rcp-mini-96",
    "classes": [
      {
        "classSlug": "stock"
      }
    ]
  }
]
```

### Track Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name of the track |
| `slug` | string | yes | URL-safe identifier |
| `classes` | TrackClass[] | yes | Assigned classes for this track |

### TrackClass Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `classSlug` | string | yes | References a class from `classes.json` |
| `defaultSort` | `"bestLaptime"` \| `"threeConsecutiveLaps"` | no | Override the class-level default sort for this track |

**Sort priority**: Track-level `defaultSort` > Class-level `defaultSort`

---

## Schema: `data/results/{trackSlug}_{classSlug}.json`

Lap time entries for a specific track + class combination. One file per combination.

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
  }
]
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `driver` | string | yes | Driver name |
| `carModel` | string | yes | Car model name |
| `bestLaptime` | number \| null | conditional | Best single lap time in seconds |
| `threeConsecutiveLaps` | number \| null | conditional | Best 3 consecutive laps total in seconds |
| `updatedBestLaptime` | string \| null | no | ISO date when best laptime was last updated |
| `updatedThreeConsecutiveLaps` | string \| null | no | ISO date when 3 consecutive laps was last updated |

**Validation rule**: At least one of `bestLaptime` or `threeConsecutiveLaps` must be non-null.

---

## TypeScript Types

```typescript
// src/types/index.ts

export type SortField = "bestLaptime" | "threeConsecutiveLaps";

export interface RacingClass {
  name: string;
  slug: string;
  rules: string;
  defaultSort: SortField;
}

export interface TrackClass {
  classSlug: string;
  defaultSort?: SortField;
}

export interface Track {
  name: string;
  slug: string;
  classes: TrackClass[];
}

export interface LapTimeEntry {
  driver: string;
  carModel: string;
  bestLaptime: number | null;
  threeConsecutiveLaps: number | null;
  updatedBestLaptime: string | null;
  updatedThreeConsecutiveLaps: string | null;
}
```

---

## Data Flow

```
classes.json ──┐
               ├──> Build Time ──> Static HTML pages
tracks.json ───┤
               │
results/*.json ┘
```

1. `classes.json` defines available classes globally
2. `tracks.json` defines tracks and assigns classes (by slug reference)
3. `results/{trackSlug}_{classSlug}.json` contains the actual lap times
4. At build time, `generateStaticParams()` reads tracks + classes to generate all routes
5. Each page reads the corresponding results file and renders the leaderboard
