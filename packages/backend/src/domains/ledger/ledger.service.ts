import type { UUID } from "./ledger.types.js";

export interface PostParams {
  accountId: UUID;
  amount: string; // positive=credit, negative=debit
  referenceId?: UUID;
  referenceType?: "order" | "trade" | "deposit" | "withdrawal" | "fee" | "adjustment";
  description?: string;
}

export interface LedgerService {
  // Creates balanced postings (credit+debit) for a logical event
  transfer(debit: PostParams, credit: PostParams): Promise<void>;
}
