# Mini-Z Leaderboard

A static leaderboard website for Mini-Z RC car racing lap times. Built with Next.js, deployed to GitHub Pages.

## Features

- Track-based navigation with sidebar
- Multiple racing classes per track with tab switching
- Expandable rules section per class
- Collapsible track info section (optional, supports HTML)
- Sortable leaderboard tables (by best lap time or 3 consecutive laps)
- Configurable default sort per track and class
- Responsive design (desktop, tablet, mobile)
- Fully static — no server or database required
- Legal notice / Impressum page (bilingual, German + English)

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
# Build static site
npm run build

# Test static build locally
npx serve out
```

## Managing Data

All data is stored in JSON files in the `data/` directory. No code changes needed to update the leaderboard.

### File Structure

```
data/
├── classes.json          # Racing class definitions (name, rules, default sort)
├── tracks.json           # Track definitions, class assignments, and optional info
├── imprint.json          # Personal data for imprint/legal notice page
└── results/              # Lap time data per track + class
    ├── {track}_{class}.json
    └── ...
```

### Adding a New Driver Entry

Edit the appropriate file in `data/results/`:

```json
{
  "driver": "Name",
  "carModel": "Car Model",
  "bestLaptime": 8.425,
  "threeConsecutiveLaps": 26.459,
  "updatedBestLaptime": "2026-03-27",
  "updatedThreeConsecutiveLaps": "2026-03-28"
}
```

- At least one of `bestLaptime` or `threeConsecutiveLaps` must be provided
- Set unused fields to `null`

### Adding a New Track

1. Add the track to `data/tracks.json`:
   ```json
   {
     "name": "New Track",
     "slug": "new-track",
     "classes": [
       { "classSlug": "stock" }
     ]
   }
   ```

2. Create the results file `data/results/new-track_stock.json`:
   ```json
   []
   ```

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

If `info` is omitted or empty, no info section is displayed. Supported HTML tags are the same as for rules (see [Rules Formatting](#rules-formatting)).

### Adding a New Class

1. Add the class to `data/classes.json`:
   ```json
   {
     "name": { "en": "Open", "de": "Offen" },
     "slug": "open",
     "rules": { "en": "All modifications allowed.", "de": "Alle Modifikationen erlaubt." },
     "defaultSort": "bestLaptime"
   }
   ```

2. Assign it to tracks in `data/tracks.json`
3. Create the corresponding results files

### Rules Formatting

The `rules` field supports a subset of HTML for richer formatting:

```json
"rules": {
  "en": "Stock class rules:<br/><ul><li>Stock motor only</li><li>No body modifications</li></ul>"
}
```

Supported tags: `b`, `i`, `em`, `strong`, `u`, `s`, `p`, `br`, `hr`, `h3`, `h4`, `ul`, `ol`, `li`, `a`, `span`, `code`, `table`, `thead`, `tbody`, `tr`, `th`, `td`

Plain text rules continue to work without any changes.

### Sort Configuration

Default sort order can be set at two levels:

1. **Class level** (`data/classes.json`): `"defaultSort": "bestLaptime"` or `"threeConsecutiveLaps"`
2. **Track level** (`data/tracks.json`): Override per track-class combination

Track-level overrides take priority over class-level defaults.

### Imprint / Impressum

The imprint page is required for sites publicly accessible under German law (DDG §5). Personal data is stored in `data/imprint.json`:

```json
{
  "name": "Vorname Nachname",
  "address": ["c/o Weiterleitungsservice", "Musterstraße 1", "12345 Musterstadt"],
  "email": "kontakt@example.com"
}
```

The page is served at `/de/impressum` (German) and `/en/impressum` (English), linked from the site footer.

## Deployment

The site auto-deploys to GitHub Pages on every push to `main`.

### Setup

1. Push this repository to GitHub
2. Go to **Settings** → **Pages** → set Source to **"GitHub Actions"**
3. Push to `main` — the site deploys automatically

See [deployment documentation](docs/deployment.md) for details.

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework (static export)
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling (with @tailwindcss/typography)
- [Lucide React](https://lucide.dev/) — Icons
- [GitHub Pages](https://pages.github.com/) — Hosting

## Project Structure

```
├── data/                   # JSON data files (edit these!)
│   ├── classes.json
│   ├── tracks.json
│   ├── imprint.json
│   └── results/
├── src/
│   ├── app/                # Next.js routes
│   │   └── [lang]/
│   │       ├── impressum/  # Bilingual imprint/legal notice page
│   │       └── tracks/     # Track leaderboard pages
│   ├── components/         # React components
│   ├── lib/                # Data loading utilities
│   └── types/              # TypeScript definitions
├── public/
├── .github/workflows/      # GitHub Actions deployment
└── next.config.ts
```
