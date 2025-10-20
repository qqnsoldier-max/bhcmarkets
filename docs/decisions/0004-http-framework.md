# 0004: HTTP framework

Date: 2025-10-20

## Status
Proposed

## Context
We need an HTTP framework for routing, validation, and performance.

## Options
- Fastify: fast, schema-first, good ecosystem
- Express: ubiquitous, simpler, slower by default
- Hono: lightweight, modern API

## Decision (tentative)
Favor Fastify for performance and schema-first validation. Keep router-agnostic service layer.

## Consequences
- JSON schema validation can derive types
- Clear plugin ecosystem for auth, rate-limit, etc.
