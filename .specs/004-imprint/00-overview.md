# Imprint Page - Implementation Plan Overview

## Goal

Add a bilingual imprint page (Impressum) to the Mini-Z Leaderboard, accessible from every page via a footer link. The site is a private, non-profit hobby website hosted from Germany, so the imprint follows German legal requirements (DDG Section 5) as a precaution.

## Legal Context

The **Digitale-Dienste-Gesetz (DDG)** replaced the TMG on May 14, 2024. DDG Section 5 requires an imprint for sites offered on a "geschaeftsmassig" (sustained, organized basis to the public). While a non-commercial hobby site is in a gray area, the legal consensus is to include a minimal imprint as a precaution. The practical enforcement risk is very low (no competitive relationship = no UWG Abmahnung), but the cost of compliance is near zero.

### What Must Be Included (Private Individual, Minimal)

| Field | Required | Privacy Note |
|-------|----------|--------------|
| Full name (first + last) | Yes | Cannot be avoided |
| Postal address | Yes | **Use a c/o mail forwarding address** to protect home address (~5-15 EUR/month) |
| Email address | Yes | Sufficient as rapid electronic contact |
| Phone number | **No** | Email suffices per ECJ C-298/17 |

### What Is NOT Required (for this type of site)

- Disclaimer sections (optional, omitted to keep it minimal)
- "Verantwortlich fuer den Inhalt" / Section 18 MStV (only for editorial/journalistic content)
- VAT ID, trade register, professional info (only for commercial entities)
- Specific law references in the imprint text (avoids needing updates when laws change)

## Approach

- Add a slim **site-wide footer** with copyright and imprint link
- Create a new **`/[lang]/impressum`** route for the imprint content
- Use the existing **i18n dictionary system** for translations
- Footer is a **server component** (no interactivity needed)
- Imprint UI labels stored in **dictionary JSON files**, personal data in **`data/imprint.json`** (consistent with existing data-driven approach)

### Why This Approach?

- Follows existing architecture patterns (i18n routing, dictionary-based content)
- No new dependencies
- Static export compatible
- Each language has its own URL (SEO-friendly, legally correct)
- German version is directly accessible without toggles

## Plan Structure

| File | Content |
|------|---------|
| `01-legal-requirements.md` | German imprint law details, required fields, language rules |
| `02-footer-design.md` | Footer component design, placement, styling |
| `03-imprint-page.md` | Imprint page route, content structure, translations |
| `04-component-changes.md` | Changes to existing layout and components |
| `05-implementation-tasks.md` | Step-by-step implementation tasks grouped by phase |
| `06-documentation-updates.md` | Changes to README.md and CLAUDE.md |
| `07-phase-summary.md` | Phase overview with dependencies and checklist |

## Key Constraints

- Remains fully static (`output: "export"`)
- No new npm dependencies
- Consistent with existing dark theme and design language
- Footer must not interfere with existing sidebar/mobile nav layout
- Imprint must be accessible within 2 clicks from any page (German legal requirement)
- German version takes legal precedence
