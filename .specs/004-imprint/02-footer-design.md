# Footer Design

## Placement Decision

The footer lives inside the `<main>` content area, not in the sidebar. This ensures:

- It appears on every page (sidebar already has the LanguageSwitcher at the bottom)
- It scrolls with content (not fixed)
- It works on both desktop and mobile layouts
- It doesn't interfere with the fixed sidebar or mobile drawer

### Layout Diagram

```
Desktop:                              Mobile:
┌──────────┬─────────────────────┐    ┌─────────────────────────┐
│ Sidebar  │  Main Content       │    │ [Hamburger] Mini-Z      │
│          │                     │    ├─────────────────────────┤
│ Tracks   │  Track Title        │    │  Main Content           │
│  - ...   │  [Class Tabs]       │    │                         │
│          │  Leaderboard Table  │    │  Track Title            │
│          │                     │    │  [Class Tabs]           │
│          │                     │    │  Leaderboard Table      │
│ ──────── │                     │    │                         │
│ EN | DE  │ ────────────────    │    │ ──────────────────────  │
│          │ (c) 2026 · Impressum│    │ (c) 2026 · Impressum   │
└──────────┴─────────────────────┘    └─────────────────────────┘
```

## Footer Component Design

### Visual Design

A slim, single-line footer consistent with the dark theme:

```
─────────────────────────────────────── (border-t border-slate-800)
(c) 2026 Mini-Z Leaderboard  ·  Impressum
```

### Styling Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Background | Inherits from `<main>` (transparent) | Blends with page |
| Top border | `border-t border-slate-800` | Matches sidebar border style |
| Text color | `text-slate-500` | Secondary, non-intrusive |
| Link color | `text-slate-400 hover:text-slate-200` | Visible but subtle, hover feedback |
| Font size | `text-xs` | Legal footer, not primary content |
| Padding | `px-6 py-4 lg:px-8` | Matches main content padding |
| Margin top | `mt-auto` | Pushes footer to bottom of viewport |
| Max width | None (full width of main area) | Consistent with content area |

### Content

**German version:**
```
(c) {year} Mini-Z Leaderboard  ·  Impressum
```

**English version:**
```
(c) {year} Mini-Z Leaderboard  ·  Legal Notice
```

- The `{year}` is the current year, hardcoded at build time (static site)
- The separator is a middle dot (`·`) for clean visual separation
- "Impressum" / "Legal Notice" is a `<Link>` to `/{lang}/impressum`

### Accessibility

- Wrap in semantic `<footer>` element
- Link text is descriptive ("Impressum" / "Legal Notice") — no "click here"
- Sufficient color contrast: `text-slate-400` on `bg-slate-950` = ~5.5:1 ratio (WCAG AA)
- Touch target: link has enough padding via footer `py-4` to meet 44px minimum height
- No `aria-label` needed — the `<footer>` landmark is self-describing

## Component Definition

**File:** `src/components/Footer.tsx`
**Type:** Server component (no `"use client"` — no interactivity)
**Props:**

```typescript
interface FooterProps {
  lang: string;
  dict: Dictionary;
}
```

### Component Structure

```tsx
// src/components/Footer.tsx
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface FooterProps {
  lang: string;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="border-t border-slate-800 px-6 py-4 lg:px-8 mt-auto">
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>&copy; {new Date().getFullYear()} Mini-Z Leaderboard</span>
        <span>&middot;</span>
        <Link
          href={`/${lang}/impressum`}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          {dict.footer.imprint}
        </Link>
      </div>
    </footer>
  );
}
```

### Mobile Considerations

On mobile, the footer sits below the content with the same spacing. The mobile top bar (`h-12` spacer) only affects the top — the footer doesn't need adjustment.

The footer should remain a single centered line on all screen sizes. With `text-xs` and short content, there is no risk of wrapping even on narrow screens.
