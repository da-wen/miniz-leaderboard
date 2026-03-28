# Component Specifications

## Component Tree

```
RootLayout (Server)
├── Sidebar (Server)
│   └── TrackLink × N
├── MobileNav (Client)
│   └── Sidebar (reused)
└── {children}
    └── TrackLayout (Server)
        ├── Track Title
        ├── ClassTabs (Server)
        │   └── TabLink × N
        └── {children}
            └── ClassPage (Server)
                ├── RulesAccordion (Server — uses <details>)
                └── LeaderboardTable (Client)
                    ├── SortableHeader
                    ├── DriverRow × N
                    │   ├── PositionBadge
                    │   └── LapTime × 2
                    └── EmptyState
```

---

## 1. RootLayout (`src/app/layout.tsx`) — Server Component

**Responsibility**: HTML shell, global styles, sidebar, mobile nav.

```tsx
// Reads: getTracks()
// Renders: <html>, <body>, Sidebar, MobileNav, {children}
// Font: Geist Sans + Geist Mono via next/font

export default function RootLayout({ children }) {
  const tracks = getTracks();
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-950 text-slate-50`}>
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-900">
            <Sidebar tracks={tracks} />
          </aside>
          {/* Mobile nav */}
          <MobileNav tracks={tracks} />
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

---

## 2. Sidebar (`src/components/Sidebar.tsx`) — Server Component

**Props**:
```typescript
interface SidebarProps {
  tracks: Track[];
}
```

**Behavior**:
- Renders app title/logo at top
- Lists all tracks as navigation links
- Each link goes to `/tracks/{trackSlug}/{firstClassSlug}`
- Active state: highlight current track based on URL (needs `usePathname` — either make this a Client Component wrapper, or pass `activeTrackSlug` as prop)

**Implementation note**: Since active state needs `usePathname()`, create a thin Client Component wrapper `SidebarNav` that handles active state, while the sidebar shell stays Server.

---

## 3. MobileNav (`src/components/MobileNav.tsx`) — Client Component

**Props**:
```typescript
interface MobileNavProps {
  tracks: Track[];
}
```

**Behavior**:
- Visible only on mobile/tablet (`lg:hidden`)
- Fixed top bar with hamburger button and app title
- Click hamburger: slide-in drawer from left with backdrop
- Drawer contains same Sidebar content
- Close on: backdrop click, close button, link click
- Close on route change via `usePathname()` in `useEffect`

**State**: `const [isOpen, setIsOpen] = useState(false)`

---

## 4. TrackLayout (`src/app/tracks/[trackSlug]/layout.tsx`) — Server Component

**Responsibility**: Track title + class tabs wrapper.

```tsx
export default async function TrackLayout({ children, params }) {
  const { trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);
  const classes = getClasses();
  const trackClasses = track.classes.map(tc =>
    classes.find(c => c.slug === tc.classSlug)!
  );

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">{track.name}</h1>
      <ClassTabs trackSlug={trackSlug} classes={trackClasses} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
```

Also needs `generateStaticParams` returning all track slugs.

---

## 5. ClassTabs (`src/components/ClassTabs.tsx`) — Server Component

**Props**:
```typescript
interface ClassTabsProps {
  trackSlug: string;
  classes: RacingClass[];
}
```

**Renders**: Horizontal tab bar with underline style. Each tab is a `<Link>`. Active state needs `usePathname()` — same pattern as Sidebar, thin Client wrapper for active state detection.

---

## 6. TrackPage (`src/app/tracks/[trackSlug]/page.tsx`) — Server Component

**Responsibility**: Redirect to the first class of this track.

```tsx
import { redirect } from "next/navigation";

export default async function TrackPage({ params }) {
  const { trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);
  const firstClass = track.classes[0].classSlug;
  redirect(`/tracks/${trackSlug}/${firstClass}`);
}
```

Also needs `generateStaticParams`.

**Note**: `redirect()` works with static export — it generates a meta refresh or client-side redirect.

---

## 7. ClassPage (`src/app/tracks/[trackSlug]/[classSlug]/page.tsx`) — Server Component

**Responsibility**: Rules accordion + leaderboard table for a specific track+class.

```tsx
export default async function ClassPage({ params }) {
  const { trackSlug, classSlug } = await params;
  const racingClass = getClassBySlug(classSlug);
  const results = getResults(trackSlug, classSlug);
  const defaultSort = getDefaultSort(trackSlug, classSlug);

  return (
    <>
      <RulesAccordion rules={racingClass.rules} className={racingClass.name} />
      <LeaderboardTable entries={results} defaultSort={defaultSort} />
    </>
  );
}
```

Needs `generateStaticParams` returning all `{trackSlug, classSlug}` combos.

---

## 8. RulesAccordion (`src/components/RulesAccordion.tsx`) — Server Component

**Props**:
```typescript
interface RulesAccordionProps {
  rules: string;
  className: string;
}
```

**Implementation**: Uses native `<details>/<summary>` — no JS needed.

```tsx
export function RulesAccordion({ rules, className }: RulesAccordionProps) {
  return (
    <details className="group mb-6 rounded-lg border border-slate-800 bg-slate-900">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        {className} Rules
      </summary>
      <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">
        {rules}
      </div>
    </details>
  );
}
```

---

## 9. LeaderboardTable (`src/components/LeaderboardTable.tsx`) — Client Component

**Props**:
```typescript
interface LeaderboardTableProps {
  entries: LapTimeEntry[];
  defaultSort: SortField;
}
```

**State**:
```typescript
const [sortField, setSortField] = useState<SortField>(defaultSort);
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
```

**Behavior**:
- Sort entries by `sortField` in `sortDirection`
- Null values sort to bottom always
- Click column header to toggle: set as active sort → toggle direction
- Display position numbers 1-N based on sorted order
- Top 3 get medal styling (gold/silver/bronze)
- Times displayed in monospace with 3 decimal places
- Null times show as "—"
- Updated column shows most recent update date, formatted as short date

**Sort logic**:
```typescript
const sorted = useMemo(() => {
  return [...entries].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    // Nulls always last
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
  });
}, [entries, sortField, sortDirection]);
```

**Empty state**: If no entries, show a message like "No lap times recorded yet."

---

## 10. LapTime (`src/components/LapTime.tsx`) — Server Component

**Props**:
```typescript
interface LapTimeProps {
  time: number | null;
}
```

**Renders**:
```tsx
export function LapTime({ time }: LapTimeProps) {
  if (time === null) {
    return <span className="text-slate-600">—</span>;
  }
  return <span className="font-mono tabular-nums">{time.toFixed(3)}</span>;
}
```

---

## 11. HomePage (`src/app/page.tsx`) — Server Component

**Responsibility**: Redirect to first track's first class.

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  const tracks = getTracks();
  const firstTrack = tracks[0];
  const firstClass = firstTrack.classes[0].classSlug;
  redirect(`/tracks/${firstTrack.slug}/${firstClass}`);
}
```
