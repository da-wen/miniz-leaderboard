# Component Changes

## Overview

All changes are additive — no existing functionality is modified or removed.

| Component / File | Change Type | Description |
|------------------|-------------|-------------|
| `src/components/Footer.tsx` | **New** | Footer component with copyright + imprint link |
| `src/app/[lang]/layout.tsx` | **Modified** | Add Footer to main content area |
| `src/app/[lang]/impressum/page.tsx` | **New** | Imprint page route |
| `src/lib/data.ts` | **Modified** | Add `getImprintData()` loader |
| `src/lib/i18n/dictionaries/en.json` | **Modified** | Add `footer` and `imprint` sections |
| `src/lib/i18n/dictionaries/de.json` | **Modified** | Add `footer` and `imprint` sections |
| `data/imprint.json` | **New** | Personal data for imprint |

## 1. Language Layout — Add Footer

**File:** `src/app/[lang]/layout.tsx`

### Current Structure

```tsx
<main className="flex-1 lg:ml-64 overflow-auto min-h-screen">
  {children}
</main>
```

### New Structure

```tsx
<main className="flex-1 lg:ml-64 overflow-auto min-h-screen flex flex-col">
  <div className="flex-1">
    {children}
  </div>
  <Footer lang={lang} dict={dict} />
</main>
```

### Changes Required

1. Import `Footer` component
2. Add `flex flex-col` to `<main>` to enable footer push-to-bottom
3. Wrap `{children}` in `<div className="flex-1">` so content takes available space
4. Add `<Footer>` after the children wrapper

**Note:** The `min-h-screen` on `<main>` already ensures the footer sticks to the bottom even on short pages. Adding `flex flex-col` + `flex-1` on the children wrapper makes this work correctly.

## 2. Dictionary Files — Add Translations

### Structure Addition

Both `en.json` and `de.json` get two new top-level keys:

```json
{
  "meta": { ... },
  "nav": { ... },
  "leaderboard": { ... },
  "rules": { ... },
  "notFound": { ... },
  "language": { ... },
  "footer": {
    "imprint": "..."
  },
  "imprint": {
    "title": "...",
    "subtitle": "...",
    "contact": "...",
    "email": "...",
    "phone": "...",
    "disclaimer": "...",
    "liabilityContent": "...",
    "liabilityContentText": "...",
    "liabilityLinks": "...",
    "liabilityLinksText": "..."
  }
}
```

Full translation values are specified in `03-imprint-page.md`.

## 3. Data Loader — Add Imprint Loader

**File:** `src/lib/data.ts`

Add the `ImprintData` interface and `getImprintData()` function. This follows the exact same pattern as `getTracks()` and `getClasses()`:

```typescript
export interface ImprintData {
  name: string;
  address: string[];
  email: string;
}

export function getImprintData(): ImprintData {
  const raw = fs.readFileSync(path.join(dataDir, "imprint.json"), "utf-8");
  return JSON.parse(raw);
}
```

## 4. No Changes Required To

- **Sidebar.tsx** — Footer is separate from sidebar
- **MobileNav.tsx** — Footer is in main content, not the drawer
- **LanguageSwitcher.tsx** — Already works with any `[lang]` route
- **ClassTabs.tsx** — Unrelated
- **LeaderboardTable.tsx** — Unrelated
- **RulesAccordion.tsx** — Unrelated
- **SidebarNav.tsx** — Unrelated
- **types/index.ts** — ImprintData type goes in data.ts (local to loader, not a shared type)
- **next.config.ts** — No config changes needed
- **globals.css** — No style changes needed
