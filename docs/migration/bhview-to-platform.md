# Legacy `bhview` Migration Log

This document tracks the ongoing migration of the legacy `oldbhcm/bhview` React single-page application into the new monorepo structure. Updates should be appended as features and packages move across.

## Goals

- Preserve UX parity for the authenticated dashboard experience while reshaping the project around the new domain-driven layout (`apps/platform`, `packages/ui`, shared services).
- Promote shared UI primitives, tokens, and theming primitives into `@repo/ui` so future surfaces (web, mobile) can reuse them.
- Introduce typed boundaries and modern tooling (TypeScript, React Router v7, styled-components v6) without blocking incremental feature delivery.

## Current Status (initial cut)

- ✅ Scaffolded `apps/platform` with a Vite + React + TS toolchain, strict TS configs, and routing shell.
- ✅ Ported the global theming system (palettes, tokens, ThemeManager) into `packages/ui/src/theme` with TypeScript definitions and styled-components augmentation.
- ✅ Migrated first wave of UI primitives (`Button`, `Badge`, `Card` family, `MenuLink`, `StatBlock`, `Toggle`) into `@repo/ui`, including barrel exports and package export map updates.
- ✅ Brought over the `DashboardShell` layout and the `DashboardOverview` page into `apps/platform`, wiring them through React Router and the new UI package.
- ✅ Migrated the `Portfolio`, `Markets`, `Orders`, `Settings`, and `UiGallery` screens into feature modules under `apps/platform`, keeping layout and copy parity.
- ✅ Ported the additional UI primitives (`IconButton`, `Select`, `TextField`) required for the gallery showcase and exported them via `@repo/ui`.
- ⏳ Pending dependency install flow update for bun workspaces (see "Open Questions").

## Next Steps

1. **Stabilise dependencies**
   - Align bun workspace install process or fall back to pnpm so `styled-components`, `react-router-dom`, and workspace packages resolve cleanly.
   - Once install story is solved, generate a smoke build for `apps/platform` to validate the entrypoint wiring.

2. **UI primitives parity**
   - Port the remaining primitives (`IconButton`, `Select`, `TextField`, etc.) and theme utilities from `oldbhcm/bhview/src/components/ui` into `@repo/ui`.
   - Add Storybook or comparable playground to exercise these components in isolation.

3. **Feature migration cadence**
   - Harden migrated pages with data plumbing once services become available.
   - Introduce store slices or query adapters as needed, capturing todos for backend integration gaps.

4. **Tooling + DX**
   - Restore linting (ESLint config from legacy) and add unit test harness (Vitest/RTL) for migrated components.
   - Document command cheatsheet for platform app (`dev`, `build`, `lint`, `check-types`).

## Open Questions / Todos

- Confirm preferred package manager (bun vs pnpm). Workspace installs currently fail because of `@repo/*` local packages; decide whether to publish them, switch to pnpm, or adjust bun config.
- Determine hosting approach for shared fonts (currently imported via Google Fonts in `GlobalStyle`).
- Validate whether marketing `apps/web` will reuse `@repo/ui` once components stabilise; adjust design tokens if so.

_Updated: 2025-10-19_
