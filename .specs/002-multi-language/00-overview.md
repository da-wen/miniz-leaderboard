# Multi-Language Support - Implementation Plan Overview

## Goal

Add multi-language support (English + German) to the Mini-Z Leaderboard. Users can switch languages via a UI toggle. All UI text, table headers, class rules, and navigation labels are translated. The default language is configurable.

## Approach

**Zero-dependency i18n** using Next.js 16's built-in `[lang]` dynamic segment pattern with JSON dictionary files. No external library needed — the site is small (2 languages) and fully static.

### Why no library?

- `next-intl`, `react-i18next` etc. add complexity for features we don't need (pluralization, ICU syntax, many locales)
- Next.js App Router natively supports `[lang]` segments with `generateStaticParams`
- JSON dictionaries + a simple loader give full type safety with zero dependencies
- Static export (`output: "export"`) works perfectly with this pattern

## Plan Structure

| File | Content |
|------|---------|
| `01-routing-architecture.md` | New routing structure with `[lang]` segment, static generation |
| `02-translation-system.md` | Dictionary files, loader, type definitions, data model changes |
| `03-component-changes.md` | Every component that needs modification, with before/after |
| `04-language-switcher.md` | Language switcher UI component design and placement |
| `05-data-model-changes.md` | Changes to JSON data files for multilingual content |
| `06-implementation-tasks.md` | Step-by-step tasks grouped by phase |
| `07-documentation-updates.md` | Changes to README.md, CLAUDE.md, deployment docs |
| `08-phase-summary.md` | Phase overview with dependencies and checklist |

## Languages

| Code | Language | Status |
|------|----------|--------|
| `en` | English | Default (configurable) |
| `de` | German | New |

## Key Constraints

- Remains fully static (`output: "export"`)
- No middleware at runtime (GitHub Pages has no server)
- No new npm dependencies
- All existing URLs get an `/en/` prefix; `/de/` is the new locale
- Root `/` redirects to `/{defaultLocale}/tracks/...`
- Build output doubles (one copy per locale) — negligible for this site size
