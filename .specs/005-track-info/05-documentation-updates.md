# Documentation Updates

## 1. README.md Changes

### 1.1 Features Section

**Location:** Line 7-14 (Features list)

**Add** this bullet after "Expandable rules section per class":

```markdown
- Collapsible track info section (optional, supports HTML)
```

### 1.2 New Section: Track Info

**Location:** After "Adding a New Track" section (after line ~95, before "Adding a New Class")

**Add:**

````markdown
### Track Info

Tracks can have an optional info section that appears as a collapsible accordion below the track name. The `info` field supports the same HTML tags as rules.

```json
{
  "name": "New Track",
  "slug": "new-track",
  "info": {
    "en": "<p>Indoor carpet track. Track length: ~18m.</p>",
    "de": "<p>Indoor-Teppichstrecke. Streckenlänge: ~18m.</p>"
  },
  "classes": [
    { "classSlug": "stock" }
  ]
}
```

If `info` is omitted or empty, no info section is displayed. Supported HTML tags are the same as for rules (see [Rules Formatting](#rules-formatting)).
````

### 1.3 Data File Structure

**Location:** Line 52-58 (File Structure section)

**Update** the `tracks.json` description:

```
├── tracks.json           # Track definitions, class assignments, and optional info
```

---

## 2. CLAUDE.md Changes

### 2.1 Architecture Section

**Location:** After the "HTML in rules" paragraph

**Add:**

```markdown
**HTML in track info:** The `info` field in `tracks.json` supports the same HTML subset as rules. `TrackInfoAccordion` sanitizes via `isomorphic-dompurify` before rendering. If `info` is null/empty, the section is not displayed.
```

### 2.2 Data Schema Section

**Location:** `data/tracks.json` bullet

**Update to:**

```markdown
- `data/tracks.json` — track definitions with assigned classes (supports per-track sort overrides and optional localized HTML `info`)
```

### 2.3 No Other Changes Needed

- **Routing:** Unchanged — no new routes
- **Key Config:** Unchanged — no new config
- **Commands:** Unchanged — no new commands
- **Deployment:** Unchanged — no new deployment steps
- **Sort priority:** Unchanged — track info is display-only
