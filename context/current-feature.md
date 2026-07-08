# Current Feature

Dashboard UI Phase 1 — scaffold the dashboard layout (ShadCN setup, `/dashboard` route, top bar, and placeholder sidebar/main areas). Phase 1 of 3. See @context/features/dashboard-phase-1-spec.md.

## Status

In Progress

## Goals

- Initialize ShadCN UI and install required components
- Add dashboard route at `/dashboard`
- Build the main dashboard layout and any global styles
- Dark mode by default
- Top bar with search and a new-item button (display only)
- Placeholder sidebar and main area — just `h2` headings "Sidebar" and "Main" for now

## Notes

- Reference the dashboard screenshot: @context/screenshots/dashboard-ui-main.png
- Related specs: @context/features/dashboard-phase-2-spec.md, @context/features/dashboard-phase-3-spec.md
- Mock data lives in @src/lib/mock-data.ts

## History

<!-- Keep this updated. Earliest to Latest -->

- **2026-07-07** — Added the `origin` remote pointing at the personal GitHub repo and verified push access works. Corrected the remote host to match the existing personal SSH alias so git operations use the personal identity rather than the default one.
- **2026-07-07** — Created `context/current-feature.md` from the template and committed it to start tracking active work and history.
- **2026-07-08** — Started Dashboard UI Phase 1 from `context/features/dashboard-phase-1-spec.md`; set status to In Progress.
