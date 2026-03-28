# UI Design System

## Theme: Motorsport Dark

A dark-themed design inspired by professional racing timing screens. Clean, data-focused, with accent colors for visual hierarchy.

## Color Palette

```
Background:
  --bg-primary:    slate-950  (#020617)    Page background
  --bg-secondary:  slate-900  (#0f172a)    Sidebar, card backgrounds
  --bg-tertiary:   slate-800  (#1e293b)    Table rows (alt), hover states

Text:
  --text-primary:  slate-50   (#f8fafc)    Headings, driver names
  --text-secondary: slate-400 (#94a3b8)    Labels, secondary info
  --text-muted:    slate-500  (#64748b)    Timestamps, metadata

Accent:
  --accent-primary:  red-500  (#ef4444)    Active tab, primary action
  --accent-hover:    red-400  (#f87171)    Hover states
  --accent-subtle:   red-500/10            Background tint for active items

Podium:
  --gold:    amber-400   (#fbbf24)          1st place
  --silver:  slate-300   (#cbd5e1)          2nd place
  --bronze:  orange-400  (#fb923c)          3rd place

Status:
  --positive: emerald-400  (#34d399)        Improved time
  --neutral:  slate-400    (#94a3b8)        No change
```

## Typography

```
UI Text:     Geist Sans (next/font/google or next/font/local)
Lap Times:   Geist Mono (monospace — ensures digit alignment)

Sizes:
  Page title:     text-2xl font-bold
  Section title:  text-lg font-semibold
  Tab label:      text-sm font-medium
  Table header:   text-xs font-medium uppercase tracking-wider text-slate-400
  Table cell:     text-sm
  Lap time:       text-sm font-mono tabular-nums
  Timestamp:      text-xs text-slate-500
```

## Layout

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────────────────────┐ │
│  │          │  │  Track Name                      │ │
│  │ SIDEBAR  │  ├──────────────────────────────────┤ │
│  │          │  │  [Stock] [Modified] [Open]       │ │
│  │ Tracks:  │  ├──────────────────────────────────┤ │
│  │ • Track1 │  │  ▸ Rules for this class          │ │
│  │ • Track2 │  ├──────────────────────────────────┤ │
│  │ • Track3 │  │  # │ Driver │ Car │ Best │ 3Laps │ │
│  │          │  │  1 │ Daniel │ ... │ 8.42 │ 26.45 │ │
│  │          │  │  2 │ Max    │ ... │ 8.61 │  --   │ │
│  │          │  │  3 │ Sarah  │ ... │ 8.73 │ 26.89 │ │
│  │          │  │    │        │     │      │       │ │
│  └──────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Desktop (lg: 1024px+)
- Sidebar: fixed, 256px wide, full height
- Main content: flex-1, scrollable

### Tablet (md: 768px)
- Sidebar: hidden by default, toggle with hamburger
- Main content: full width

### Mobile (sm: < 768px)
- Sidebar: off-canvas drawer from left with backdrop overlay
- Table: horizontal scroll with sticky first column (position + driver)
- Tabs: horizontal scroll if many classes

## Sidebar Design

```
┌────────────────┐
│  🏁 Mini-Z     │  Logo/title area
│  Leaderboard   │
├────────────────┤
│                │
│  TRACKS        │  Section label (text-xs uppercase tracking-wider text-slate-500)
│                │
│  ● Hobby Carpet│  Active: bg-red-500/10 border-l-2 border-red-500 text-white
│    RCP Mini 96 │  Inactive: text-slate-400 hover:text-slate-200 hover:bg-slate-800
│    Big Track   │
│                │
└────────────────┘
```

- Background: `bg-slate-900`
- Border right: `border-r border-slate-800`
- Each track is a `<Link>` to `/tracks/{slug}/{firstClassSlug}`
- Active track determined by current URL path

## Class Tabs

```
  ┌────────┐  ┌──────────┐  ┌────────┐
  │ Stock  │  │ Modified │  │  Open  │
  └────────┘  └──────────┘  └────────┘
  ━━━━━━━━━   ──────────    ────────
  (active)    (inactive)    (inactive)
```

- Style: underline tabs
- Active: `text-white border-b-2 border-red-500`
- Inactive: `text-slate-400 hover:text-slate-300 border-b-2 border-transparent`
- Each tab is a `<Link>` to `/tracks/{trackSlug}/{classSlug}`
- Wrap in `overflow-x-auto` for mobile scroll

## Rules Accordion

```
  ┌─────────────────────────────────────┐
  │  ▸ Class Rules                      │   Collapsed (default)
  └─────────────────────────────────────┘

  ┌─────────────────────────────────────┐
  │  ▾ Class Rules                      │   Expanded
  ├─────────────────────────────────────┤
  │  Stock motors only. No modifica-    │
  │  tions to the chassis allowed...    │
  └─────────────────────────────────────┘
```

- Use HTML `<details>/<summary>` for zero-JS progressive enhancement
- Style with Tailwind: `bg-slate-900 rounded-lg border border-slate-800`
- Chevron rotates on open via CSS `open:rotate-90`
- Collapsed by default

## Leaderboard Table

```
  #  │ Driver      │ Car Model        │ Best Laptime ▼  │ 3 Consecutive Laps │ Updated
  ───┼─────────────┼──────────────────┼─────────────────┼────────────────────┼─────────
  🥇 │ Daniel      │ Rima Raptor Evo  │ 8.425           │ 26.459             │ Mar 27
  🥈 │ Max         │ Kyosho MR-04     │ 8.612           │ —                  │ Mar 25
  🥉 │ Sarah       │ GL Racing GLA    │ 8.731           │ 26.891             │ Mar 24
  4  │ Tom         │ Atomic AMZ       │ 8.844           │ 27.102             │ Mar 22
```

### Table Features

- **Sortable columns**: Click "Best Laptime" or "3 Consecutive Laps" header to sort
- **Sort indicator**: Arrow icon (▲/▼) on active sort column
- **Default sort**: From track config > class config > `bestLaptime`
- **Null handling**: `null` lap times display as "—" and sort to bottom
- **Position medals**: Top 3 get gold/silver/bronze position badges
- **Row hover**: `hover:bg-slate-800/50` subtle highlight
- **Alternating rows**: `even:bg-slate-900/50`
- **Monospace times**: `font-mono tabular-nums` for aligned digits
- **Sticky header**: `sticky top-0 bg-slate-950` for scroll
- **Responsive**: Horizontal scroll wrapper on mobile, driver column sticky

### Time Formatting

- Display as provided (e.g., `8.425`, `26.459`)
- Always show 3 decimal places: `time.toFixed(3)`
- Null values: display as em dash `—`

### Updated Column

- Show the most recent of `updatedBestLaptime` and `updatedThreeConsecutiveLaps`
- Format as relative or short date: "Mar 27"
- Use `text-xs text-slate-500`
