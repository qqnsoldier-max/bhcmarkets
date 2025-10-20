# Domain Overview

This document summarizes the core entities and flows of the trading platform. It complements `packages/database/seed/schema.sql` and the shared types in `packages/types/*`.

## Core entities

- Users & Auth: `users`, `auth_sessions`, `user_profiles`
- Accounts: `accounts` hold balances per currency and user
- Ledger: `ledger_entries` (double-entry postings) capture immutable balance movements
- Orders & Trades: `orders` and `trades` represent the order lifecycle and executions
- Positions: `positions` track exposure (esp. for margin/futures)
- Deposits & Withdrawals: fiat/crypto movement in/out
- PnL: `pnl_snapshots` for reporting
- Audit & Notifications: `audit_logs`, `notifications`

## Design notes

- All monetary values are stored as NUMERIC in DB and represented as decimal strings in TypeScript to avoid float issues.
- Every balance-affecting operation must create balanced ledger postings.
- Prefer idempotent APIs for actions like order placement and deposits.

## Next steps

- Implement repository interfaces for Accounts, Orders, Trades, Ledger
- Choose ORM/Query layer (Prisma or Drizzle) and generate types
- Add transactional services for order placement and trade settlement
