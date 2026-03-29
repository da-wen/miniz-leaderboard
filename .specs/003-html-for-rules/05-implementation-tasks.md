# Implementation Tasks

## Phase 1: Dependencies

Install the two new packages.

### Task 1.1: Install `isomorphic-dompurify`

```bash
npm install isomorphic-dompurify
```

**Verify:** `package.json` shows `isomorphic-dompurify` in dependencies.

### Task 1.2: Install `@tailwindcss/typography`

```bash
npm install @tailwindcss/typography
```

**Verify:** `package.json` shows `@tailwindcss/typography` in dependencies (or devDependencies).

### Task 1.3: Configure Typography Plugin

**File:** `src/app/globals.css`

Add the `@plugin` directive after the `@import`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

**Verify:** Run `npm run dev` — no build errors. The `prose` class should now be recognized by Tailwind.

---

## Phase 2: Component Update

Modify the `RulesAccordion` component to render HTML.

### Task 2.1: Update `RulesAccordion.tsx`

**File:** `src/components/RulesAccordion.tsx`

Changes:
1. Add `"use client"` directive at the top
2. Import `DOMPurify` from `isomorphic-dompurify`
3. Define `SANITIZE_CONFIG` with the allowed tags/attributes whitelist
4. Call `DOMPurify.sanitize(rules, SANITIZE_CONFIG)` inside the component
5. Replace `{rules}` with `dangerouslySetInnerHTML={{ __html: sanitizedRules }}`
6. Replace the content `<div>` classes:
   - **Remove:** `text-sm text-slate-400 leading-relaxed`
   - **Add:** `prose prose-sm prose-invert max-w-none prose-headings:text-slate-200 prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-strong:text-slate-200 prose-td:border-slate-800 prose-th:border-slate-800 prose-th:text-slate-300 overflow-x-auto`

See `02-component-changes.md` for the complete before/after code.

**Verify:**
- `npm run dev` — no build errors
- Navigate to a track page, expand rules accordion
- German Stock rules should show line breaks (not literal `<br/>` text)
- English rules should render as normal text (no visible change — backward compatible)

### Task 2.2: Handle Build Errors (If Any)

If `isomorphic-dompurify` causes build issues with Next.js static export:

**Option A:** Try the server-side sanitization alternative (see `02-component-changes.md` "Alternative" section) — sanitize in the page component, pass clean HTML as prop, keep `RulesAccordion` as server component.

**Option B:** If jsdom version conflicts occur, add to `package.json`:
```json
"overrides": {
  "jsdom": "25.0.1"
}
```
Then run `npm install` again.

---

## Phase 3: Verification

### Task 3.1: Visual Testing

1. Run `npm run dev`
2. Check all track/class combinations in both languages:
   - `/de/tracks/hobby-carpet/stock` — German Stock rules (has `<br/>` tags)
   - `/de/tracks/hobby-carpet/modified` — German Modified rules (plain text)
   - `/en/tracks/hobby-carpet/stock` — English Stock rules (plain text)
   - `/en/tracks/hobby-carpet/modified` — English Modified rules (plain text)
   - `/de/tracks/rcp-mini-96/stock` — German Stock on different track
3. Verify:
   - `<br/>` tags render as line breaks
   - Plain text rules still look correct
   - Accordion open/close still works
   - Dark theme colors are consistent
   - Mobile layout is not broken

### Task 3.2: Build Test

```bash
npm run build
npx serve out
```

Verify the static build works correctly with the new dependencies.

### Task 3.3: Lint

```bash
npm run lint
```

Fix any ESLint errors introduced by the changes.

---

## Phase 4: Documentation

### Task 4.1: Update README.md

Update the README to:
1. **Fix the "Adding a New Class" example** — currently shows the old pre-i18n format (`"rules": "plain string"`). Update to show the localized format with HTML example.
2. **Add a "Rules Formatting" section** — document that rules support HTML tags, list supported tags.
3. **Update Tech Stack** — add note about `@tailwindcss/typography` for content styling.

See `06-documentation-updates.md` for the exact content.

### Task 4.2: Update CLAUDE.md

Add a note about HTML rules rendering in the Architecture section:

- Rules in `classes.json` support HTML tags
- HTML is sanitized with DOMPurify before rendering
- Styled with Tailwind Typography plugin (`prose` classes)

See `06-documentation-updates.md` for the exact content.

---

## Task Order Summary

| Order | Task | Phase | Depends On |
|-------|------|-------|------------|
| 1 | Install `isomorphic-dompurify` | 1 | — |
| 2 | Install `@tailwindcss/typography` | 1 | — |
| 3 | Configure Typography plugin in `globals.css` | 1 | Task 2 |
| 4 | Update `RulesAccordion.tsx` | 2 | Tasks 1, 3 |
| 5 | Handle build errors (if any) | 2 | Task 4 |
| 6 | Visual testing | 3 | Task 4 |
| 7 | Build test | 3 | Task 4 |
| 8 | Lint | 3 | Task 4 |
| 9 | Update README.md | 4 | Task 6 |
| 10 | Update CLAUDE.md | 4 | Task 6 |
