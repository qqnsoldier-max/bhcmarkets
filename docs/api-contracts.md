# API Contracts (Draft)

This document defines the HTTP API surface for the trading platform. It focuses on payload shapes and conventions, not framework specifics.

## Conventions

- Base URL: `/api`
- Content-Type: `application/json`
- All timestamps are ISO strings (UTC)
- Monetary amounts are decimal strings
- Idempotency: endpoints that create resources accept `Idempotency-Key` header

## Auth

- POST `/api/auth/login`
  - body: { email: string, password: string }
  - 200: { accessToken: string, refreshToken: string, user: User }
- POST `/api/auth/refresh`
  - body: { refreshToken: string }
  - 200: { accessToken: string }
- POST `/api/auth/logout`
  - header: Authorization Bearer
  - 204

## Accounts

- GET `/api/accounts`
  - 200: Account[]
- POST `/api/accounts`
  - body: { currency: string, accountType?: "spot"|"margin"|"futures"|"demo" }
  - 201: Account
- GET `/api/accounts/:id`
  - 200: Account

## Orders

- GET `/api/accounts/:accountId/orders`
  - 200: Order[]
- POST `/api/orders`
  - headers: Idempotency-Key: string
  - body: { accountId, symbol, side, type, price?, quantity }
  - 201: Order
- POST `/api/orders/:id/cancel`
  - 204

## Trades

- GET `/api/orders/:orderId/trades`
  - 200: Trade[]

## Health

- GET `/healthz` -> { status: "ok" }
- GET `/readyz` -> { status: "ready" }

## Error model

- 4xx/5xx -> { error: { code: string, message: string, details?: unknown } }
- Common codes: `validation_error`, `unauthorized`, `forbidden`, `not_found`, `conflict`, `rate_limited`, `internal_error`

## Next

- Add pagination/cursors for list endpoints
- Define rate limits per route
- Define RBAC matrix for admin vs user endpoints
