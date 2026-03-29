# Imprint Page

## Route

**Path:** `/src/app/[lang]/impressum/page.tsx`

**URLs:**
- `/de/impressum` — German version
- `/en/impressum` — English version

The existing language switcher automatically works with this route — it swaps the `[lang]` segment in the current URL.

## Page Design

### Visual Layout (Minimal)

```
┌─────────────────────────────────────────┐
│                                         │
│  Impressum                              │  ← h1, large heading
│                                         │
│  Max Mustermann                         │  ← Name
│  c/o Some Service                       │  ← Optional c/o line
│  Musterstrasse 1                        │  ← Street
│  12345 Musterstadt                      │  ← City
│                                         │
│  Kontakt                                │  ← Section heading
│  E-Mail: example@example.com            │
│                                         │
│ ──────────────────────────────────────  │
│ (c) 2026 Mini-Z Leaderboard · Impressum │
└─────────────────────────────────────────┘
```

The page is intentionally minimal — just the legally required information.

### Styling

- Same padding as track pages: `p-6 lg:p-8`
- Heading: `text-2xl font-bold text-slate-50` (matches track title style)
- Body text: `text-sm text-slate-300` with `leading-relaxed`
- Section headings: `text-lg font-semibold text-slate-200 mt-6 mb-2`
- Links: `text-blue-400 hover:text-blue-300` (matches rules link style)
- Max width: `max-w-2xl` to keep text readable

## Content Structure

### German Version (Primary — Legally Required)

```
Impressum

[Full Name]
[Address Line 1 — e.g., c/o Service or street]
[Address Line 2 — e.g., street or city]
[Address Line 3 — e.g., city, if 3 lines needed]

Kontakt
E-Mail: [email]
```

### English Version (Translation)

```
Legal Notice

[Full Name]
[Address Line 1]
[Address Line 2]
[Address Line 3]

Contact
Email: [email]
```

**Note:** No phone number (email suffices per ECJ C-298/17). No disclaimer sections (optional, and this is a minimal hobby site). No "Verantwortlich fuer den Inhalt" (not editorial content).

## Translation Dictionary Additions

### `de.json` additions

```json
{
  "footer": {
    "imprint": "Impressum"
  },
  "imprint": {
    "title": "Impressum",
    "contact": "Kontakt",
    "email": "E-Mail"
  }
}
```

### `en.json` additions

```json
{
  "footer": {
    "imprint": "Legal Notice"
  },
  "imprint": {
    "title": "Legal Notice",
    "contact": "Contact",
    "email": "Email"
  }
}
```

**Note:** The translations are minimal — only UI labels. No disclaimer text since we're not including disclaimers. If the site owner later wants to add disclaimers, new dictionary keys can be added.

## Personal Data Configuration

The actual personal data is stored in a **data file**, not in the dictionary. This separates content from personal information.

**File:** `data/imprint.json`

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

**Rationale for address as array:**
- Flexible: supports 1-3 address lines (direct address, c/o address, or multi-line)
- Examples:
  - Direct: `["Musterstrasse 1", "12345 Musterstadt"]`
  - With c/o: `["c/o Clevvermail", "Musterstrasse 1", "12345 Berlin"]`
- No phone field — email is sufficient (ECJ C-298/17)
- No disclaimer fields — keeping it minimal

## Data Loader Addition

Add to `src/lib/data.ts`:

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

## Page Component

**File:** `src/app/[lang]/impressum/page.tsx`

```tsx
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getImprintData } from "@/lib/data";
import { i18n } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.imprint.title };
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const imprint = getImprintData();

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-50 mb-6">
        {dict.imprint.title}
      </h1>

      {/* Personal Information */}
      <div className="text-sm text-slate-300 leading-relaxed mb-6">
        <p>{imprint.name}</p>
        {imprint.address.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Contact */}
      <h2 className="text-lg font-semibold text-slate-200 mt-6 mb-2">
        {dict.imprint.contact}
      </h2>
      <div className="text-sm text-slate-300 leading-relaxed">
        <p>
          {dict.imprint.email}:{" "}
          <a
            href={`mailto:${imprint.email}`}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {imprint.email}
          </a>
        </p>
      </div>
    </div>
  );
}
```

## Static Generation

The `generateStaticParams()` function returns all locales, so Next.js generates:
- `out/de/impressum/index.html`
- `out/en/impressum/index.html`

No additional configuration needed — this follows the same pattern as existing `[lang]` pages.
