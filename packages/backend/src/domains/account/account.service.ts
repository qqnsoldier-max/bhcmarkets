/*
  AccountService: balance management and fund reservations
  - No I/O here; pure contracts. Implementations will use repositories/DB.
*/

import type { UUID } from "./account.types.js";
import type { AccountEntity, CreateAccountInput } from "./account.types.js";

export interface AccountService {
  create(input: CreateAccountInput): Promise<AccountEntity>;
  get(id: UUID): Promise<AccountEntity | null>;
  listByUser(userId: UUID): Promise<AccountEntity[]>;

  // Reserve funds for an order; should be idempotent at higher level (orderId)
  lockFunds(accountId: UUID, amount: string, reason: string): Promise<void>;
  releaseFunds(accountId: UUID, amount: string, reason: string): Promise<void>;
}
