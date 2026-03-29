# Documentation Updates

## README.md Changes

### 1. Fix "Adding a New Class" Section (Line ~97-108)

The current example shows the old pre-i18n format. Replace with:

**Current (incorrect):**
```json
{
  "name": "Open",
  "slug": "open",
  "rules": "All modifications allowed. No restrictions.",
  "defaultSort": "bestLaptime"
}
```

**Updated:**
```json
{
  "name": "Open",
  "slug": "open",
  "rules": {
    "en": "All modifications allowed. No restrictions.",
    "de": "Alle Modifikationen erlaubt. Keine Einschränkungen."
  },
  "defaultSort": "bestLaptime"
}
```

### 2. Add "Rules Formatting" Section

Add a new section after "Sort Configuration" (around line 117):

```markdown
### Rules Formatting

Rules in `data/classes.json` support HTML tags for rich formatting. Supported tags:

- **Text:** `<strong>`, `<em>`, `<b>`, `<i>`, `<u>`, `<s>`, `<code>`
- **Structure:** `<p>`, `<br>`, `<hr>`
- **Headings:** `<h3>`, `<h4>`
- **Lists:** `<ul>`, `<ol>`, `<li>`
- **Links:** `<a href="..." target="_blank" rel="noopener">`
- **Tables:** `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`

Example:

```json
{
  "rules": {
    "en": "<ul><li><strong>Motor:</strong> Stock only</li><li><strong>Tires:</strong> From approved list</li></ul>",
    "de": "<ul><li><strong>Motor:</strong> 2500kv</li><li><strong>Motorritzel:</strong> 12</li></ul>"
  }
}
```

Plain text (without HTML) continues to work as before. HTML is sanitized before rendering for safety.
```

### 3. Update Tech Stack Section

Add Typography plugin to the list:

**Current:**
```markdown
- [Tailwind CSS](https://tailwindcss.com/) — Styling
```

**Updated:**
```markdown
- [Tailwind CSS](https://tailwindcss.com/) — Styling (with Typography plugin for rich content)
```

## CLAUDE.md Changes

### 1. Update Architecture Section

Add after the "Sort priority" line:

```markdown
**HTML Rules:** Rules in `classes.json` support HTML tags. HTML is sanitized with `isomorphic-dompurify` (whitelist-based) in `RulesAccordion` before rendering via `dangerouslySetInnerHTML`. Styled with `@tailwindcss/typography` (`prose prose-invert` classes).
```

### 2. Update Data Schema Section

Update the `classes.json` description:

**Current:**
```markdown
- `data/classes.json` — racing class definitions (name, slug, rules, defaultSort)
```

**Updated:**
```markdown
- `data/classes.json` — racing class definitions (name, slug, rules with HTML support, defaultSort)
```

### 3. Update Key Config Section

Add:

```markdown
- `globals.css`: `@plugin "@tailwindcss/typography"` for prose styling of HTML rules content
```
