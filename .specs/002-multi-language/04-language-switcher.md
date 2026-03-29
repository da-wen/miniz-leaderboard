# Language Switcher Component

## Design

A compact language toggle placed in the sidebar (desktop) and mobile nav drawer. Uses the `Globe` icon from `lucide-react` (already a project dependency).

### Desktop Placement

At the bottom of the sidebar, above no other content — a fixed footer area:

```
┌──────────────────┐
│ 🏁 Mini-Z        │
│    Leaderboard    │
├──────────────────┤
│ TRACKS            │
│  ● Hobby Carpet   │
│    RCP Mini 96    │
│                   │
│                   │
│                   │
├──────────────────┤
│ 🌐 EN | DE       │  ← Language switcher
└──────────────────┘
```

### Mobile Placement

In the mobile drawer, below the track list — same position as desktop sidebar.

### Visual Design

```
┌─────────────────────────┐
│  🌐  EN  |  DE          │
└─────────────────────────┘
```

- `Globe` icon (16px) from lucide-react
- Active language: `text-white font-medium`
- Inactive language: `text-slate-400 hover:text-slate-200`
- Separator: `text-slate-600` pipe character
- Container: `px-6 py-4 border-t border-slate-800`
- Each language is a `<Link>` pointing to the same page path but with the other locale prefix

## Component Implementation

### `src/components/LanguageSwitcher.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { i18n, type Locale } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  currentLang: string;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Replace the current locale prefix with the target locale
  function getLocalizedPath(targetLang: string): string {
    // pathname is like "/en/tracks/hobby-carpet/stock"
    // Replace "/en/" with "/de/"
    const segments = pathname.split("/");
    segments[1] = targetLang;  // Replace locale segment
    return segments.join("/");
  }

  return (
    <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-800">
      <Globe className="h-4 w-4 text-slate-400" />
      <div className="flex items-center gap-2 text-sm">
        {i18n.locales.map((locale, index) => (
          <span key={locale} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-600">|</span>}
            <Link
              href={getLocalizedPath(locale)}
              className={
                locale === currentLang
                  ? "text-white font-medium"
                  : "text-slate-400 hover:text-slate-200 transition-colors"
              }
            >
              {locale.toUpperCase()}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
```

### Why client component?

The switcher needs `usePathname()` to construct the target URL for the other language — it must know the current path to swap the locale prefix while keeping the rest of the route intact.

### Integration into Sidebar

```typescript
// In Sidebar.tsx
export function Sidebar({ tracks, lang, dict }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800">...</div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          {dict.nav.tracks}
        </p>
        <SidebarNav tracks={tracks} lang={lang} />
      </nav>

      {/* Language switcher — pinned to bottom */}
      <LanguageSwitcher currentLang={lang} />
    </div>
  );
}
```

## Behavior

1. Clicking a language link navigates to the same page in the target language
2. The current language is visually highlighted (white, bold)
3. Navigation is instant — all pages are statically generated
4. The URL updates to reflect the new locale (`/en/...` ↔ `/de/...`)
5. Scrolls to top of page on language switch (default Next.js behavior)

## Accessibility

- Links have meaningful text (`EN`, `DE`)
- The `Globe` icon is decorative (no aria-label needed on the icon itself)
- Consider adding `aria-label="Switch language"` to the container div
- Active language link could include `aria-current="true"`

## Extensibility

Adding a third language (e.g., Japanese) only requires:
1. Add `"ja"` to `i18n.locales` in config
2. Create `dictionaries/ja.json`
3. Add the import to `dictionaries.ts`

The switcher automatically renders all locales from the config — no component changes needed.
