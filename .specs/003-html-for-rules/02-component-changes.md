# Component Changes

## Overview

Only **one component** needs modification: `src/components/RulesAccordion.tsx`. No new components are created — the sanitization logic is added directly to the existing component.

## Current Code (Before)

**File:** `src/components/RulesAccordion.tsx`

```tsx
import { ChevronRight } from "lucide-react";

interface RulesAccordionProps {
  rules: string;
  className: string;
  rulesLabel: string;
}

export function RulesAccordion({ rules, className, rulesLabel }: RulesAccordionProps) {
  const label = rulesLabel.replace("{className}", className);

  return (
    <details className="group mb-6 rounded-lg border border-slate-800 bg-slate-900">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white list-none">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        {label}
      </summary>
      <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">
        {rules}
      </div>
    </details>
  );
}
```

**Problem:** `{rules}` renders as plain text — HTML tags are escaped.

## Updated Code (After)

**File:** `src/components/RulesAccordion.tsx`

```tsx
"use client";

import { ChevronRight } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

const SANITIZE_CONFIG = {
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

interface RulesAccordionProps {
  rules: string;
  className: string;
  rulesLabel: string;
}

export function RulesAccordion({ rules, className, rulesLabel }: RulesAccordionProps) {
  const label = rulesLabel.replace("{className}", className);
  const sanitizedRules = DOMPurify.sanitize(rules, SANITIZE_CONFIG);

  return (
    <details className="group mb-6 rounded-lg border border-slate-800 bg-slate-900">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white list-none">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        {label}
      </summary>
      <div
        className="prose prose-sm prose-invert max-w-none px-4 pb-4
                   prose-headings:text-slate-200
                   prose-a:text-blue-400 prose-a:hover:text-blue-300
                   prose-strong:text-slate-200
                   prose-td:border-slate-800 prose-th:border-slate-800
                   prose-th:text-slate-300
                   overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: sanitizedRules }}
      />
    </details>
  );
}
```

## Changes Explained

### 1. Added `"use client"` Directive

The component was previously a server component (no directive). It must become a client component because:
- `isomorphic-dompurify` uses browser APIs when available, and the import pattern works best as a client component
- `dangerouslySetInnerHTML` works in both server and client components, but DOMPurify initialization is cleaner client-side

**Note:** If there are build issues with `isomorphic-dompurify` as a client component, an alternative is to sanitize in the page component (server-side) and pass the sanitized HTML as a prop. See the "Alternative: Server-Side Sanitization" section below.

### 2. DOMPurify Import and Config

```tsx
import DOMPurify from "isomorphic-dompurify";

const SANITIZE_CONFIG = { ... };
```

- Config is defined as a module-level constant (not recreated each render)
- Whitelist-based approach — only explicitly allowed tags pass through

### 3. Sanitization Call

```tsx
const sanitizedRules = DOMPurify.sanitize(rules, SANITIZE_CONFIG);
```

- Called inside the component function, before render
- Returns a clean HTML string

### 4. HTML Rendering

**Before:**
```tsx
<div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">
  {rules}
</div>
```

**After:**
```tsx
<div
  className="prose prose-sm prose-invert max-w-none px-4 pb-4 ..."
  dangerouslySetInnerHTML={{ __html: sanitizedRules }}
/>
```

- Replaced `{rules}` (text interpolation) with `dangerouslySetInnerHTML`
- Replaced manual text styling classes with `prose` classes from Typography plugin
- Added `overflow-x-auto` for tables that might exceed container width on mobile

### 5. Styling Classes Changed

**Removed:** `text-sm text-slate-400 leading-relaxed`
**Added:** `prose prose-sm prose-invert max-w-none` + element-specific overrides

See `03-styling-design.md` for full details on the prose classes.

## Alternative: Server-Side Sanitization

If `isomorphic-dompurify` causes issues as a client component import, sanitize in the page component instead:

**File:** `src/app/[lang]/tracks/[trackSlug]/[classSlug]/page.tsx`

```tsx
import DOMPurify from "isomorphic-dompurify";

// ... in the page component:
const rules = getLocalizedRules(classSlug, lang);
const sanitizedRules = DOMPurify.sanitize(rules, SANITIZE_CONFIG);

return (
  <RulesAccordion
    rules={sanitizedRules}  // already sanitized
    className={racingClass.name}
    rulesLabel={dict.rules.label}
  />
);
```

Then `RulesAccordion` stays a server component and just uses `dangerouslySetInnerHTML` without importing DOMPurify. This approach is simpler but moves sanitization away from the render point.

**Recommendation:** Try the client component approach first. Fall back to server-side if needed.

## No Other Component Changes

- `LeaderboardTable.tsx` — no changes (doesn't render rules)
- `ClassTabs.tsx` — no changes
- `Sidebar.tsx` / `SidebarNav.tsx` / `MobileNav.tsx` — no changes
- `LanguageSwitcher.tsx` — no changes
- `LapTime.tsx` — no changes
- `src/lib/data.ts` — no changes (`getLocalizedRules()` already returns the raw string)
- `src/types/index.ts` — no changes (type is already `string`)

## Props Interface

No changes to the `RulesAccordionProps` interface — the `rules` prop stays `string`. The difference is that the string now contains HTML, but the type doesn't change.
