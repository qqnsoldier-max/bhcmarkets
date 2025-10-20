# 0003: Persistence layer

Date: 2025-10-20

## Status
Proposed

## Context
We need a type-safe, efficient data access layer with good migration tooling.

## Options
- Prisma: strong DX, migrations, type-safety
- Drizzle: SQL-first, lightweight, good type-safety
- pg + sql tagged templates: maximum control, minimal deps

## Decision (tentative)
Start with Drizzle or Prisma; evaluate complexity around advanced SQL (ledger) before finalizing.

## Consequences
- Codegen/types integrated into CI
- Migration discipline required across environments
