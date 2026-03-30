# Component Design: TrackInfoAccordion

## Overview

A client component that renders an optional, collapsible info section for a track. Uses the same pattern as `RulesAccordion`: native `<details>/<summary>` element, DOMPurify sanitization, and Tailwind Typography prose classes.

## File Location

**Create:** `src/components/TrackInfoAccordion.tsx`

## Component Interface

```typescript
interface TrackInfoAccordionProps {
  info: string;     // Pre-localized, sanitized-at-render HTML string
  label: string;    // Localized label (e.g., "Track Info" / "Streckeninfo")
}
```

**Props flow:**
- `info` — the already-language-resolved string from `getLocalizedTrackInfo(trackSlug, lang)`
- `label` — the i18n label from the dictionary (`dict.trackInfo.label`)

## Full Component Code

```tsx
"use client";

import DOMPurify from "isomorphic-dompurify";
import { ChevronRight } from "lucide-react";

// Same sanitization config as RulesAccordion — whitelist of safe HTML tags
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SANITIZE_CONFIG: any = {
  ALLOWED_TAGS: [
    "b", "i", "em", "strong", "u", "s",
    "p", "br", "hr",
    "h3", "h4",
    "ul", "ol", "li",
    "a",
    "span", "code",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
};

interface TrackInfoAccordionProps {
  info: string;
  label: string;
}

export function TrackInfoAccordion({ info, label }: TrackInfoAccordionProps) {
  const sanitizedInfo = DOMPurify.sanitize(info, SANITIZE_CONFIG);

  return (
    <details className="group mb-6 rounded-lg border border-slate-800 bg-slate-900">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white list-none">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        {label}
      </summary>
      <div
        className="px-4 pb-4 prose prose-sm prose-invert max-w-none prose-p:text-slate-400 prose-li:text-slate-400 prose-headings:text-slate-300 prose-a:text-blue-400 prose-code:text-slate-300 prose-hr:border-slate-700 prose-table:text-slate-400 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: sanitizedInfo }}
      />
    </details>
  );
}
```

## Design Decisions

### Why a separate component (not reusing RulesAccordion)?

| Aspect | RulesAccordion | TrackInfoAccordion |
|--------|---------------|-------------------|
| **Placement** | Inside class page (`[classSlug]/page.tsx`) | Inside track layout (`[trackSlug]/layout.tsx`) |
| **Label** | Template: `"{className} Rules"` | Static: `"Track Info"` / `"Streckeninfo"` |
| **Props** | `rules`, `className`, `rulesLabel` | `info`, `label` |
| **Context** | Per-class (changes with tab switch) | Per-track (shared across all class tabs) |

The components are structurally similar (~40 lines each) but serve different purposes at different levels of the page hierarchy. Merging them into a generic accordion would create unnecessary abstraction for just two use cases.

### Why `"use client"`?

`isomorphic-dompurify` uses `DOMPurify.sanitize()` which needs DOM APIs at runtime. While Next.js static builds run server-side, the component must also hydrate on the client. The `"use client"` directive ensures this works correctly — same pattern as `RulesAccordion`.

### Styling

Identical Tailwind classes to `RulesAccordion` for visual consistency:

- **Container:** `rounded-lg border border-slate-800 bg-slate-900` — dark card with subtle border
- **Summary:** `text-sm font-medium text-slate-300 hover:text-white` — muted text, white on hover
- **Chevron:** `h-4 w-4 transition-transform group-open:rotate-90` — rotates 90° when open
- **Content:** `prose prose-sm prose-invert` — Tailwind Typography for rendered HTML
- **Prose overrides:** slate-400 text, blue-400 links, slate-300 headings — matches dark theme
- **`list-none`** on summary: removes the native disclosure triangle (replaced by chevron icon)
- **`overflow-x-auto`** on content: horizontal scroll for wide tables on mobile

### Collapsed by Default

The `<details>` element is collapsed by default (no `open` attribute). This is the HTML standard behavior and matches the user requirement.

## Accessibility

Native `<details>/<summary>` provides built-in accessibility:

- **Keyboard:** `Enter`/`Space` toggles open/close (browser-native)
- **Screen readers:** `<summary>` is announced as a disclosure widget with expanded/collapsed state
- **ARIA:** No additional ARIA attributes needed — the browser handles `aria-expanded` semantics natively
- **Focus:** `<summary>` is focusable by default (tab-navigable)
