# Routing Architecture

## Current Structure

```
src/app/
├── layout.tsx                              # Root layout (sidebar, mobile nav)
├── page.tsx                                # Redirects to first track
├── globals.css
├── not-found.tsx
└── tracks/
    └── [trackSlug]/
        ├── layout.tsx                      # Track title + class tabs
        ├── page.tsx                        # Redirects to first class
        └── [classSlug]/
            └── page.tsx                    # Leaderboard page
```

**Current URLs:** `/tracks/hobby-carpet/stock`

## New Structure

```
src/app/
├── layout.tsx                              # Minimal root: <html><body>{children}</body></html>
├── page.tsx                                # Redirects to /{defaultLocale}/tracks/...
├── globals.css                             # Unchanged
├── not-found.tsx                           # Unchanged (outside locale scope)
└── [lang]/
    ├── layout.tsx                          # Main layout (sidebar, mobile nav, lang context)
    ├── page.tsx                            # Redirects to /{lang}/tracks/...
    ├── not-found.tsx                       # Localized 404
    └── tracks/
        └── [trackSlug]/
            ├── layout.tsx                  # Track title + class tabs
            ├── page.tsx                    # Redirects to first class
            └── [classSlug]/
                └── page.tsx               # Leaderboard page
```

**New URLs:** `/en/tracks/hobby-carpet/stock`, `/de/tracks/hobby-carpet/stock`

## Static Generation

### Root `[lang]/layout.tsx`

```typescript
import { i18n, type Locale } from "@/lib/i18n/config";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // lang is passed down via params to all nested routes
  // Dictionary is loaded here and provided via context or props
  return children;
}
```

### Nested `generateStaticParams` — No Changes Needed

Next.js automatically combines the `[lang]` params with nested `[trackSlug]` and `[classSlug]` params. The existing `generateStaticParams` in track/class pages **do not need modification** — they already return trackSlug/classSlug combinations and Next.js multiplies them by the locale params.

### Build Output

```
out/
├── en/
│   └── tracks/
│       ├── hobby-carpet/
│       │   ├── stock/index.html
│       │   └── modified/index.html
│       └── rcp-mini-96/
│           └── stock/index.html
├── de/
│   └── tracks/
│       └── ... (same structure)
└── index.html                  # Root redirect to /en/tracks/...
```

## Root Layout Split

The current root `layout.tsx` contains:
1. HTML shell (`<html>`, `<body>`, fonts, metadata)
2. Sidebar with tracks
3. Mobile nav

After the split:

### New `src/app/layout.tsx` (minimal root)

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: "Mini-Z Leaderboard",
    template: "%s | Mini-Z Leaderboard",
  },
  description: "Mini-Z RC car racing lap time leaderboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
```

**Note:** The `<html lang="...">` attribute must be set dynamically. Since the root layout doesn't know the lang yet, we have two options:
- Option A: Set `lang` on the `<html>` in the root layout and update it — but root layout doesn't receive `[lang]` params.
- **Option B (recommended):** Move the `<html>` and `<body>` tags into `[lang]/layout.tsx` and make the root layout return only `{children}`. This is cleaner because each locale page gets the correct `lang` attribute.

### Revised approach — root layout is bare:

```typescript
// src/app/layout.tsx — bare root, no <html>/<body>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

```typescript
// src/app/[lang]/layout.tsx — full HTML shell + app chrome
export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className="...">
        {/* sidebar, mobile nav, main content */}
        {children}
      </body>
    </html>
  );
}
```

This is the **official Next.js pattern** for per-locale HTML attributes.

## Link Updates

All internal `<Link>` components must include the locale prefix. Create a helper:

```typescript
// src/lib/i18n/config.ts
export function localizedHref(lang: string, path: string): string {
  return `/${lang}${path}`;
}
```

Usage in components:

```tsx
// Before
<Link href={`/tracks/${track.slug}/${firstClass}`}>

// After
<Link href={localizedHref(lang, `/tracks/${track.slug}/${firstClass}`)}>
```

Every component that renders `<Link>` must receive `lang` as a prop.

## Redirects

| Current | New |
|---------|-----|
| `/` → `/tracks/{first}/{first}` | `/` → `/{defaultLocale}/tracks/{first}/{first}` |
| `/tracks/{slug}` → `/tracks/{slug}/{firstClass}` | `/{lang}/tracks/{slug}` → `/{lang}/tracks/{slug}/{firstClass}` |

The `redirect()` function in static export generates `<meta http-equiv="refresh">` tags, which work on GitHub Pages.
