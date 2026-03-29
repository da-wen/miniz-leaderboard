# Component Changes

Every component that displays user-visible text needs modification. This document lists each component with the specific changes needed.

## Server Components

### `src/app/layout.tsx` (Root Layout)

**Change:** Strip down to bare minimum. Move `<html>`, `<body>`, fonts, sidebar, and mobile nav into `[lang]/layout.tsx`.

```typescript
// NEW: Bare root layout
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mini-Z Leaderboard",
    template: "%s | Mini-Z Leaderboard",
  },
  description: "Mini-Z RC car racing lap time leaderboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### `src/app/[lang]/layout.tsx` (New — Locale Layout)

**Change:** New file. Contains everything the old root layout had, plus dictionary loading and locale-aware `<html lang>`.

```typescript
import { Geist, Geist_Mono } from "next/font/google";
import { i18n, isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTracks } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { notFound } from "next/navigation";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
  if (!isValidLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const tracks = getTracks();

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-950 text-slate-50`}>
        <div className="flex min-h-screen">
          <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 border-r border-slate-800 bg-slate-900 fixed top-0 left-0 bottom-0">
            <Sidebar tracks={tracks} lang={lang} dict={dict} />
          </aside>
          <MobileNav tracks={tracks} lang={lang} dict={dict} />
          <main className="flex-1 lg:ml-64 overflow-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

### `src/app/page.tsx` (Root Home)

**Change:** Redirect to `/{defaultLocale}/tracks/...` instead of `/tracks/...`.

```typescript
import { redirect } from "next/navigation";
import { getTracks } from "@/lib/data";
import { i18n } from "@/lib/i18n/config";

export default function HomePage() {
  const tracks = getTracks();
  const firstTrack = tracks[0];
  const firstClass = firstTrack.classes[0].classSlug;
  redirect(`/${i18n.defaultLocale}/tracks/${firstTrack.slug}/${firstClass}`);
}
```

### `src/app/[lang]/page.tsx` (New — Locale Home)

**Change:** New file. Redirects to first track within the current locale.

```typescript
import { redirect } from "next/navigation";
import { getTracks } from "@/lib/data";

export default async function LangHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const tracks = getTracks();
  const firstTrack = tracks[0];
  const firstClass = firstTrack.classes[0].classSlug;
  redirect(`/${lang}/tracks/${firstTrack.slug}/${firstClass}`);
}
```

### `src/app/[lang]/tracks/[trackSlug]/layout.tsx`

**Change:** Add `lang` param handling, load dictionary, pass translated strings to ClassTabs.

```typescript
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

### `src/app/[lang]/tracks/[trackSlug]/[classSlug]/page.tsx`

**Change:** Load dictionary, pass translated strings to LeaderboardTable and RulesAccordion.

```typescript
export default async function ClassPage({
  params,
}: {
  params: Promise<{ lang: string; trackSlug: string; classSlug: string }>;
}) {
  const { lang, trackSlug, classSlug } = await params;
  const racingClass = getClassBySlug(classSlug);
  if (!racingClass) notFound();

  const dict = await getDictionary(lang as Locale);
  const results = getResults(trackSlug, classSlug);
  const defaultSort = getDefaultSort(trackSlug, classSlug);

  // Get localized rules from data if available, fallback to default
  const rules = getLocalizedRules(classSlug, lang);

  return (
    <>
      <RulesAccordion
        rules={rules}
        className={racingClass.name}
        rulesLabel={dict.rules.label}
      />
      <LeaderboardTable
        entries={results}
        defaultSort={defaultSort}
        translations={dict.leaderboard}
      />
    </>
  );
}
```

### `src/app/[lang]/not-found.tsx` (New)

**Change:** New file. Localized 404 page. Since `notFound()` doesn't pass params easily, this component can use a hardcoded approach or read from URL.

```typescript
import Link from "next/link";

// Note: not-found.tsx cannot easily access [lang] params.
// Simple approach: show bilingual or default to English.
// Alternative: use a client component that reads window.location.
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h1 className="text-4xl font-bold text-slate-50">404</h1>
      <p className="text-slate-400">Page not found. / Seite nicht gefunden.</p>
      <Link
        href="/"
        className="text-sm text-red-400 hover:text-red-300 underline underline-offset-4"
      >
        Back to home / Zurück zur Startseite
      </Link>
    </div>
  );
}
```

## Client Components

Client components **cannot** call `getDictionary()` (it uses `server-only`). They receive translation strings as props from their parent server components.

### `Sidebar.tsx`

**Props change:**

```typescript
interface SidebarProps {
  tracks: Track[];
  lang: string;                    // NEW
  dict: Dictionary;                // NEW
}
```

**Text changes:**
- `"Tracks"` label → `dict.nav.tracks`
- `"Mini-Z"` / `"Leaderboard"` → `dict.meta.title` (split or keep as-is — these are brand names)
- Pass `lang` to `SidebarNav`
- Add `LanguageSwitcher` component at the bottom of the sidebar

### `SidebarNav.tsx`

**Props change:**

```typescript
interface SidebarNavProps {
  tracks: Track[];
  lang: string;                    // NEW
}
```

**Changes:**
- All `href` values get locale prefix: `` `/tracks/${track.slug}/${firstClass}` `` → `` `/${lang}/tracks/${track.slug}/${firstClass}` ``
- `pathname.startsWith(...)` detection must account for the `/${lang}` prefix: `` pathname.startsWith(`/${lang}/tracks/${track.slug}`) ``

### `MobileNav.tsx`

**Props change:**

```typescript
interface MobileNavProps {
  tracks: Track[];
  lang: string;                    // NEW
  dict: Dictionary;                // NEW
}
```

**Text changes:**
- `"Mini-Z Leaderboard"` → `dict.meta.title` (or keep as brand name)
- `"Navigation"` → `dict.nav.navigation`
- Pass `lang` and `dict` to `Sidebar`

### `ClassTabs.tsx`

**Props change:**

```typescript
interface ClassTabsProps {
  trackSlug: string;
  classes: RacingClass[];
  lang: string;                    // NEW
}
```

**Changes:**
- All `href` values get locale prefix: `` `/${lang}/tracks/${trackSlug}/${cls.slug}` ``
- `pathname` comparison must include `/${lang}` prefix

### `LeaderboardTable.tsx`

**Props change:**

```typescript
interface LeaderboardTableProps {
  entries: LapTimeEntry[];
  defaultSort: SortField;
  translations: {                  // NEW
    rank: string;
    driver: string;
    carModel: string;
    bestLaptime: string;
    threeConsecutiveLaps: string;
    updated: string;
    noEntries: string;
  };
}
```

**Text changes (all hardcoded strings):**
- `"#"` → `translations.rank`
- `"Driver"` → `translations.driver`
- `"Car Model"` → `translations.carModel`
- `"Best Laptime"` → `translations.bestLaptime`
- `"3 Consecutive Laps"` → `translations.threeConsecutiveLaps`
- `"Updated"` → `translations.updated`
- `"No lap times recorded yet."` → `translations.noEntries`

**Date formatting change:**
- `date.toLocaleDateString("en-US", ...)` → use the locale: `date.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", ...)`
- Pass `lang` as prop or include locale in translations object

### `RulesAccordion.tsx`

**Props change:**

```typescript
interface RulesAccordionProps {
  rules: string;
  className: string;
  rulesLabel: string;              // NEW — e.g., "{className} Rules"
}
```

**Text changes:**
- `` `${className} Rules` `` → use the `rulesLabel` prop with `{className}` replacement

### `LapTime.tsx`

**No changes needed.** This component only formats numbers — no translatable text.

## Summary of Prop Additions

| Component | New Props |
|-----------|-----------|
| `Sidebar` | `lang`, `dict` |
| `SidebarNav` | `lang` |
| `MobileNav` | `lang`, `dict` |
| `ClassTabs` | `lang` |
| `LeaderboardTable` | `translations` (or `lang` for date formatting) |
| `RulesAccordion` | `rulesLabel` |
| `LapTime` | None |
