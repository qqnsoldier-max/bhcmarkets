# 0002: Ledger uses double-entry postings

Date: 2025-10-20

## Status
Proposed

## Context
Financial correctness is crucial. We need immutable, auditable balance changes for accounts.

## Decision
- Model ledger as immutable `ledger_entries` rows representing postings to a single account.
- For each event (deposit, trade execution, fee), create at least two postings (debit and credit) that net to zero.
- Correlate postings via `(reference_id, reference_type)`.

## Consequences
- Simplifies audits and PnL calculations.
- Requires careful transaction handling to maintain invariants.
