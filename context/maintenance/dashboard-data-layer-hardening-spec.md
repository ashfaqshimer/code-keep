# Dashboard Data-Layer Hardening Spec

## Overview

A maintenance pass addressing the four **medium** warnings surfaced by the
`code-scanner` audit of the dashboard data layer. These are not new product
features — the dashboard already works and is DB-backed — this tightens the
`src/lib/db/*` fetch layer for **efficiency** (fewer redundant DB round-trips)
and **resilience/security** (graceful failure UI, no hardcoded credential).
Same layout/design; no visible change on the happy path.

## Requirements

### 1. Deduplicate per-request DB round-trips (performance)

A single `/dashboard` request currently issues ~6 identical "find demo user"
lookups and runs `getDashboardCollections()` twice.

- Resolve the demo user **once per request**: wrap the
  `prisma.user.findUnique({ where: { email: DEMO_EMAIL } })` lookup in React's
  `cache()` (from `react`) so repeated calls within the same request dedupe.
  Applies to every function in `src/lib/db/collections.ts` and
  `src/lib/db/items.ts` that currently looks the user up independently.
- Fetch `getDashboardCollections()` **once** — either fetch it in
  `src/app/dashboard/layout.tsx` and pass it into `AppSidebar`, or wrap the
  function itself in `cache()` — instead of calling it from both
  `AppSidebar` (`src/components/dashboard/app-sidebar.tsx`) and the dashboard
  page (`src/app/dashboard/page.tsx`).

### 2. Aggregate per-type counts in the database (performance)

`getItemTypeCounts()` in `src/lib/db/items.ts` currently loads **every** item
row for the user (`findMany`, no `take`) and tallies per type in JavaScript.

- Replace with a DB-side aggregate:
  `prisma.item.groupBy({ by: ["itemTypeId"], where: { userId }, _count: true })`,
  joined to `ItemType.name` to key the result by `ItemTypeSlug`.
- Preserve the existing contract: return a `Record<ItemTypeSlug, number>` with
  all seven system slugs present (default 0 via the shared `emptyTypeCounts()`).

### 3. Add error & loading UI (correctness / resilience)

There is no `error.tsx` or `loading.tsx` anywhere under `src/app`, and the
`src/lib/db/*` fetch functions do not guard their Prisma calls. With
`/dashboard` being `force-dynamic` and doing several sequential round-trips, a
transient Neon error or cold-start surfaces as an unstyled default error page
or a blank screen — contradicting the coding-standards error-handling guidance
and the spec's "loading skeletons" requirement.

- Add `src/app/dashboard/loading.tsx` — a skeleton matching the stat-tile row,
  Pinned section, and collections grid (reuse the existing skeleton primitive
  if present).
- Add `src/app/dashboard/error.tsx` — a styled, dark-mode error boundary with a
  retry (`reset()`) action.
- Keep the `db/*` helpers throwing so the boundary catches them; do not swallow
  errors into empty results.

### 4. Remove the hardcoded seed credential (security)

`prisma/seed.ts` hardcodes `const DEMO_PASSWORD = "12345678";`, committed to the
repo. Harmless while auth is unshipped, but a known working login the moment
credentials auth lands — and dangerous if the seed is ever pointed at a shared
or production database.

- Read the demo password from an env var (e.g. `SEED_DEMO_PASSWORD`) with a
  clearly-labeled dev fallback, and/or guard the seed to refuse to run when
  `NODE_ENV === "production"`.
- Add a comment noting the seed must never target a production `DATABASE_URL`.

## Notes

- No auth yet — all queries stay scoped to the seeded demo user
  (`demo@codekeep.io`), same as the current `collections.ts` / `items.ts`.
- Read-only feature — never `prisma db push` or hand-edit the DB. The seed
  change only touches how the password value is sourced, not the schema.
- Do not regress the DB-backed dashboard (stats, Pinned, Recent, Collections,
  sidebar Library/Favorites/Recent) — behavior on the happy path must be
  identical.
- Follow the DB + Data Fetching + Error Handling sections of
  `context/coding-standards.md`.
- Verify with `npm run build` (and lint), and in the browser confirm the
  dashboard renders identically and the loading/error states appear. Do not
  commit without permission.

## References

- Audit source: `code-scanner` findings (medium warnings) on the dashboard data
  layer.
- `src/lib/db/collections.ts`, `src/lib/db/items.ts`
- `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`
- `src/components/dashboard/app-sidebar.tsx`
- `prisma/seed.ts`
- `context/coding-standards.md` (Database, Data Fetching, Error Handling)
