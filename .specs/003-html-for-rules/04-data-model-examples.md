# Data Model & HTML Examples

## Data Schema (No Changes)

The data model does **not** change. The `rules` field in `classes.json` is already typed as `LocalizedText` (`Partial<Record<Locale, string>>`), which accepts any string — including HTML.

**Type definition** (unchanged):
```typescript
// src/types/index.ts
export type LocalizedText = Partial<Record<Locale, string>>;

export interface RacingClass {
  name: string;
  slug: string;
  rules: LocalizedText;       // HTML strings are valid here
  defaultSort: SortField;
}
```

**Data loader** (unchanged):
```typescript
// src/lib/data.ts
export function getLocalizedRules(classSlug: string, lang: string): string {
  // Returns the raw string from JSON — HTML included
}
```

## Current Data

**File:** `data/classes.json`

```json
[
  {
    "name": "Stock",
    "slug": "stock",
    "rules": {
      "en": "Stock motors only. No modifications to the chassis allowed. Pinion gear must be stock. Tires must be from the approved list.",
      "de": "Motor: 2500kv<br/>Motorritzel: 12<br/>Hauptzahnrad: 53"
    },
    "defaultSort": "bestLaptime"
  },
  {
    "name": "Modified",
    "slug": "modified",
    "rules": {
      "en": "Any motor allowed. Chassis modifications permitted. Custom pinion gears allowed. Open tire choice.",
      "de": "Jeder Motor erlaubt. Chassis-Modifikationen gestattet. Eigene Ritzel erlaubt. Freie Reifenwahl."
    },
    "defaultSort": "threeConsecutiveLaps"
  }
]
```

The German Stock rules already use `<br/>` tags. After implementation, these will render as actual line breaks.

## Updated Data (Optional Enhancement)

The implementer may optionally enrich the rules with more HTML. This is **not required** — the existing data will work as-is. These are examples of what becomes possible:

### Example: Stock Class (Enhanced German)

```json
{
  "de": "<ul><li><strong>Motor:</strong> 2500kv</li><li><strong>Motorritzel:</strong> 12</li><li><strong>Hauptzahnrad:</strong> 53</li></ul>"
}
```

### Example: Stock Class (Enhanced English)

```json
{
  "en": "<ul><li>Stock motors only</li><li>No chassis modifications</li><li>Stock pinion gear required</li><li>Tires from approved list only</li></ul>"
}
```

### Example: With Headings and Mixed Content

```json
{
  "en": "<h4>Motor</h4><p>Stock motors only — 2500kv maximum.</p><h4>Chassis</h4><p>No modifications allowed. Must be factory spec.</p><h4>Tires</h4><ul><li>Must be from the <a href=\"https://example.com/approved\" target=\"_blank\" rel=\"noopener\">approved list</a></li><li>No tire warmers</li></ul>"
}
```

### Example: With Spec Table

```json
{
  "de": "<table><thead><tr><th>Komponente</th><th>Spezifikation</th></tr></thead><tbody><tr><td>Motor</td><td>2500kv</td></tr><tr><td>Motorritzel</td><td>12</td></tr><tr><td>Hauptzahnrad</td><td>53</td></tr></tbody></table>"
}
```

## Supported HTML Tags Reference

For content authors editing `classes.json`, here's what HTML tags are supported:

### Text Formatting

| Tag | Purpose | Example |
|-----|---------|---------|
| `<strong>` or `<b>` | Bold text | `<strong>Required</strong>` |
| `<em>` or `<i>` | Italic text | `<em>recommended</em>` |
| `<u>` | Underline | `<u>important</u>` |
| `<s>` | Strikethrough | `<s>deprecated rule</s>` |
| `<code>` | Inline code/value | `<code>2500kv</code>` |

### Structure

| Tag | Purpose | Example |
|-----|---------|---------|
| `<p>` | Paragraph | `<p>First rule.</p><p>Second rule.</p>` |
| `<br>` or `<br/>` | Line break | `Line 1<br/>Line 2` |
| `<hr>` | Horizontal divider | `<hr/>` |

### Headings

| Tag | Purpose | Example |
|-----|---------|---------|
| `<h3>` | Section heading | `<h3>Motor Rules</h3>` |
| `<h4>` | Subsection heading | `<h4>Tires</h4>` |

### Lists

| Tag | Purpose | Example |
|-----|---------|---------|
| `<ul>` + `<li>` | Bullet list | `<ul><li>Item 1</li><li>Item 2</li></ul>` |
| `<ol>` + `<li>` | Numbered list | `<ol><li>First</li><li>Second</li></ol>` |

### Links

| Tag | Purpose | Example |
|-----|---------|---------|
| `<a>` | Hyperlink | `<a href="https://..." target="_blank" rel="noopener">Link text</a>` |

### Tables

| Tag | Purpose |
|-----|---------|
| `<table>` | Table container |
| `<thead>` | Table header section |
| `<tbody>` | Table body section |
| `<tr>` | Table row |
| `<th>` | Header cell |
| `<td>` | Data cell |

## JSON Escaping Reminder

When writing HTML in JSON strings, remember:
- Double quotes inside HTML must be escaped: `\"` (e.g., `<a href=\"...\">`)
- Angle brackets (`<`, `>`) do NOT need escaping in JSON strings
- Use `<br/>` or `<br>` for line breaks (both work)
- Newlines can be written as `\n` but `<br/>` is preferred for explicit line breaks

## Backward Compatibility

Plain text rules (without any HTML tags) continue to work exactly as before. The prose plugin styles plain text correctly — it just renders as a single text node with proper font size and color. No migration required for existing rules that don't use HTML.
