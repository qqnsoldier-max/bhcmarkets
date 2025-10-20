# @repo/backend

Back-end service for the trading platform. This package documents the architecture and contracts we’ll implement next. We’re focusing on clarity and correctness before wiring up runtime.

## Layers

- config: env and logger surfaces
- api: HTTP layer (controllers/routes/validators) – thin adapters to services
- domains: business logic grouped by bounded context
  - account: balances, locking, transfers
  - order: placement, cancelation, lifecycle
  - trade: executions, settlement
  - ledger: double-entry postings
  - risk: pre-trade checks (exposure, balance, symbols)
- market-data: ingestion, caching, scheduling
- realtime: WebSocket gateway and broadcasters
- utils: cross-cutting helpers

## Service contracts (summary)

- AccountService: create/list, lock/release funds, get balances
- LedgerService: post/transfer, settle trade fees, audit
- OrderService: place/cancel orders, update status
- TradeService: record executions, emit events
- RiskService: validate order against balance/exposure/limits

See `src/domains/*/*.service.ts` and `*.types.ts` for detailed method signatures. These are intentionally framework-free so we can swap persistence and transports.

## Data rules

- Monetary amounts are decimal strings in TS, NUMERIC in SQL
- Every balance change must be represented by balanced ledger postings
- Use idempotency keys for order placement and deposits

## Next

- Choose persistence strategy (Prisma/Drizzle/pg) and implement repositories
- Add transactional boundaries for order placement + settlement
- Wire API routes to services with validation
