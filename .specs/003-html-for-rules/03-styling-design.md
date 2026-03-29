# Styling & Design

## Tailwind CSS Typography Plugin

### Installation

```bash
npm install @tailwindcss/typography
```

### Configuration (Tailwind CSS v4)

In `src/app/globals.css`, add the `@plugin` directive:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

html,
body {
  background-color: #020617; /* slate-950 */
  color: #f8fafc; /* slate-50 */
}

details > summary::-webkit-details-marker {
  display: none;
}
```

**Important:** Tailwind CSS v4 uses `@plugin` instead of the v3 `plugins: [require('@tailwindcss/typography')]` config. No `tailwind.config.ts` changes needed (this project doesn't have one).

## Prose Classes Breakdown

### Base Classes

```
prose prose-sm prose-invert max-w-none
```

| Class | Purpose |
|-------|---------|
| `prose` | Enables Typography plugin styling on all child HTML elements |
| `prose-sm` | Uses 14px base font size — compact, fits inside accordion |
| `prose-invert` | Inverts all colors for dark backgrounds (essential for slate-950 bg) |
| `max-w-none` | Removes the default 65ch max-width so content fills the container |

### Element-Specific Overrides

These fine-tune the prose defaults to match the existing site design:

```
prose-headings:text-slate-200
prose-a:text-blue-400 prose-a:hover:text-blue-300
prose-strong:text-slate-200
prose-td:border-slate-800 prose-th:border-slate-800
prose-th:text-slate-300
```

| Override | Purpose |
|----------|---------|
| `prose-headings:text-slate-200` | Headings match the site's light text style |
| `prose-a:text-blue-400` | Links use blue to stand out in the dark theme |
| `prose-a:hover:text-blue-300` | Links lighten on hover |
| `prose-strong:text-slate-200` | Bold text is light (not white — keeps hierarchy) |
| `prose-td:border-slate-800` | Table cell borders match the site's border color |
| `prose-th:border-slate-800` | Table header borders match |
| `prose-th:text-slate-300` | Table headers slightly brighter than body text |

### Utility Classes

```
px-4 pb-4 overflow-x-auto
```

| Class | Purpose |
|-------|---------|
| `px-4 pb-4` | Preserved from original component — matches accordion padding |
| `overflow-x-auto` | Tables scroll horizontally on mobile instead of breaking layout |

## Visual Result

### Before (Current)

The rules accordion content area shows plain text in `text-slate-400`:

```
Motor: 2500kv<br/>Motorritzel: 12<br/>Hauptzahnrad: 53
```

Literal `<br/>` tags visible. No formatting. Single paragraph.

### After (With HTML Rendering)

The same content renders as:

```
Motor: 2500kv
Motorritzel: 12
Hauptzahnrad: 53
```

And richer HTML content like:

```html
<h4>Motor</h4>
<ul>
  <li><strong>Type:</strong> 2500kv Stock</li>
  <li><strong>Pinion:</strong> 12T</li>
</ul>
<h4>Chassis</h4>
<p>No modifications allowed.</p>
```

Renders with proper headings, styled lists, bold labels — all in the dark theme with consistent spacing.

## Typography Defaults (What `prose-invert prose-sm` Provides)

The Typography plugin automatically styles these elements when they appear inside a `prose` container:

| Element | Default Styling |
|---------|----------------|
| `<p>` | 1.25em margin top/bottom, relaxed line-height |
| `<h3>` | Larger font, bolder weight, top margin |
| `<h4>` | Medium font, bold, top margin |
| `<strong>`, `<b>` | Font-weight: 600, slightly brighter text |
| `<em>`, `<i>` | Italic |
| `<a>` | Blue color, underline |
| `<ul>`, `<ol>` | Bullets/numbers, indentation, item spacing |
| `<li>` | Proper margin between items |
| `<br>` | Standard line break (native HTML behavior) |
| `<hr>` | Subtle horizontal rule |
| `<code>` | Monospace font, subtle background |
| `<table>` | Borders, padding, header styling |
| `<blockquote>` | Left border, italic, padding |

**No custom CSS needed** — the plugin handles all of this. The element-specific overrides (`prose-headings:`, `prose-a:`, etc.) just adjust colors to match the site palette.

## Responsive Behavior

The `prose-sm` size works well on both mobile and desktop within the accordion:

- **Desktop:** Accordion fills the main content area (right of sidebar). `max-w-none` lets text use full width.
- **Mobile:** Accordion is full-width. `overflow-x-auto` handles tables. `prose-sm` prevents text from being too large.

No responsive breakpoint changes needed. The existing accordion responsiveness handles this.

## Dark Theme Compatibility

The site uses:
- Background: `bg-slate-950` (body) / `bg-slate-900` (accordion)
- Text: `text-slate-50` (body) / `text-slate-300`-`text-slate-400` (secondary)
- Borders: `border-slate-800`

`prose-invert` automatically inverts all prose colors to light-on-dark. The element overrides ensure the specific shades match the existing palette.
