# BHCMarkets

An industrial-grade, full‑stack trading platform monorepo. It includes:

- Web apps: user platform (`apps/platform`), marketing site (`apps/web`), admin dashboard (`apps/admin`), and docs (`apps/docs`).
- Backend services under `packages/` (API, worker, utils, database schema, UI library, shared types).
- Shared tooling via Turborepo, ESLint flat config, and TypeScript project references.

This repo aims for a transparent, annotated buildout: we document the “why” and the “what” as we go. See `docs/` for architecture notes and decisions.

## Prerequisites

- Node.js 18+ (20+ recommended)
- Bun 1.3+ (we standardize on Bun for workspaces and scripts)
- Git

Optional for local infra:
- Docker + Docker Compose (for Postgres/Redis)

## Getting started

Install dependencies at the root:

```bash
bun install
```

Run all apps in dev (concurrently via Turborepo):

```bash
bun run dev
```

Run a specific app, e.g. platform:

```bash
cd apps/platform
bun run dev
```

Type checking and linting:

```bash
bun run check-types
bun run lint
```

Format code:

```bash
bun run format
```

## Local services (optional)

We provide a basic `docker-compose.yml` with Postgres and Redis for local development:

```bash
docker compose up -d
```

Database DDL/seed lives under `packages/database/seed/schema.sql`.

## Project structure

High-level overview is in `docs/architecture.md`. A short version:

- `apps/*` — deployable frontends (Vite/React, Next.js for docs)
- `packages/backend` — Node HTTP API bootstrap (will evolve to Fastify/Express)
- `packages/worker` — background jobs (BullMQ-like pattern planned)
- `packages/ui` — shared UI library (styled-components)
- `packages/types` — shared TypeScript domain types
- `packages/utils` — cross-cutting helpers
- `packages/database` — schema and migrations

## Decisions and standards

- We use Bun as the package manager to speed up installs and scripts. See `docs/decisions/0001-choose-bun-monorepo.md`.
- Flat ESLint config lives in `packages/eslint-config/*`; apps/packages extend it.
- TypeScript base config is in `packages/typescript-config/*`.
- CI runs lint and type checks on PRs. See `.github/workflows/ci.yml`.

## Contributing

Please read `CONTRIBUTING.md` for branching, commit style, and PR expectations, and `CODE_OF_CONDUCT.md` for community guidelines.

## Roadmap (excerpt)

- Implement domain repositories (Accounts, Orders, Trades, Ledger) backed by Postgres
- Real-time market data ingestion and WS broadcasting
- Order lifecycle, risk checks, and PnL computation
- Admin observability (metrics, audit logs) and RBAC
