# AGENTS.md

This file provides guidance to AI coding agents (Codex, Gemini CLI, Cursor,
Claude Code, and others) when working with code in this repository.

## Keeping this file current

After making any change that affects something documented here (commands,
architecture, env vars, tooling, directory layout, conventions), re-read this
file and update it so it stays accurate. Treat AGENTS.md as part of the change:
if your work makes a statement here outdated, fix it in the same effort. The
same applies to `CLAUDE.md`, which mirrors this content — keep the two in sync.

## Repository layout

This is a personal website. Two top-level areas matter:

- `app/` — the Next.js application. **All build/lint/dev commands run from here**,
  not the repo root.
- `content/article/` — MDX blog posts, read at build/request time by `app/`
  via `../content/article` (one level up from the app's cwd). This directory is
  not part of `app/` and lives at the repo root.
- `docs/` — project docs. `docs/design.md` is the authoritative brand & design
  system (see below).

## Commands

This project uses **Bun exclusively** (`bun@1.2.19`) — do not use npm/yarn/pnpm.
Run everything from `app/`:

```bash
bun install            # install deps (CI uses --frozen-lockfile)
bun dev                # start Next.js dev server
bun run build          # production build
bun run start          # serve the production build
bun run lint           # biome check (lint + import sorting), read-only
bun run lint:fix       # biome check --write (autofix)
bun run format         # biome format --write
```

There is no test framework configured.

## Tooling conventions

- **Biome** handles both linting and formatting (the project migrated off
  ESLint/Prettier). Config: `app/biome.json`. Style: 2-space indent, double
  quotes, semicolons always, trailing commas, 80-char line width, organize-imports
  on. CI (`.github/workflows/biome.yml`) runs `biome format` + `biome check` on
  pushes/PRs to `main`. A pre-commit hook (`.pre-commit-config.yaml`) runs
  `biome check --write` on files under `app/`.
- **TypeScript** strict mode. Path alias `@/*` → `app/src/*`.
- **shadcn/ui** (new-york style, zinc base, `app/components.json`) for primitives
  in `src/components/ui/`. Tailwind CSS v3 (`tailwind.config.ts`).

## Architecture

Next.js 16 App Router, React 19, React Server Components by default
(`src/app/`). Notable subsystems:

- **Articles** (`src/lib/article.ts`, `src/app/article/`): MDX files in
  `content/article/*.mdx` are parsed with `gray-matter` (frontmatter: `title`,
  `date`, `description`, `bannerImage`, `draft`) and rendered with
  `next-mdx-remote`. `reading-time` computes read estimates; rehype plugins
  (`rehype-slug`, `rehype-autolink-headings`, `rehype-highlight`) handle headings
  and code. Drafts are excluded unless explicitly requested. MDX components live
  in `src/components/mdx/`.

- **CV** (`src/lib/cv.ts`, `src/app/cv/`): `cv.ts` holds the CV content as
  isomorphic data (no React, no node-only imports) so it can be consumed by both
  the client-rendered page (`/cv`) and the server-side PDF renderer
  (`/cv/pdf/route.ts`, using `@react-pdf/renderer` via
  `src/components/CvDocument.tsx`). `next.config.ts` bundles `public/fonts/**`
  into the `/cv/pdf` function so fonts are readable at runtime.

- **Analytics** (`src/app/api/analytics/route.ts`, `src/app/analytics/`,
  `src/hooks/useAnalytics.ts`): a self-hosted page-view tracker backed by
  MongoDB. `POST` records/updates visits (with user-agent parsing and IP→country
  lookup); `GET` returns aggregated stats and is gated behind a bearer token
  (`ANALYTICS_PASSWORD`). The Mongo client (`src/lib/mongodb.ts`) is a cached
  singleton (reused across hot reloads in dev).

- **GitHub stats / projects** (`src/lib/fetchRepos.ts`,
  `src/app/api/github/stats/`, `src/app/projects/`): fetches repos/contributors
  from the GitHub API for the projects page.

### Environment variables

Used across the app (none committed):
`MONGODB_URI`, `MONGODB_DB_NAME` (default `personal-website`),
`MONGODB_COLLECTION_NAME` (default `analytics`), `ANALYTICS_PASSWORD`,
`GITHUB_API_KEY`. Note `app/const.ts` is git-ignored (local-only config).

## Design system (important)

`docs/design.md` is the single source of truth for the brand. Any UI work must
match it; the landing page (`src/components/LandingPage.tsx`) is the reference
implementation. Key non-negotiables: warm cream "paper" background with near-black
ink, **no dark mode**, monochrome with a single electric-blue accent (`#373CE0`)
used sparingly, oversized serif display type, minimal boxes/borders/shadows,
spring-physics motion, and the bespoke velocity-reactive cursor
(`src/components/Cursor.tsx`). Use the `--brand-*` CSS variables, never hardcode
colors. Read `docs/design.md` before making visual changes.
