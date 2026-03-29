# Documentation Updates

## README.md Changes

### 1. Add to Features list

Add after "Responsive design (desktop, tablet, mobile)":

```markdown
- Legal notice / Impressum page (bilingual, German + English)
```

### 2. Add Imprint section

Add a new subsection after "Sort Configuration" and before "Deployment":

```markdown
### Imprint / Impressum

Edit `data/imprint.json` with your personal information:

\`\`\`json
{
  "name": "Your Full Name",
  "address": {
    "street": "Street and House Number",
    "city": "Postal Code City"
  },
  "email": "your@email.com",
  "phone": "+49 123 456789"
}
\`\`\`

Set `phone` to `null` if you don't want to display a phone number. The imprint is accessible via the footer link on every page.
```

### 3. Update File Structure

Add `imprint.json` to the data directory listing:

```markdown
data/
├── classes.json          # Racing class definitions (name, rules, default sort)
├── tracks.json           # Track definitions and class assignments
├── imprint.json          # Imprint / legal notice personal data
└── results/              # Lap time data per track + class
    ├── {track}_{class}.json
    └── ...
```

### 4. Update Project Structure

Add the impressum route and Footer component:

```markdown
├── src/
│   ├── app/                # Next.js routes
│   │   └── [lang]/
│   │       └── impressum/  # Imprint / Legal notice page
│   ├── components/         # React components (incl. Footer)
│   ├── lib/                # Data loading utilities
│   └── types/              # TypeScript definitions
```

---

## CLAUDE.md Changes

### 1. Add to Data Schema section

Add after the existing data schema entries:

```markdown
- `data/imprint.json` — personal data for imprint page (name, address, email, phone)
```

### 2. Add to Architecture section

Add after the **Sort priority** entry:

```markdown
**Imprint page:** `/{lang}/impressum` renders a bilingual legal notice. UI text from dictionaries, personal data from `data/imprint.json`. Footer component in `[lang]/layout.tsx` provides a site-wide link.
```

### 3. Update Routing description

Update the Routing line to include the imprint route:

```markdown
**Routing:** `/ → /tracks/[trackSlug]/[classSlug]`. Home page redirects to the first track. Each track has class tabs for different racing categories. `/[lang]/impressum` serves the legal notice page.
```
