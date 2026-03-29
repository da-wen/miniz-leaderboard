# Security Architecture

## Threat Model

The HTML content in `classes.json` is **self-authored** by the project maintainer — not user-submitted. The primary risk is accidental injection (e.g., a copy-paste error introduces a `<script>` tag or malformed HTML). Sanitization is defense-in-depth.

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| XSS via `<script>` in JSON | Very Low | High | DOMPurify strips scripts |
| Event handler injection (`onclick`) | Very Low | High | DOMPurify strips event attrs |
| Malformed HTML breaking layout | Low | Low | DOMPurify cleans up malformed HTML |
| Unstyled HTML elements | Medium | Low | Typography plugin + whitelist |

## DOMPurify Configuration

### Package

```bash
npm install isomorphic-dompurify
```

Use `isomorphic-dompurify` (not bare `dompurify`) because:
- Next.js pre-renders pages server-side at build time
- Bare `dompurify` requires a browser DOM (`window.document`)
- `isomorphic-dompurify` uses `jsdom` on the server and native DOM on the client

### Sanitization Config

```typescript
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    // Text formatting
    "b", "i", "em", "strong", "u", "s",
    // Structure
    "p", "br", "hr",
    // Headings (for subsections within rules)
    "h3", "h4",
    // Lists
    "ul", "ol", "li",
    // Links
    "a",
    // Inline
    "span", "code",
    // Tables (for spec sheets)
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: [
    "href",     // for <a> links
    "target",   // for <a target="_blank">
    "rel",      // for <a rel="noopener">
    "class",    // for custom styling
  ],
};
```

### Why these tags?

| Tag Category | Tags | Use Case in Rules |
|-------------|------|-------------------|
| Text formatting | `b`, `i`, `em`, `strong`, `u`, `s` | Emphasize key specs, strike through deprecated rules |
| Structure | `p`, `br`, `hr` | Paragraphs, line breaks between specs, section dividers |
| Headings | `h3`, `h4` | Rule subsections (e.g., "Motor", "Chassis", "Tires") |
| Lists | `ul`, `ol`, `li` | Bullet/numbered rule lists |
| Links | `a` | Links to external rule documents or supplier sites |
| Tables | `table`, `thead`, `tbody`, `tr`, `th`, `td` | Spec comparison tables |
| Inline | `span`, `code` | Inline styling, technical values |

### What is stripped (not allowed)?

- `<script>` — JavaScript execution
- `<style>` — CSS injection
- `<iframe>`, `<embed>`, `<object>` — embedded content
- `<form>`, `<input>` — form elements
- `<img>` — images (not needed in rules, avoids broken image issues)
- `<video>`, `<audio>` — media elements
- All event attributes (`onclick`, `onerror`, `onload`, etc.)
- `data-*` attributes
- `style` attribute (use `class` instead for Tailwind)

## Implementation Pattern

The sanitization happens **at render time** inside the component, not in the data loader. This keeps the data layer clean and the sanitization visible at the point of use.

```
classes.json → getLocalizedRules() → RulesAccordion → DOMPurify.sanitize() → dangerouslySetInnerHTML
```

### Why sanitize in the component (not the data loader)?

1. **Separation of concerns** — data loader returns raw data, component handles presentation
2. **Visibility** — sanitization is visible where the HTML is rendered
3. **No data layer changes needed** — `getLocalizedRules()` already returns the correct string
4. **Easier to test** — component rendering tests can verify sanitization

## Known Caveat: jsdom Compatibility

`isomorphic-dompurify` depends on `jsdom` for server-side rendering. jsdom v28+ uses ESM-only dependencies that can conflict with CommonJS in some Node.js setups. If build issues occur:

```json
// package.json — pin jsdom if needed
"overrides": {
  "jsdom": "25.0.1"
}
```

This is unlikely to be needed but worth knowing.
