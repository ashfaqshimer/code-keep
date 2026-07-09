# Current Feature

Database + Prisma setup — stand up Prisma ORM against a Neon PostgreSQL
(serverless) database and land the initial schema. Spec:
`context/features/database-spec.md`.

## Status

Completed

## Goals

- Install and configure **Prisma 7** (breaking changes vs. training data — read
  the upgrade guide first: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7).
- Point `DATABASE_URL` at a **Neon** development branch; production runs on a
  separate branch.
- Model the initial schema from `context/project-overview.md`: `User`, `Item`,
  `ItemType`, `Collection`, `ItemCollection`, `Tag`, and the `ContentType` enum.
- Include the **NextAuth** models (`Account`, `Session`, `VerificationToken`).
- Add appropriate indexes and cascade deletes.
- Create the initial migration with `prisma migrate dev` (never `db push`).

## Notes

- **Migration policy (hard constraint):** always create migrations, run in dev
  then promote to prod. Never `prisma db push` or manually alter the DB unless
  explicitly told to.
- Schema is expected to evolve — this is the initial cut, not the final shape.
- Read Prisma 7 docs before scaffolding; confirm client output location, the
  `prisma.config.ts` / generator changes, and the datasource setup.
- Prisma quickstart reference:
  https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- Follow the DB section of `context/coding-standards.md`: `prisma migrate dev`
  for changes, `prisma migrate status` before committing, `prisma migrate
  deploy` on prod deploys.

## History

<!-- Keep this updated. Earliest to Latest -->

- **2026-07-07** — Initialized the project: set up docs and context files, configured the `origin` remote for the personal GitHub repo, and started tracking active work in `context/current-feature.md`.
- **2026-07-09** — Completed Dashboard UI Phase 1: initialized ShadCN UI (radix-nova preset, Lucide/Geist), added the `/dashboard` route with a nested layout, display-only top bar (search + New item), and placeholder Sidebar/Main areas; dark mode by default. Fixed the global font wiring so the app renders in Geist Sans / Geist Mono instead of the serif fallback. Build and lint pass; verified in the browser.
- **2026-07-09** — Completed Dashboard UI Phase 2: built the collapsible `AppSidebar` (ShadCN sidebar primitives) with the Library types (links to `/items/[plural]`, colored icons, counts, Pro locks on Files/Images), Favorites and Recent collections, and a user footer; added a `SidebarTrigger` to the top bar; off-canvas on desktop, Sheet drawer on mobile. Added a slug→icon/color map (`src/lib/item-type-meta.ts`) and rewrote the generated `use-mobile` hook to pass lint. Also fixed a regressed font issue: next/font variables were named `--font-geist-*`, but shadcn expects `--font-sans`/`--font-mono`, so the theme token resolved to a self-referential `var(--font-sans)` and fell back to Times — renamed them to restore Geist. Build and lint pass; verified end-to-end in a real browser (sidebar sections, links, toggle, mobile drawer, Geist rendering).
- **2026-07-09** — Completed Dashboard UI Phase 3: built the main content area in `src/app/dashboard/page.tsx` — a 4-tile stats row (total items, collections, favorite items, favorite collections), a Pinned section, a color-tinted Collections grid, and a 10-row Recent items list. Added five presentational components under `src/components/dashboard/` (`stat-card`, `section-header`, `item-card`, `collection-card`, `recent-item-row`) plus an `itemTypesBySlug` lookup in `item-type-meta.ts`. Expanded the `items` mock array from 5 → 12 (kept recency-ordered) so the recent list is populated. Stats mix sources (total items = sum of the sidebar's per-type counts; favorite items = count from the sample `items` array) — fine for mock, to reconcile once the DB lands. Build and lint pass; verified in a real browser against the reference screenshot, no console errors. Completes the 3-phase dashboard UI layout.
- **2026-07-09** — Completed Database + Prisma setup: installed Prisma 7.8 with the Neon serverless driver adapter (`@prisma/adapter-neon` + `@neondatabase/serverless`; chosen over `pg` for the serverless/edge connection model). Authored `prisma/schema.prisma` (new `prisma-client` generator → `src/generated/prisma`, ESM, `runtime = nodejs`) with the full data model — `User`/`Account`/`Session`/`VerificationToken` (Auth.js v5 shape, `User` carries `isPro` + Stripe fields + a `hashedPassword` for credentials auth), `Item`, `ItemType`, `Collection`, `ItemCollection`, `Tag`, and the `ContentType` enum — plus FK indexes and cascade deletes (`SetNull` on `Collection.defaultType`). Prisma 7 specifics: connection URL lives in `prisma.config.ts` (`datasource.url` via `env`; `url` is no longer allowed in the schema datasource block), `.env` is loaded by the config (Prisma no longer auto-loads it), and the generated client is git/eslint-ignored and rebuilt via a `postinstall` hook. Added `src/lib/prisma.ts` (HMR-safe `PrismaClient` singleton on the Neon adapter) and `db:*` npm scripts. Wired `DATABASE_URL` to the Neon dev branch and created/applied the initial migration (`20260709080341_init`); `prisma migrate status` reports in sync. Debugged a P1013 "scheme not recognized" that turned out to be a `ppostgresql://` typo in `.env`. Verified end-to-end: `prisma generate` ✓, lint ✓, `next build` ✓, and a runtime smoke test through the Neon adapter (live counts on the real DB). Migrations tracked in git; secrets stay in the ignored `.env`.
