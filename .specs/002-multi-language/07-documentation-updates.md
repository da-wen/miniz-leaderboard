# Documentation Updates

## README.md Changes

### Feature List

Add to the existing features section:

```markdown
- Multi-language support (English, German) with language switcher
- Configurable default language
- Translatable class rules in data files
```

### New Section: "Multi-Language Support"

Add after the "Sort Configuration" section:

```markdown
## Multi-Language Support

The site supports multiple languages. Users can switch languages via the globe icon in the sidebar.

### Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `en` | English | Default |
| `de` | German | ✓ |

### Changing the Default Language

Edit `src/lib/i18n/config.ts`:

\```typescript
export const i18n = {
  defaultLocale: "de",  // Change this
  locales: ["en", "de"],
} as const;
\```

### Adding a New Language

1. Add the locale code to `i18n.locales` in `src/lib/i18n/config.ts`
2. Create the dictionary file `src/lib/i18n/dictionaries/{code}.json` (copy `en.json` and translate)
3. Add the import to `src/lib/i18n/dictionaries.ts`
4. Add translations for class rules in `data/classes.json`

### Translating Class Rules

Class rules in `data/classes.json` support per-language text:

\```json
{
  "name": "Stock",
  "slug": "stock",
  "rules": {
    "en": "Stock motors only...",
    "de": "Nur Serienmotoren..."
  },
  "defaultSort": "bestLaptime"
}
\```

If a translation is missing, the default language is used as fallback.
```

### Update "Managing Data" Section

Update the "Adding a New Class" example to show the new `rules` format:

```markdown
### Adding a New Class

1. Add the class to `data/classes.json`:
   \```json
   {
     "name": "Open",
     "slug": "open",
     "rules": {
       "en": "All modifications allowed. No restrictions.",
       "de": "Alle Modifikationen erlaubt. Keine Einschränkungen."
     },
     "defaultSort": "bestLaptime"
   }
   \```

2. Assign it to tracks in `data/tracks.json`
3. Create the corresponding results files
```

## CLAUDE.md Changes

Add after the "Data Schema" section:

```markdown
## Internationalization

**Approach:** Zero-dependency i18n using Next.js `[lang]` dynamic segment. No external library.

**Routing:** All routes are prefixed with `/{lang}/` (e.g., `/en/tracks/...`, `/de/tracks/...`). Root `/` redirects to `/{defaultLocale}/...`.

**Translation files:** `src/lib/i18n/dictionaries/{locale}.json` — flat JSON with nested keys by UI section. Loaded via `getDictionary(lang)` in server components.

**Dictionary flow:** Server components call `getDictionary()` and pass relevant translation strings as props to client components. Client components never import dictionaries directly (enforced by `server-only`).

**Data translations:** Class rules in `data/classes.json` use `{ "en": "...", "de": "..." }` format. Access via `getLocalizedRules(classSlug, lang)`.

**Adding a language:** Add locale to `i18n.locales` in `src/lib/i18n/config.ts`, create dictionary JSON, add import to `dictionaries.ts`, add rule translations to `classes.json`.
```

Update the "Data Schema" bullet for classes:

```markdown
- `data/classes.json` — racing class definitions (name, slug, rules as `{locale: text}`, defaultSort)
```

Update the "Architecture" section:

```markdown
**Routing:** `/ → /{defaultLocale}/tracks/[trackSlug]/[classSlug]`. All routes are under a `[lang]` segment. Home page redirects to the first track in the default locale.
```

## Deployment Docs

No changes needed to `docs/deployment.md` — the GitHub Actions workflow builds all static pages automatically, including both locale variants. The doubled page count is negligible for this site.
