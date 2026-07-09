# Current Feature

Dashboard items from the database — replace the dummy item data in the dashboard
main area (Pinned + Recent items) with real data fetched from Neon via Prisma.
Same layout and design; just sourced from the DB instead of
`src/lib/mock-data.ts`. Spec: `context/features/dashboard-items-spec.md`.

If there are no pinned items, the Pinned section shows nothing (already handled
by the page's conditional — the data just needs to reflect the DB).

## Status

Completed

## Goals

- Create `src/lib/db/items.ts` with the item data-fetching function(s), guarded
  with `server-only`, mirroring the shape of `src/lib/db/collections.ts`:
  - Pinned items for the demo user (`isPinned = true`).
  - Recent items for the demo user (newest-updated first, limited to
    `RECENT_ITEMS_LIMIT`).
- Fetch items directly in the dashboard server component (no client fetch, no
  API route).
- Shape each item for the existing `ItemCard` / `RecentItemRow` components:
  id, title, type slug (from `ItemType.name`), description, content, language,
  url, tags (from the `Tag` relation), isFavorite, isPinned, and a relative
  `updatedLabel` (reuse `formatRelativeTime`).
- Keep the item card icon/border color derived from the item type (already the
  case via `item-type-meta.ts`).
- Update the **item stats** — the Items tile and Favorite items tile — to use
  real DB counts instead of the mock `itemTypes` sum / mock `items` array.
- Keep the current design (reference `context/screenshots/dashboard-ui-main.png`).

## Notes

- No auth yet — scope queries to the seeded demo user (`demo@codekeep.io`), same
  as `collections.ts`.
- Introduce a `DashboardItem` type in `items.ts` (analogous to
  `DashboardCollection`) and point `ItemCard` / `RecentItemRow` at it; they
  currently import `ItemSummary` from `mock-data.ts`. Keep the field names
  compatible so the components need minimal change.
- The DB `ItemType.name` matches the existing `ItemTypeSlug` union; reuse
  `item-type-meta.ts` for icons/colors.
- Collections + collection stats already come from the DB (previous feature) —
  don't regress them. After this feature all four stat tiles + both sections are
  DB-backed; only the sidebar's per-type counts may remain mock (out of scope).
- Read-only feature — never `prisma db push` or hand-edit the DB.
- Follow the DB + Data Fetching sections of `context/coding-standards.md`.
- Verify with `npm run build` and in the browser against the screenshot before
  committing. Do not commit without permission.

## History

<!-- Keep this updated. Earliest to Latest -->

- **2026-07-07** — Initialized the project: set up docs and context files, configured the `origin` remote for the personal GitHub repo, and started tracking active work in `context/current-feature.md`.
- **2026-07-09** — Completed Dashboard UI Phase 1: initialized ShadCN UI (radix-nova preset, Lucide/Geist), added the `/dashboard` route with a nested layout, display-only top bar (search + New item), and placeholder Sidebar/Main areas; dark mode by default. Fixed the global font wiring so the app renders in Geist Sans / Geist Mono instead of the serif fallback. Build and lint pass; verified in the browser.
- **2026-07-09** — Completed Dashboard UI Phase 2: built the collapsible `AppSidebar` (ShadCN sidebar primitives) with the Library types (links to `/items/[plural]`, colored icons, counts, Pro locks on Files/Images), Favorites and Recent collections, and a user footer; added a `SidebarTrigger` to the top bar; off-canvas on desktop, Sheet drawer on mobile. Added a slug→icon/color map (`src/lib/item-type-meta.ts`) and rewrote the generated `use-mobile` hook to pass lint. Also fixed a regressed font issue: next/font variables were named `--font-geist-*`, but shadcn expects `--font-sans`/`--font-mono`, so the theme token resolved to a self-referential `var(--font-sans)` and fell back to Times — renamed them to restore Geist. Build and lint pass; verified end-to-end in a real browser (sidebar sections, links, toggle, mobile drawer, Geist rendering).
- **2026-07-09** — Completed Dashboard UI Phase 3: built the main content area in `src/app/dashboard/page.tsx` — a 4-tile stats row (total items, collections, favorite items, favorite collections), a Pinned section, a color-tinted Collections grid, and a 10-row Recent items list. Added five presentational components under `src/components/dashboard/` (`stat-card`, `section-header`, `item-card`, `collection-card`, `recent-item-row`) plus an `itemTypesBySlug` lookup in `item-type-meta.ts`. Expanded the `items` mock array from 5 → 12 (kept recency-ordered) so the recent list is populated. Stats mix sources (total items = sum of the sidebar's per-type counts; favorite items = count from the sample `items` array) — fine for mock, to reconcile once the DB lands. Build and lint pass; verified in a real browser against the reference screenshot, no console errors. Completes the 3-phase dashboard UI layout.
- **2026-07-09** — Completed Database + Prisma setup: installed Prisma 7.8 with the Neon serverless driver adapter (`@prisma/adapter-neon` + `@neondatabase/serverless`; chosen over `pg` for the serverless/edge connection model). Authored `prisma/schema.prisma` (new `prisma-client` generator → `src/generated/prisma`, ESM, `runtime = nodejs`) with the full data model — `User`/`Account`/`Session`/`VerificationToken` (Auth.js v5 shape, `User` carries `isPro` + Stripe fields + a `hashedPassword` for credentials auth), `Item`, `ItemType`, `Collection`, `ItemCollection`, `Tag`, and the `ContentType` enum — plus FK indexes and cascade deletes (`SetNull` on `Collection.defaultType`). Prisma 7 specifics: connection URL lives in `prisma.config.ts` (`datasource.url` via `env`; `url` is no longer allowed in the schema datasource block), `.env` is loaded by the config (Prisma no longer auto-loads it), and the generated client is git/eslint-ignored and rebuilt via a `postinstall` hook. Added `src/lib/prisma.ts` (HMR-safe `PrismaClient` singleton on the Neon adapter) and `db:*` npm scripts. Wired `DATABASE_URL` to the Neon dev branch and created/applied the initial migration (`20260709080341_init`); `prisma migrate status` reports in sync. Debugged a P1013 "scheme not recognized" that turned out to be a `ppostgresql://` typo in `.env`. Verified end-to-end: `prisma generate` ✓, lint ✓, `next build` ✓, and a runtime smoke test through the Neon adapter (live counts on the real DB). Migrations tracked in git; secrets stay in the ignored `.env`.
- **2026-07-09** — Completed Dashboard collections from the database: added `src/lib/db/collections.ts` (`getDashboardCollections()`, guarded with `server-only`) that fetches the demo user's collections newest-updated-first and derives per-card fields — `itemCount` (from the `ItemCollection` join), a relative `updatedLabel` (new `formatRelativeTime` in `utils.ts`), the dominant/most-used type, and the distinct types present (ordered by frequency). The dashboard page (`src/app/dashboard/page.tsx`) is now an async server component that fetches directly and drives the Collections + Favorite-collections stats and section count from the DB (Pinned/Recent items still mock, out of scope); added `export const dynamic = "force-dynamic"` so data renders per request rather than being baked in at build. Rebuilt `CollectionCard` to derive its border color from the dominant type (`--type-color` var + `color-mix`, hover intensify) and show a small colored icon for every type in the collection. Notable infra fix: changed the Prisma generator `importFileExtension` from `"js"` → `"ts"` — the `"js"` value broke `next build` (Turbopack couldn't resolve the generated client's `.js` imports to their `.ts` files); it was never exercised before because this feature is the first to pull the generated client into the build graph. Added the `server-only` dependency. Verified: lint ✓, `next build` ✓ (`/dashboard` dynamic), and in-browser the 5 real collections render with correct item counts (3/3/4/4/4), live "Updated" labels, dominant-type borders, and multi-type icon rows; stats show Collections 5 / Favorite collections 2.
- **2026-07-09** — Completed Seed data: added `prisma/seed.ts` (run via `prisma db seed` → new `db:seed` npm script; wired through Prisma 7's `migrations.seed` in `prisma.config.ts`). Installed `bcryptjs` (+ `@types/bcryptjs`) and seeded a demo user (`demo@codekeep.io`, password hashed at 12 rounds, `isPro: false`, `emailVerified: now`), the 7 system item types (Lucide icon names + spec colors, `isSystem: true`), and 5 collections with 18 sample items linked via the `ItemCollection` join (React Patterns ×3, AI Workflows ×3, DevOps ×4, Terminal Commands ×4, Design Resources ×4) — each with real content/URLs, `contentType` mapped per type (TEXT/URL), languages on snippets/commands, and a couple pinned/favorite. Seed is idempotent: it deletes the demo user (cascading their items/collections) and the system types up front, then recreates — system types can't be upserted by their `(userId, name)` unique because `userId` is null, so a delete-then-create reset was used instead. Verified: two consecutive runs held counts at 1 user / 7 types / 5 collections / 18 items (via `db:test`), lint ✓, `next build` ✓.
- **2026-07-09** — Completed Dashboard items from the database: added `src/lib/db/items.ts` (`server-only`, mirroring `collections.ts`) with `getPinnedItems()`, `getRecentItems(limit)`, and `getItemStats()` — all scoped to the seeded demo user via a shared `select` + `toDashboardItem` mapper that shapes each row into a new `DashboardItem` type (type slug from `ItemType.name`, tags from the `Tag` relation, relative `updatedLabel` via `formatRelativeTime`, nullable DB columns coerced to `undefined`). Repointed `ItemCard` and `RecentItemRow` from the mock `ItemSummary` to `DashboardItem` (field-compatible, no markup changes). The dashboard page now fetches collections + pinned + recent + item stats in parallel with `Promise.all`, and the Items + Favorite items stat tiles are DB-backed (previously the mock `itemTypes` sum / mock `items` array); Collections stats stay DB-backed from the prior feature. Empty-pinned is handled by the existing page conditional. `mock-data.ts` still backs the sidebar's per-type counts (out of scope). Verified: lint ✓, `next build` ✓ (`/dashboard` dynamic), and in-browser the live data matches the seed exactly — 18 Items / 5 Collections / 0 Favorite items (seed favorites only collections) / 2 Favorite collections, 2 pinned items (useDebounce, Code review prompt), real collection cards and recent list.
