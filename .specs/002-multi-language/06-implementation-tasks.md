# Implementation Tasks

Tasks are grouped into 4 phases. Each phase builds on the previous one. Complete all tasks in a phase before moving to the next.

---

## Phase 1: Foundation — i18n Config & Translation System

**Goal:** Set up the translation infrastructure without changing any existing routes or components.

### Task 1.1: Install `server-only` package

```bash
npm install server-only
```

This is a Next.js utility that prevents server-only modules from being imported in client components.

### Task 1.2: Create i18n config

Create `src/lib/i18n/config.ts`:
- Export `i18n` object with `defaultLocale: "en"` and `locales: ["en", "de"]`
- Export `Locale` type
- Export `isValidLocale()` guard function
- Export `localizedHref()` helper

See `02-translation-system.md` for exact code.

### Task 1.3: Create dictionary files

Create:
- `src/lib/i18n/dictionaries/en.json` — all English UI strings
- `src/lib/i18n/dictionaries/de.json` — all German translations

See `02-translation-system.md` for full content of both files.

### Task 1.4: Create dictionary loader

Create `src/lib/i18n/dictionaries.ts`:
- Import `server-only`
- Dynamic imports for each locale JSON
- Export `getDictionary()` function
- Export `Dictionary` type

### Task 1.5: Update data model for multilingual rules

1. Update `src/types/index.ts`:
   - Add `LocalizedText` type
   - Change `RacingClass.rules` from `string` to `LocalizedText`

2. Update `data/classes.json`:
   - Change `rules` field from string to `{ "en": "...", "de": "..." }` object
   - Add German translations for all class rules

3. Add `getLocalizedRules()` to `src/lib/data.ts`

See `05-data-model-changes.md` for exact data and code.

### Phase 1 Verification

- `npm run build` should still succeed (existing components may show type errors for `rules` — that's expected and fixed in Phase 2)
- Dictionary files load correctly
- No runtime changes yet

---

## Phase 2: Routing — Add `[lang]` Segment

**Goal:** Restructure the routing to include the `[lang]` segment. All pages render with locale-aware URLs.

### Task 2.1: Create `[lang]` directory structure

```bash
mkdir -p src/app/[lang]/tracks/[trackSlug]/[classSlug]
```

### Task 2.2: Split root layout

1. **Rewrite `src/app/layout.tsx`** to be a bare root layout (no `<html>`, no `<body>`, just `{children}` + metadata + CSS import)

2. **Create `src/app/[lang]/layout.tsx`** with:
   - `generateStaticParams` returning all locales
   - `<html lang={lang}>` and `<body>` tags
   - Font loading (moved from root)
   - Sidebar and MobileNav (with `lang` and `dict` props — components will error until Phase 3)
   - `getDictionary(lang)` call

See `01-routing-architecture.md` and `03-component-changes.md` for exact code.

### Task 2.3: Move page files

Move/recreate these files under `[lang]/`:

| From | To |
|------|----|
| `src/app/page.tsx` | `src/app/page.tsx` (rewrite: redirect to `/{defaultLocale}/...`) |
| — | `src/app/[lang]/page.tsx` (new: redirect to `/{lang}/tracks/...`) |
| `src/app/tracks/[trackSlug]/layout.tsx` | `src/app/[lang]/tracks/[trackSlug]/layout.tsx` |
| `src/app/tracks/[trackSlug]/page.tsx` | `src/app/[lang]/tracks/[trackSlug]/page.tsx` |
| `src/app/tracks/[trackSlug]/[classSlug]/page.tsx` | `src/app/[lang]/tracks/[trackSlug]/[classSlug]/page.tsx` |
| `src/app/not-found.tsx` | `src/app/[lang]/not-found.tsx` (localized) |

### Task 2.4: Update all page params

Every page and layout under `[lang]/` now receives `lang` in its params. Update:

1. **`[lang]/tracks/[trackSlug]/layout.tsx`:**
   - `params` type: `{ lang: string; trackSlug: string }`
   - Pass `lang` to `ClassTabs`

2. **`[lang]/tracks/[trackSlug]/page.tsx`:**
   - `params` type: `{ lang: string; trackSlug: string }`
   - Redirect includes `/${lang}/` prefix

3. **`[lang]/tracks/[trackSlug]/[classSlug]/page.tsx`:**
   - `params` type: `{ lang: string; trackSlug: string; classSlug: string }`
   - Load dictionary, pass translations to LeaderboardTable
   - Use `getLocalizedRules(classSlug, lang)` for rules text
   - Pass `rulesLabel` from dict to RulesAccordion

### Task 2.5: Delete old route files

After verifying the new routes work, delete the old files:
- `src/app/tracks/` directory (now empty — everything moved to `[lang]/tracks/`)

### Phase 2 Verification

- `npm run build` may still error (component props not updated yet)
- Route structure is correct: `/en/tracks/...` and `/de/tracks/...`
- Root `/` redirects to `/en/tracks/...`

---

## Phase 3: Components — Apply Translations

**Goal:** Update all components to accept and use translated strings. The site is fully functional in both languages.

### Task 3.1: Update `Sidebar.tsx`

- Add `lang` and `dict` props
- Replace `"Tracks"` with `dict.nav.tracks`
- Pass `lang` to `SidebarNav`
- Add `LanguageSwitcher` at the bottom

### Task 3.2: Update `SidebarNav.tsx`

- Add `lang` prop
- Prefix all `href` values with `/${lang}`
- Update `pathname.startsWith()` checks to include `/${lang}`

### Task 3.3: Update `MobileNav.tsx`

- Add `lang` and `dict` props
- Replace `"Navigation"` with `dict.nav.navigation`
- Pass `lang` and `dict` to `Sidebar`

### Task 3.4: Update `ClassTabs.tsx`

- Add `lang` prop
- Prefix all `href` values with `/${lang}`
- Update `pathname` comparison to include `/${lang}`

### Task 3.5: Update `LeaderboardTable.tsx`

- Add `translations` prop (type: `Dictionary["leaderboard"]`)
- Replace all hardcoded column headers with `translations.*`
- Replace empty state message with `translations.noEntries`
- Add `lang` prop for date formatting locale

### Task 3.6: Update `RulesAccordion.tsx`

- Add `rulesLabel` prop
- Replace `` `${className} Rules` `` with template replacement on `rulesLabel`

### Task 3.7: Create `LanguageSwitcher.tsx`

- New client component at `src/components/LanguageSwitcher.tsx`
- Uses `usePathname()` to construct locale-swapped URLs
- Renders `Globe` icon + locale links
- Active locale highlighted

See `04-language-switcher.md` for full component code.

### Phase 3 Verification

- `npm run build` succeeds
- `npm run dev` — navigate to `/en/tracks/hobby-carpet/stock`:
  - All table headers in English
  - Rules in English
  - Language switcher shows "EN | DE"
  - Click "DE" → navigates to `/de/tracks/hobby-carpet/stock`
  - All text switches to German
  - Rules in German
  - Date formatting uses German locale
- `npm run lint` passes

---

## Phase 4: Polish & Documentation

**Goal:** Final cleanup, documentation updates, and verification.

### Task 4.1: Update `next.config.ts`

No changes needed — `output: "export"` and `images.unoptimized: true` remain correct. The `[lang]` segment is handled by Next.js automatically.

### Task 4.2: Verify static build

```bash
npm run build
npx serve out
```

Verify:
- `out/en/tracks/hobby-carpet/stock/index.html` exists
- `out/de/tracks/hobby-carpet/stock/index.html` exists
- `out/index.html` contains redirect to `/en/...`
- All pages render correctly
- Language switching works via file links

### Task 4.3: Update `CLAUDE.md`

Add i18n section covering:
- Translation file locations
- How to add a new language
- Dictionary flow (server → client via props)
- `localizedHref` helper usage

### Task 4.4: Update `README.md`

Add sections:
- Multi-language support feature in feature list
- How to add translations (new language, new strings)
- How to change the default language
- Update "Managing Data" section for new `rules` format

### Task 4.5: Run final checks

```bash
npm run lint
npm run build
```

Fix any lint errors or build warnings.
