# Track Info Section - Implementation Plan Overview

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional, collapsible info section below each track name that supports localized HTML content — hidden by default, only rendered when data exists.

**Architecture:** Extend the existing `Track` type with an optional `info` field (`LocalizedText`), add a data loader function, create a new `TrackInfoAccordion` client component (reusing the same `<details>/<summary>` + DOMPurify pattern as `RulesAccordion`), and integrate it into the track layout between the `<h1>` and `<ClassTabs>`.

**Tech Stack:** Next.js 16 (App Router, SSG), React 19, TypeScript, Tailwind CSS 4, isomorphic-dompurify, lucide-react

---

## Problem

Tracks currently display only a name (`<h1>`) and class tabs. There is no place to show track-specific information such as location details, event dates, track layout descriptions, or special announcements. This information varies per track and per language.

## Approach

Follow the established pattern from `RulesAccordion` (spec 003):

1. **Data:** Add `info` field to `tracks.json` as `LocalizedText` (same type used by `rules` in `classes.json`)
2. **Loader:** Add `getLocalizedTrackInfo()` to `src/lib/data.ts` (mirrors `getLocalizedRules()`)
3. **Component:** Create `TrackInfoAccordion` — a `"use client"` component using native `<details>/<summary>`, DOMPurify sanitization, and Tailwind Typography prose classes
4. **Integration:** Render in `src/app/[lang]/tracks/[trackSlug]/layout.tsx` between `<h1>` and `<ClassTabs>`, conditionally (only if info content exists)
5. **i18n:** Add `trackInfo.label` key to both language dictionaries

### Why this approach?

| Decision | Rationale |
|----------|-----------|
| Separate `TrackInfoAccordion` (not reuse `RulesAccordion`) | Different context (track-level vs class-level), different label, slightly different placement. Keeping them separate avoids coupling. Both are small (~40 lines). |
| Native `<details>/<summary>` | Already proven in this codebase. No JS needed for toggle. Built-in accessibility. Widely supported since 2020. |
| `LocalizedText` type for `info` | Consistent with how `rules` works — supports `{ "en": "...", "de": "..." }` with language fallback. |
| Optional field (`info?: LocalizedText`) | Backwards compatible — existing tracks without `info` continue to work unchanged. |
| DOMPurify sanitization | Same defense-in-depth approach as rules. Reuses the same allowed-tags whitelist. |
| Collapsed by default | User requirement. Matches `RulesAccordion` behavior. |

## Scope

### In Scope

- Add `info` field to `Track` type and `tracks.json` schema
- Create `TrackInfoAccordion` component with HTML sanitization
- Add `getLocalizedTrackInfo()` data loader
- Integrate into track layout with conditional rendering
- Add i18n dictionary entries for the label
- Update `README.md` and `CLAUDE.md` documentation

### Out of Scope

- Refactoring `RulesAccordion` into a shared base component (YAGNI — only 2 similar components)
- Animations for expand/collapse (matches current `RulesAccordion` behavior — instant toggle with chevron rotation)
- Admin UI or visual editor for track info content
- Changes to sidebar, navigation, or any other components

## New Dependencies

None — all required packages (`isomorphic-dompurify`, `@tailwindcss/typography`, `lucide-react`) are already installed.

## Key Constraints

- Remains fully static (`output: "export"`) — no server runtime
- No changes to existing components (only new code + track layout modification)
- Must work with existing dark theme (slate palette)
- Must be responsive (mobile + desktop)
- If `info` is `null`, `undefined`, or empty string → section is not rendered at all

## Plan Structure

| File | Content |
|------|---------|
| `01-data-model.md` | `tracks.json` schema changes, `Track` type update, `data.ts` loader |
| `02-component-design.md` | `TrackInfoAccordion` component spec with full code |
| `03-integration.md` | Track layout changes, conditional rendering, i18n dictionary updates |
| `04-implementation-tasks.md` | Step-by-step TDD tasks with exact code and commands |
| `05-documentation-updates.md` | README.md and CLAUDE.md changes |
| `06-phase-summary.md` | Phase overview with dependencies and checklist |
