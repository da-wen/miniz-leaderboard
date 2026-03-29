# HTML Rendering for Class Rules - Implementation Plan Overview

## Goal

Enable HTML tags inside the `rules` field of `data/classes.json` to render as actual HTML in the rules section on the web page. Currently, HTML tags (like `<br/>`) are displayed as plain text instead of being interpreted by the browser.

## Problem

The German "Stock" class rules already contain `<br/>` tags:

```json
"de": "Motor: 2500kv<br/>Motorritzel: 12<br/>Hauptzahnrad: 53"
```

These render as literal text `Motor: 2500kv<br/>Motorritzel: 12<br/>Hauptzahnrad: 53` instead of line breaks. The `RulesAccordion` component renders rules via `{rules}` (React text interpolation), which escapes HTML.

## Approach

**DOMPurify + `dangerouslySetInnerHTML` + Tailwind Typography Plugin**

1. **Sanitize** HTML with `isomorphic-dompurify` (works server-side during static build and client-side)
2. **Render** sanitized HTML via React's `dangerouslySetInnerHTML`
3. **Style** rendered HTML with `@tailwindcss/typography` plugin (`prose` classes) for consistent, readable formatting on the dark theme

### Why this approach?

| Alternative | Rejected Because |
|------------|-----------------|
| Plain `dangerouslySetInnerHTML` (no sanitization) | Unsafe — a typo in JSON could inject scripts. Defense-in-depth matters. |
| `html-react-parser` | Adds unnecessary complexity and bundle size. We don't need element transformation. |
| Markdown in JSON + markdown parser | Overkill — HTML is simpler for the content authors (direct control). |
| No changes (keep plain text) | German rules already have `<br/>` tags that need to render. |

### Why `isomorphic-dompurify`?

- Standard library for HTML sanitization (used by millions of projects)
- `isomorphic-dompurify` wraps DOMPurify to work on both server (Node.js/jsdom) and client
- Required because Next.js pre-renders pages at build time (server-side), so bare `dompurify` (browser-only) won't work
- Whitelist-based config allows only safe tags (no `<script>`, no `onclick`, etc.)

## Plan Structure

| File | Content |
|------|---------|
| `01-security-architecture.md` | DOMPurify configuration, allowed tags/attributes, threat model |
| `02-component-changes.md` | RulesAccordion modification, before/after code |
| `03-styling-design.md` | Tailwind Typography plugin setup, prose classes, dark theme styling |
| `04-data-model-examples.md` | Example HTML content for rules, supported tags reference |
| `05-implementation-tasks.md` | Step-by-step tasks grouped by phase |
| `06-documentation-updates.md` | Changes to README.md and CLAUDE.md |
| `07-phase-summary.md` | Phase overview with dependencies and checklist |

## Scope

### In Scope

- Install `isomorphic-dompurify` and `@tailwindcss/typography`
- Modify `RulesAccordion` to render HTML safely
- Configure DOMPurify with a strict whitelist
- Add Tailwind Typography plugin for HTML content styling
- Update existing rules in `classes.json` (enrich with HTML if desired)
- Update README.md and CLAUDE.md documentation

### Out of Scope

- Markdown support (not needed — HTML is sufficient)
- Rich text editor for rules (rules are hand-edited in JSON)
- Changes to any other component besides `RulesAccordion`
- Changes to the data loading layer (`src/lib/data.ts`) — it already returns the string correctly

## New Dependencies

| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `isomorphic-dompurify` | HTML sanitization (server + client) | ~50KB (includes jsdom peer dep at build time) |
| `@tailwindcss/typography` | Prose styling for rendered HTML | CSS-only, negligible runtime cost |

## Key Constraints

- Remains fully static (`output: "export"`) — no server runtime
- No changes to the data loading pipeline
- Rules content is authored by the project maintainer (low threat model)
- Sanitization is defense-in-depth, not a primary security boundary
- Must work with existing dark theme (slate palette)
- Must be responsive (mobile + desktop)
