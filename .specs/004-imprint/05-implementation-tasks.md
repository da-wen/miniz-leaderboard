# Implementation Tasks

## Phase 1: Data & Translations

### Task 1.1: Create imprint data file

**Create** `data/imprint.json`:

```json
{
  "name": "REPLACE_WITH_YOUR_NAME",
  "address": [
    "REPLACE_WITH_ADDRESS_LINE_1",
    "REPLACE_WITH_ADDRESS_LINE_2"
  ],
  "email": "REPLACE_WITH_EMAIL"
}
```

**Notes:**
- Address is an array to support flexible formatting (1-3 lines)
- For a c/o address: `["c/o Service Name", "Street Nr", "PLZ City"]`
- For a direct address: `["Street Nr", "PLZ City"]`
- No phone field — email is sufficient (ECJ C-298/17)

### Task 1.2: Add imprint data loader

**Modify** `src/lib/data.ts` — add at the end of the file:

```typescript
export interface ImprintData {
  name: string;
  address: string[];
  email: string;
}

export function getImprintData(): ImprintData {
  const raw = fs.readFileSync(path.join(dataDir, "imprint.json"), "utf-8");
  return JSON.parse(raw);
}
```

### Task 1.3: Add German translations

**Modify** `src/lib/i18n/dictionaries/de.json` — add two new top-level keys:

```json
"footer": {
  "imprint": "Impressum"
},
"imprint": {
  "title": "Impressum",
  "contact": "Kontakt",
  "email": "E-Mail"
}
```

### Task 1.4: Add English translations

**Modify** `src/lib/i18n/dictionaries/en.json` — add two new top-level keys:

```json
"footer": {
  "imprint": "Legal Notice"
},
"imprint": {
  "title": "Legal Notice",
  "contact": "Contact",
  "email": "Email"
}
```

### Verify Phase 1

```bash
npm run build
```

Build should succeed — no new components reference the translations yet.

---

## Phase 2: Footer Component

### Task 2.1: Create Footer component

**Create** `src/components/Footer.tsx`:

```tsx
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface FooterProps {
  lang: string;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="border-t border-slate-800 px-6 py-4 lg:px-8 mt-auto">
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>&copy; {new Date().getFullYear()} Mini-Z Leaderboard</span>
        <span>&middot;</span>
        <Link
          href={`/${lang}/impressum`}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          {dict.footer.imprint}
        </Link>
      </div>
    </footer>
  );
}
```

### Task 2.2: Add Footer to language layout

**Modify** `src/app/[lang]/layout.tsx`:

1. Add import: `import { Footer } from "@/components/Footer";`

2. Change the `<main>` section from:

```tsx
<main className="flex-1 lg:ml-64 overflow-auto min-h-screen">
  {children}
</main>
```

To:

```tsx
<main className="flex-1 lg:ml-64 overflow-auto min-h-screen flex flex-col">
  <div className="flex-1">
    {children}
  </div>
  <Footer lang={lang} dict={dict} />
</main>
```

### Verify Phase 2

```bash
npm run dev
```

- Footer should appear at bottom of every page
- "Impressum" link should show on German pages
- "Legal Notice" link should show on English pages
- Link points to `/{lang}/impressum` (will 404 until Phase 3)
- Footer should not overlap with sidebar on desktop
- Footer should appear below content on mobile

---

## Phase 3: Imprint Page

### Task 3.1: Create imprint page

**Create** `src/app/[lang]/impressum/page.tsx` with the full implementation from `03-imprint-page.md`.

Key points:
- `generateStaticParams()` returns all locales
- `generateMetadata()` sets page title from dictionary
- Page reads imprint data via `getImprintData()`
- UI labels from dictionary (bilingual), personal data from `data/imprint.json`
- Address rendered as array (one `<p>` per line)

### Verify Phase 3

```bash
npm run dev
```

- Navigate to `/de/impressum` — German imprint page shows
- Navigate to `/en/impressum` — English imprint page shows
- Language switcher works on imprint page
- Footer "Impressum" link navigates correctly
- Personal data shows placeholder values (REPLACE_WITH_*)

```bash
npm run build
```

- Build succeeds
- `out/de/impressum/index.html` exists
- `out/en/impressum/index.html` exists

---

## Phase 4: Documentation & Polish

### Task 4.1: Update README.md

Add to the Features section:
- "Legal notice / Impressum page (bilingual)"

Add a new section "Imprint / Impressum" after "Sort Configuration":
```markdown
### Imprint / Impressum

Edit `data/imprint.json` with your personal information:

\`\`\`json
{
  "name": "Your Full Name",
  "address": [
    "Street and House Number",
    "Postal Code City"
  ],
  "email": "your@email.com"
}
\`\`\`

The address field is an array — use 2-3 lines as needed. For a c/o address:
\`\`\`json
"address": ["c/o Service Name", "Street Nr", "PLZ City"]
\`\`\`

The imprint is accessible via the footer link on every page.
```

Update the data File Structure section to include `imprint.json`.

### Task 4.2: Update CLAUDE.md

Add under **Data Schema**:
```
- `data/imprint.json` — personal data for imprint page (name, address, email)
```

Add under **Architecture**:
```
**Imprint page:** `/{lang}/impressum` renders a bilingual legal notice. UI labels from dictionaries, personal data from `data/imprint.json`. Footer component in `[lang]/layout.tsx` provides a site-wide link.
```

### Task 4.3: Final verification

```bash
npm run lint
npm run build
npx serve out
```

- No lint errors
- Build succeeds
- Both language versions of imprint page render correctly
- Footer appears on all pages
- All links work correctly
