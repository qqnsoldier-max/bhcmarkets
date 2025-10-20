# 0001: Choose Bun + Turborepo monorepo

Date: 2025-10-20

## Status
Accepted

## Context
We want fast installs, simple scripts, and a unified workspace for web, backend, and shared packages. Node versions vary across dev machines, so we prefer a solution that is fast but compatible with Node runtimes.

## Decision
- Use Bun as the package manager at the root for speed and simple scripts.
- Keep Node compatibility for runtime code; avoid Bun-only APIs in libraries.
- Use Turborepo for pipe-lining builds, lint, and type checks across packages.

## Consequences
- Faster local iteration.
- Need to guard against Bun-specific APIs creeping into shared code.
- CI should use Bun for install and turbo for orchestrating tasks.
