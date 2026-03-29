# Phase Summary

## Phase Overview

| Phase | Name | Goal | Files Changed | Depends On |
|-------|------|------|---------------|------------|
| 1 | Dependencies | Install packages, configure Typography plugin | 2 modified (`package.json`, `globals.css`) | — |
| 2 | Component | Update RulesAccordion to render HTML safely | 1 modified (`RulesAccordion.tsx`) | Phase 1 |
| 3 | Verification | Test all pages, build, lint | 0 files | Phase 2 |
| 4 | Documentation | Update README.md and CLAUDE.md | 2 modified | Phase 3 |

## Phase 1: Dependencies

**Installs:**
- `isomorphic-dompurify` — HTML sanitization (server + client compatible)
- `@tailwindcss/typography` — Prose styling for rendered HTML content

**Modifies:**
- `package.json` — new dependencies added via npm install
- `src/app/globals.css` — add `@plugin "@tailwindcss/typography"` directive

**Risk:** Low. Adding dependencies and a CSS plugin directive. No functional changes yet.

**Potential issue:** `isomorphic-dompurify` depends on `jsdom` which may have ESM compatibility issues. If so, pin jsdom to v25.0.1 via `overrides` in `package.json`.

## Phase 2: Component

**Modifies:**
- `src/components/RulesAccordion.tsx` — the core change:
  - Add `"use client"` directive
  - Import and configure DOMPurify
  - Replace `{rules}` text rendering with `dangerouslySetInnerHTML`
  - Replace manual text classes with `prose` classes

**Risk:** Low. Single component change with clear before/after. Backward compatible — plain text rules render identically.

**Fallback:** If client-side DOMPurify import fails, sanitize server-side in the page component and pass clean HTML as prop.

## Phase 3: Verification

**Tasks:**
- Visual test all track/class/language combinations
- Verify `<br/>` tags render as line breaks in German Stock rules
- Verify plain text rules still look correct
- Run `npm run build` — static export succeeds
- Run `npm run lint` — no new errors
- Test with `npx serve out` — static site works

**Risk:** None. Testing only.

## Phase 4: Documentation

**Modifies:**
- `README.md`:
  - Fix "Adding a New Class" example (currently shows pre-i18n format)
  - Add "Rules Formatting" section with supported HTML tags
  - Update Tech Stack entry for Tailwind CSS
- `CLAUDE.md`:
  - Add HTML rules note to Architecture section
  - Update Data Schema description
  - Add Typography plugin to Key Config

**Risk:** None. Documentation only.

## Implementation Checklist

### Phase 1: Dependencies
- [ ] `npm install isomorphic-dompurify`
- [ ] `npm install @tailwindcss/typography`
- [ ] Add `@plugin "@tailwindcss/typography"` to `globals.css`
- [ ] Verify: `npm run dev` — no build errors

### Phase 2: Component
- [ ] Add `"use client"` to `RulesAccordion.tsx`
- [ ] Import `DOMPurify` from `isomorphic-dompurify`
- [ ] Define `SANITIZE_CONFIG` with allowed tags whitelist
- [ ] Call `DOMPurify.sanitize()` on rules string
- [ ] Replace `{rules}` with `dangerouslySetInnerHTML={{ __html: sanitizedRules }}`
- [ ] Replace content div classes with `prose prose-sm prose-invert ...`
- [ ] Verify: `npm run dev` — rules render HTML correctly

### Phase 3: Verification
- [ ] Test: German Stock rules show line breaks (not literal `<br/>`)
- [ ] Test: English rules render as plain text (no change)
- [ ] Test: All track/class/language combinations work
- [ ] Test: Accordion open/close still works
- [ ] Test: Mobile layout is not broken
- [ ] `npm run build` — succeeds
- [ ] `npm run lint` — no errors
- [ ] `npx serve out` — static site works

### Phase 4: Documentation
- [ ] Update README.md — fix class example, add rules formatting section
- [ ] Update CLAUDE.md — add HTML rules architecture note
- [ ] Final `npm run build` — clean build

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Sanitization library | `isomorphic-dompurify` | Industry standard, works server + client, whitelist-based |
| Rendering method | `dangerouslySetInnerHTML` | Simplest approach for trusted HTML strings |
| Styling | `@tailwindcss/typography` (`prose`) | Automatic styling for all HTML elements, dark theme support |
| Alternative rejected | `html-react-parser` | Unnecessary complexity — no element transformation needed |
| Alternative rejected | Markdown in JSON | HTML is simpler for content authors, more precise control |
| Sanitize location | In component (not data loader) | Separation of concerns, visible at render point |
| Data model changes | None | `string` type already accepts HTML, no migration needed |

## New Dependencies

| Package | Purpose | Runtime Impact |
|---------|---------|---------------|
| `isomorphic-dompurify` | HTML sanitization | ~50KB (client bundle) |
| `@tailwindcss/typography` | Prose CSS classes | CSS only, no JS runtime |

## Files Changed (Total)

| File | Change Type | Phase |
|------|------------|-------|
| `package.json` | Modified (new deps) | 1 |
| `src/app/globals.css` | Modified (add plugin) | 1 |
| `src/components/RulesAccordion.tsx` | Modified (HTML rendering) | 2 |
| `README.md` | Modified (docs update) | 4 |
| `CLAUDE.md` | Modified (docs update) | 4 |

**Total: 5 files modified, 0 new files, 0 deleted files.**
