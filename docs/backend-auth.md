# Backend Authentication Overview

This document explains how the current authentication slice of the platform is organised so new contributors can trace the flow end‑to‑end without spelunking through the repo.

## Folder layout

- `packages/backend/src/config/env.ts`
  - Reads environment variables once at boot, applies sane defaults for local dev, and documents every knob (JWT secret, token TTLs, bcrypt cost, session limits).
- `packages/backend/src/security/`
  - `hasher.ts` wraps bcrypt with a single interface so we can swap algorithms later.
  - `tokens.ts` issues and verifies JWT access/refresh tokens via `jose`.
- `packages/backend/src/db/pg.ts`
  - Creates a shared `pg.Pool` and applies the dev bootstrap migration (`packages/database/seed/schema.sql`). The migration drops/recreates tables, so it is strictly for local development.
- `packages/backend/src/domains/user/`
  - `user.types.ts` defines the contracts for repositories, sessions, and service inputs.
  - `repositories.pg.ts` maps those contracts onto concrete SQL queries.
  - `userService.ts` contains all domain rules: registration, login, refresh rotation, logout, password changes, and session pruning.
- `packages/backend/src/index.ts`
  - Wires config → Postgres → repositories → domain services and exposes minimal HTTP routes (`/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/logout-all`, `/auth/sessions`).
- `packages/api-client/src/auth.ts`
  - Typed fetch helpers that frontends can consume so they do not duplicate URLs or response shapes.

## Request flow

1. **HTTP handler** (Node built-in server) parses the JSON body, calls the relevant `userService` method, and translates `AuthError` codes into HTTP status codes.
2. **User service** coordinates repositories:
   - Normalises the email and checks the user record.
   - Hashes passwords/refresh tokens with the configured `SecretHasher`.
   - Issues JWTs via the `TokenManager` and persists sessions with versioning info.
   - Enforces security rules (inactive/suspended users, refresh token reuse, session limits, password rotations).
3. **Repositories** hand craft SQL for clarity and to highlight how each table is used. They only deal with data persistence; no business rules live there.
4. **Database** structures (see `schema.sql`) provide:
   - `users` table without password columns (those live in `user_credentials`).
   - `user_credentials` table for password metadata and lockout counters.
   - `auth_sessions` table storing hashed refresh tokens, version counters, last seen timestamps, and invalidation reasons.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port for the backend | `4000` |
| `DATABASE_URL` | Postgres connection string | `postgresql://bhc:bhc@localhost:5432/bhc` |
| `REDIS_URL` | Future rate limiting/session support | unset |
| `JWT_SECRET` | Symmetric signing key for JWTs (change in prod) | `dev-only-change-me` |
| `ACCESS_TTL_SEC` | Access token lifetime (seconds) | `900` (15 minutes) |
| `REFRESH_TTL_SEC` | Refresh token lifetime (seconds) | `2592000` (30 days) |
| `MAX_SESSIONS_PER_USER` | Caps concurrent active sessions | `10` |
| `BCRYPT_ROUNDS` | Hash cost factor | `10` |

## Extending from here

- Swap the Node HTTP shim for Fastify (ADR‑0004) once the routes stabilise.
- Add Redis-backed rate limiting and session anomaly detection.
- Layer request validation (Zod, Valibot, TypeBox) before calling `userService`.
- Replace the dev migration runner with a proper incremental migration system before storing real data.
- Expand the shared API client or move it into an OpenAPI/contract-driven generator when the surface grows.
