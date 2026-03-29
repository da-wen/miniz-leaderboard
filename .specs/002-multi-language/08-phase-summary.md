# Phase Summary

## Phase Overview

| Phase | Name | Goal | Files Changed | Depends On |
|-------|------|------|---------------|------------|
| 1 | Foundation | i18n config, dictionaries, data model | 6 new, 2 modified | — |
| 2 | Routing | `[lang]` segment, route restructure | 6 new, 2 modified, 4 moved | Phase 1 |
| 3 | Components | Apply translations, language switcher | 7 modified, 1 new | Phase 2 |
| 4 | Polish | Documentation, testing, cleanup | 3 modified | Phase 3 |

## Phase 1: Foundation

**Creates:**
- `src/lib/i18n/config.ts` — locale config, helpers
- `src/lib/i18n/dictionaries.ts` — dictionary loader
- `src/lib/i18n/dictionaries/en.json` — English translations
- `src/lib/i18n/dictionaries/de.json` — German translations

**Modifies:**
- `src/types/index.ts` — add `LocalizedText`, update `RacingClass.rules`
- `data/classes.json` — multilingual `rules` field
- `src/lib/data.ts` — add `getLocalizedRules()`

**Installs:**
- `server-only` (npm package)

**Risk:** Low. No existing functionality changes.

## Phase 2: Routing

**Creates:**
- `src/app/[lang]/layout.tsx` — main app layout with locale
- `src/app/[lang]/page.tsx` — locale-aware home redirect
- `src/app/[lang]/not-found.tsx` — localized 404
- `src/app/[lang]/tracks/[trackSlug]/layout.tsx` — moved + updated
- `src/app/[lang]/tracks/[trackSlug]/page.tsx` — moved + updated
- `src/app/[lang]/tracks/[trackSlug]/[classSlug]/page.tsx` — moved + updated

**Modifies:**
- `src/app/layout.tsx` — stripped to bare root
- `src/app/page.tsx` — redirect to `/{defaultLocale}/...`

**Deletes:**
- `src/app/tracks/` — old route directory (contents moved to `[lang]/tracks/`)

**Risk:** Medium. This is the largest structural change. Build may break until Phase 3 completes (component prop mismatches).

**Tip for implementer:** You can do Phase 2 + Phase 3 together to avoid intermediate build failures. The phases are separated here for clarity, not because there's a hard boundary.

## Phase 3: Components

**Modifies:**
- `src/components/Sidebar.tsx` — add `lang`, `dict` props, use translations
- `src/components/SidebarNav.tsx` — add `lang` prop, localized hrefs
- `src/components/MobileNav.tsx` — add `lang`, `dict` props, use translations
- `src/components/ClassTabs.tsx` — add `lang` prop, localized hrefs
- `src/components/LeaderboardTable.tsx` — add `translations` prop, replace all hardcoded text
- `src/components/RulesAccordion.tsx` — add `rulesLabel` prop

**Creates:**
- `src/components/LanguageSwitcher.tsx` — new language toggle component

**Risk:** Low-medium. Straightforward prop additions and string replacements.

## Phase 4: Polish

**Modifies:**
- `README.md` — add multi-language docs, update data format examples
- `CLAUDE.md` — add i18n section, update architecture notes
- Potentially `docs/deployment.md` if any deployment changes needed

**Risk:** Low. Documentation only.

## Implementation Checklist

### Phase 1
- [ ] `npm install server-only`
- [ ] Create `src/lib/i18n/config.ts`
- [ ] Create `src/lib/i18n/dictionaries/en.json`
- [ ] Create `src/lib/i18n/dictionaries/de.json`
- [ ] Create `src/lib/i18n/dictionaries.ts`
- [ ] Update `src/types/index.ts` — `LocalizedText` type, `RacingClass.rules`
- [ ] Update `data/classes.json` — multilingual rules
- [ ] Add `getLocalizedRules()` to `src/lib/data.ts`

### Phase 2
- [ ] Create `src/app/[lang]/` directory structure
- [ ] Rewrite `src/app/layout.tsx` (bare root)
- [ ] Create `src/app/[lang]/layout.tsx` (main layout)
- [ ] Rewrite `src/app/page.tsx` (redirect to default locale)
- [ ] Create `src/app/[lang]/page.tsx` (locale home)
- [ ] Move `tracks/[trackSlug]/layout.tsx` → `[lang]/tracks/[trackSlug]/layout.tsx`
- [ ] Move `tracks/[trackSlug]/page.tsx` → `[lang]/tracks/[trackSlug]/page.tsx`
- [ ] Move `tracks/[trackSlug]/[classSlug]/page.tsx` → `[lang]/tracks/[trackSlug]/[classSlug]/page.tsx`
- [ ] Update all `params` types to include `lang`
- [ ] Create `src/app/[lang]/not-found.tsx`
- [ ] Delete old `src/app/tracks/` directory

### Phase 3
- [ ] Create `src/components/LanguageSwitcher.tsx`
- [ ] Update `Sidebar.tsx` — `lang`, `dict` props, `LanguageSwitcher`
- [ ] Update `SidebarNav.tsx` — `lang` prop, localized hrefs
- [ ] Update `MobileNav.tsx` — `lang`, `dict` props
- [ ] Update `ClassTabs.tsx` — `lang` prop, localized hrefs
- [ ] Update `LeaderboardTable.tsx` — `translations` prop, localized date formatting
- [ ] Update `RulesAccordion.tsx` — `rulesLabel` prop
- [ ] Verify: `npm run build` succeeds
- [ ] Verify: `npm run dev` — both languages work end-to-end
- [ ] Verify: language switcher navigates correctly

### Phase 4
- [ ] Update `README.md`
- [ ] Update `CLAUDE.md`
- [ ] `npm run lint` — fix any errors
- [ ] `npm run build` — final clean build
- [ ] Test static output with `npx serve out`

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| i18n library | None (built-in) | 2 languages, simple strings, no ICU/pluralization needed |
| Routing | Path-based `[lang]` segment | Standard pattern, SEO-friendly, works with static export |
| Dictionary format | Flat JSON with nested keys | Simple, type-safe, no tooling needed |
| Dict delivery to client | Props from server components | Enforced by `server-only`, tree-shakeable |
| Language switcher | Globe icon + text links | Minimal, uses existing lucide-react, scalable to more locales |
| Track/class names | Not translated | Proper nouns (brand names, location names) |
| Class rules | Translated in data files | User-editable content, per-locale in JSON |
| Date formatting | Native `toLocaleDateString` | Zero-dependency, locale-aware |
| 404 page | Bilingual fallback | `not-found.tsx` can't easily access `[lang]` params |
| Default locale | Configurable in `config.ts` | Single source of truth, easy to change |

## New Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `server-only` | Prevent server imports in client bundles | 0 bytes runtime (build-time only) |

No other dependencies added.
