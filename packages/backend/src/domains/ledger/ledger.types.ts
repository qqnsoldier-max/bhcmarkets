export type UUID = string;

export type LedgerRefType = "order" | "trade" | "deposit" | "withdrawal" | "fee" | "adjustment";

export interface LedgerEntry {
  id?: number;
  entryUuid: UUID;
  accountId: UUID;
  referenceId?: UUID;
  referenceType?: LedgerRefType;
  amount: string; // +credit, -debit
  balanceAfter?: string;
  createdAt?: string;
  description?: string;
}
