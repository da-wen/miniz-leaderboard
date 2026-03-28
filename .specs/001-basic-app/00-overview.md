# Mini-Z Leaderboard - Implementation Plan Overview

## Project Summary

A static website for displaying best lap times for Mini-Z RC cars, built with Next.js App Router and deployed to GitHub Pages. All data is file-based (JSON) — no database, no server runtime.

## Plan Structure

| File | Content |
|------|---------|
| `01-data-model.md` | JSON data model, file structure, type definitions |
| `02-architecture.md` | Next.js App Router architecture, project structure, routing |
| `03-ui-design.md` | UI/UX design system, component hierarchy, responsive patterns |
| `04-components.md` | Detailed component specs with props, behavior, and implementation notes |
| `05-implementation-tasks.md` | Step-by-step implementation tasks with exact code |
| `06-deployment.md` | GitHub Pages deployment guide with GitHub Actions workflow |
| `07-readme.md` | README content for the repository |

## Tech Stack

- **Framework**: Next.js 15+ (App Router, `output: 'export'`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Geist Sans (UI) + Geist Mono (lap times)
- **Deployment**: GitHub Pages via GitHub Actions

## Key Constraints

- Fully static site — no server runtime, no API routes, no database
- All data in JSON files under `data/` directory
- Only data files and code files are modified during normal operation
- Must work on GitHub Pages with subpath hosting (`/repo-name/`)
- `params` is a Promise in Next.js 15+ (must be awaited)
