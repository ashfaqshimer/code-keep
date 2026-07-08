# Current Feature

Dashboard UI Phase 2 — the collapsible sidebar. Builds out the left navigation
that phase 1 left as a placeholder. Spec: `context/features/dashboard-phase-2-spec.md`.

## Status

Completed

## Goals

- Collapsible sidebar (drawer icon to open/close on desktop; always a drawer on mobile)
- Library section: the item types with links to `/items/[type]` (e.g. `/items/snippets`),
  each showing its type color/icon and item count
- Favorite collections list
- Most recent collections list
- User avatar area pinned to the bottom
- Match the reference screenshot (`context/screenshots/dashboard-ui-main.png`)

## Notes

- Import data directly from `src/lib/mock-data.ts` (no DB yet): `itemTypes`,
  `collections`, `currentUser`. Favorites = `collections` where `isFavorite`;
  recent = ordered by `updatedLabel`.
- Replaces the sidebar placeholder in `src/app/dashboard/layout.tsx`.
- Type colors/icons are the seven fixed system types (Lucide icons); Files/Images
  are Pro-only and currently have count 0.
- Phase 3 (main area: stats, pinned items, recent collections/items) is out of scope here.

## History

<!-- Keep this updated. Earliest to Latest -->

- **2026-07-07** — Initialized the project: set up docs and context files, configured the `origin` remote for the personal GitHub repo, and started tracking active work in `context/current-feature.md`.
- **2026-07-09** — Completed Dashboard UI Phase 1: initialized ShadCN UI (radix-nova preset, Lucide/Geist), added the `/dashboard` route with a nested layout, display-only top bar (search + New item), and placeholder Sidebar/Main areas; dark mode by default. Fixed the global font wiring so the app renders in Geist Sans / Geist Mono instead of the serif fallback. Build and lint pass; verified in the browser.
- **2026-07-09** — Completed Dashboard UI Phase 2: built the collapsible `AppSidebar` (ShadCN sidebar primitives) with the Library types (links to `/items/[plural]`, colored icons, counts, Pro locks on Files/Images), Favorites and Recent collections, and a user footer; added a `SidebarTrigger` to the top bar; off-canvas on desktop, Sheet drawer on mobile. Added a slug→icon/color map (`src/lib/item-type-meta.ts`) and rewrote the generated `use-mobile` hook to pass lint. Also fixed a regressed font issue: next/font variables were named `--font-geist-*`, but shadcn expects `--font-sans`/`--font-mono`, so the theme token resolved to a self-referential `var(--font-sans)` and fell back to Times — renamed them to restore Geist. Build and lint pass; verified end-to-end in a real browser (sidebar sections, links, toggle, mobile drawer, Geist rendering).
