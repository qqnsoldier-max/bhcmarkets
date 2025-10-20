# Contributing to BHCMarkets

Thanks for helping build an industrial‑grade trading platform. This document sets expectations for contributions.

## Branching and commits

- Use feature branches: `feat/<area>-<short-description>` (e.g., `feat/backend-ledger-postings`).
- Conventional Commits for messages: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, etc.
- Keep PRs focused and under ~500 LOC when possible.

## Pull requests

- Checklist:
  - [ ] Lint passes (`bun run lint`)
  - [ ] Type checks pass (`bun run check-types`)
  - [ ] Tests added/updated (if public behavior changes)
  - [ ] Docs updated (`README`, `docs/architecture.md`, ADRs when making a decision)
- Describe the “why” and “what”, include screenshots for UI.

## Code style

- ESLint (flat) with repo presets; Prettier for formatting.
- TypeScript strict mode on; favor explicit types at package boundaries.
- Avoid abstractions until needed; prefer small, composable modules.

## Tests

- Add unit tests for logic; integration tests for critical flows (orders, ledger, PnL).
- Keep tests deterministic. For time-based logic, inject a clock.

## Docs and ADRs

- For non-trivial decisions, add an ADR under `docs/decisions/` using the ADR template.

## Security

- Never commit secrets. Use environment variables and `.env.example` when needed.
- Flag any potential security issues in PRs.

## Review process

- At least one approval required; CI must be green.
- Maintainers may request changes to align with architecture and standards.
