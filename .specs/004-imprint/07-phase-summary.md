# Phase Summary

## Phase Overview

| Phase | Name | Goal | Files Changed | Depends On |
|-------|------|------|---------------|------------|
| 1 | Data & Translations | Imprint data file, data loader, dictionary entries | 1 new, 3 modified | — |
| 2 | Footer | Site-wide footer component with imprint link | 1 new, 1 modified | Phase 1 |
| 3 | Imprint Page | Bilingual imprint page route | 1 new | Phase 1 + 2 |
| 4 | Documentation | README.md and CLAUDE.md updates | 2 modified | Phase 3 |

## Phase 1: Data & Translations

**Creates:**
- `data/imprint.json` — personal data with placeholder values

**Modifies:**
- `src/lib/data.ts` — add `ImprintData` interface and `getImprintData()` function
- `src/lib/i18n/dictionaries/de.json` — add `footer` and `imprint` sections
- `src/lib/i18n/dictionaries/en.json` — add `footer` and `imprint` sections

**Risk:** Low. No existing functionality changes. Build should succeed after this phase.

## Phase 2: Footer

**Creates:**
- `src/components/Footer.tsx` — server component with copyright + imprint link

**Modifies:**
- `src/app/[lang]/layout.tsx` — add Footer component, adjust `<main>` flex layout

**Risk:** Low. Additive change to layout. The imprint link will 404 until Phase 3 completes.

**Tip for implementer:** Phase 2 and 3 can be done together to avoid the intermediate 404.

## Phase 3: Imprint Page

**Creates:**
- `src/app/[lang]/impressum/page.tsx` — static imprint page with `generateStaticParams()`

**Risk:** Low. New route, no changes to existing routes.

## Phase 4: Documentation

**Modifies:**
- `README.md` — add imprint feature, data file docs, update structure
- `CLAUDE.md` — add imprint to data schema, architecture, routing

**Risk:** None. Documentation only.

## Implementation Checklist

### Phase 1
- [ ] Create `data/imprint.json` with placeholder values
- [ ] Add `ImprintData` interface and `getImprintData()` to `src/lib/data.ts`
- [ ] Add `footer` and `imprint` sections to `src/lib/i18n/dictionaries/de.json`
- [ ] Add `footer` and `imprint` sections to `src/lib/i18n/dictionaries/en.json`
- [ ] Verify: `npm run build` succeeds

### Phase 2
- [ ] Create `src/components/Footer.tsx`
- [ ] Modify `src/app/[lang]/layout.tsx` — import Footer, adjust main layout
- [ ] Verify: `npm run dev` — footer appears on all pages

### Phase 3
- [ ] Create `src/app/[lang]/impressum/page.tsx`
- [ ] Verify: `npm run dev` — both `/de/impressum` and `/en/impressum` render
- [ ] Verify: language switcher works on imprint page
- [ ] Verify: footer link navigates to imprint page
- [ ] Verify: `npm run build` succeeds

### Phase 4
- [ ] Update `README.md` — features, imprint section, file structure
- [ ] Update `CLAUDE.md` — data schema, architecture, routing
- [ ] Verify: `npm run lint` passes
- [ ] Verify: `npm run build` succeeds
- [ ] Verify: `npx serve out` — test static build

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Footer placement | Inside `<main>`, not sidebar | Appears on all pages, doesn't interfere with fixed sidebar |
| Footer type | Server component | No interactivity needed |
| Imprint data storage | `data/imprint.json` | Separates personal data from translations, consistent with data-driven approach |
| Address format | `string[]` (array of lines) | Flexible: supports direct address (2 lines) or c/o address (3 lines) |
| No phone field | Omitted from data model | Email suffices per ECJ C-298/17; minimizes personal data exposure |
| No disclaimer | Omitted | Optional for hobby sites, keeps page minimal. Can be added later if desired. |
| No "Verantwortlich" | Omitted | Section 18 MStV only applies to journalistic/editorial content |
| Route name | `/impressum` | Standard German term, legally expected |
| Link label | "Impressum" (DE) / "Legal Notice" (EN) | Legally required labeling |
| Imprint content | Dictionary-based translations | Follows existing i18n pattern, each language has own URL |
| Law reference in text | None | Avoids needing updates when laws change (TMG -> DDG happened in 2024) |

## New Dependencies

None. This feature uses only existing dependencies and patterns.

## Files Summary

| File | Action | Phase |
|------|--------|-------|
| `data/imprint.json` | Create | 1 |
| `src/lib/data.ts` | Modify | 1 |
| `src/lib/i18n/dictionaries/de.json` | Modify | 1 |
| `src/lib/i18n/dictionaries/en.json` | Modify | 1 |
| `src/components/Footer.tsx` | Create | 2 |
| `src/app/[lang]/layout.tsx` | Modify | 2 |
| `src/app/[lang]/impressum/page.tsx` | Create | 3 |
| `README.md` | Modify | 4 |
| `CLAUDE.md` | Modify | 4 |
