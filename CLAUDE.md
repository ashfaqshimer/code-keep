# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Next.js 16 has breaking changes

This repo uses **Next.js 16 / React 19**. APIs, conventions, and file structure differ from older versions in your training data. Before writing framework code, read the relevant guide in `node_modules/next/dist/docs/` (App Router docs live under `01-app/`). Heed deprecation notices.

# CodeKeep

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

```bash
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test runner configured yet.

## Conventions

- **App Router** only, under `src/app/`. `layout.tsx` is the root shell; it wires Geist fonts to `--font-geist-sans` / `--font-geist-mono` CSS variables and sets `min-h-full flex flex-col` on `<body>`.
- Import alias: `@/*` maps to `./src/*`.
- **Tailwind CSS v4** via `@tailwindcss/postcss` — configured entirely in `src/app/globals.css` with `@import "tailwindcss"` (no `tailwind.config.js`). Theme tokens go in `@theme` blocks in that file.
- TypeScript `strict` mode is on.

## What this project is

CodeKeep is a searchable, AI-enhanced hub for developer essentials (code snippets, prompts, notes, commands, links, files). The full product spec — data model, features, freemium tiers, UI/UX direction — lives in `docs/project-spec.md`. **Read it before building features**; the summary below covers only the load-bearing constraints.

The codebase is currently near-boilerplate (only `layout.tsx`, `page.tsx`, `globals.css`). The intended stack from the spec, not yet installed:

- **DB/ORM**: Neon PostgreSQL + Prisma 7. Core entities: `Item`, `ItemType`, `Collection`, `ItemCollection` (join — an item belongs to many collections), `Tag`, `User` (extends NextAuth, carries Stripe + `isPro` fields).
- **Auth**: NextAuth v5 (email/password + GitHub OAuth).
- **Files**: Cloudflare R2. **AI**: OpenAI (`gpt-5-nano`). **UI**: ShadCN UI on Tailwind v4.

### Hard constraints from the spec

- **Never** run `prisma db push` or mutate DB structure directly. Schema changes go through migrations, run in dev then prod.
- The seven system item types (`snippet`, `prompt`, `note`, `command`, `file`, `image`, `link`) are fixed and non-editable; users may add custom types later. Each type has a defined color/icon (see spec). Item URLs follow `/items/<type>` (e.g. `/items/snippets`).
- Build the freemium foundation (free vs. pro limits, `isPro` gating), but during development all users get all features.
- Dark mode is the default; light mode optional.
