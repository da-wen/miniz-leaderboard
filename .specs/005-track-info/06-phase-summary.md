# Phase Summary

## Overview

This feature adds an optional, collapsible info section below each track name. It follows the exact same patterns already established in the codebase (RulesAccordion, LocalizedText, DOMPurify sanitization) and requires no new dependencies.

## Phases

### Phase 1: Data Layer (Tasks 1-3)

| Task | Description | Files Modified | Estimated Effort |
|------|-------------|---------------|-----------------|
| 1 | Add `info?: LocalizedText` to `Track` type | `src/types/index.ts` | 2 min |
| 2 | Add `getLocalizedTrackInfo()` loader | `src/lib/data.ts` | 3 min |
| 3 | Add `info` content to `tracks.json` | `data/tracks.json` | 2 min |

**Outcome:** Data model supports track info. No visible changes yet.

### Phase 2: Component (Task 4)

| Task | Description | Files Created | Estimated Effort |
|------|-------------|--------------|-----------------|
| 4 | Create `TrackInfoAccordion` component | `src/components/TrackInfoAccordion.tsx` | 5 min |

**Outcome:** Component exists and is ready to use. No visible changes yet.

### Phase 3: Integration (Tasks 5-6)

| Task | Description | Files Modified | Estimated Effort |
|------|-------------|---------------|-----------------|
| 5 | Add i18n dictionary entries | `src/lib/i18n/dictionaries/en.json`, `de.json` | 2 min |
| 6 | Wire into track layout | `src/app/[lang]/tracks/[trackSlug]/layout.tsx` | 5 min |

**Outcome:** Feature is live. Track info section appears on track pages.

### Phase 4: Verification (Task 7)

| Task | Description | Files Modified | Estimated Effort |
|------|-------------|---------------|-----------------|
| 7 | Build, visual verification, edge cases | None | 5 min |

**Outcome:** Feature verified working (build passes, visual check, empty-info check, responsive check).

### Phase 5: Documentation (Tasks 8-9)

| Task | Description | Files Modified | Estimated Effort |
|------|-------------|---------------|-----------------|
| 8 | Update README.md | `README.md` | 3 min |
| 9 | Update CLAUDE.md | `CLAUDE.md` | 2 min |

**Outcome:** Documentation reflects the new feature.

---

## Dependency Graph

```
Task 1 (Track type) ──┐
                       ├── Task 2 (data loader) ──┐
                       │                           │
Task 3 (tracks.json) ─┘                           ├── Task 6 (layout integration)
                                                   │
Task 4 (component) ───────────────────────────────┤
                                                   │
Task 5 (i18n) ────────────────────────────────────┘
                                                   │
                                                   ├── Task 7 (verification)
                                                   │
                                                   ├── Task 8 (README)
                                                   │
                                                   └── Task 9 (CLAUDE.md)
```

**Critical path:** Task 1 → Task 2 → Task 6 → Task 7

**Parallelizable:**
- Tasks 1 + 3 can run in parallel
- Tasks 4 + 5 can run in parallel (after Task 1)
- Tasks 8 + 9 can run in parallel (after Task 7)

---

## Files Changed Summary

| File | Action | Phase |
|------|--------|-------|
| `src/types/index.ts` | Modify (add `info` field) | 1 |
| `src/lib/data.ts` | Modify (add loader function) | 1 |
| `data/tracks.json` | Modify (add info content) | 1 |
| `src/components/TrackInfoAccordion.tsx` | **Create** | 2 |
| `src/lib/i18n/dictionaries/en.json` | Modify (add `trackInfo`) | 3 |
| `src/lib/i18n/dictionaries/de.json` | Modify (add `trackInfo`) | 3 |
| `src/app/[lang]/tracks/[trackSlug]/layout.tsx` | Modify (add imports + JSX) | 3 |
| `README.md` | Modify (add docs) | 5 |
| `CLAUDE.md` | Modify (update docs) | 5 |

**Total: 1 new file, 8 modified files**

---

## Checklist

- [ ] Phase 1: `Track` type has `info?: LocalizedText`
- [ ] Phase 1: `getLocalizedTrackInfo()` returns localized string with fallback
- [ ] Phase 1: `tracks.json` has sample info content
- [ ] Phase 2: `TrackInfoAccordion` component created with DOMPurify sanitization
- [ ] Phase 3: i18n labels added ("Track Info" / "Streckeninfo")
- [ ] Phase 3: Track layout renders `TrackInfoAccordion` conditionally
- [ ] Phase 4: `npm run build` succeeds
- [ ] Phase 4: Info section appears collapsed by default
- [ ] Phase 4: Info section expands/collapses on click
- [ ] Phase 4: Missing/empty `info` → no section rendered
- [ ] Phase 4: Language switching works for label and content
- [ ] Phase 4: Responsive layout works (mobile + desktop)
- [ ] Phase 5: README.md documents the `info` field
- [ ] Phase 5: CLAUDE.md updated with track info architecture

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Type error from optional `info` field | Low | Low | Field is optional — existing code ignores it |
| DOMPurify sanitization strips needed tags | Low | Low | Same whitelist as proven RulesAccordion |
| Visual inconsistency with rules accordion | None | Low | Identical CSS classes used |
| Build failure | Low | Medium | Incremental commits allow easy rollback |

**Overall risk: Very low.** This feature follows established patterns with no new dependencies, no architectural changes, and full backwards compatibility.
