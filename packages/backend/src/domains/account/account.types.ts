// TODO: Replace with import from @repo/types once project references are finalized
export type UUID = string;

export interface AccountEntity {
  id: UUID;
  userId: UUID;
  currency: string;
  balance: string;
  locked: string;
  accountType: "spot" | "margin" | "futures" | "demo";
  status: "active" | "locked" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  userId: UUID;
  currency: string;
  accountType?: AccountEntity["accountType"];
}

export interface AccountRepository {
  getById(id: UUID): Promise<AccountEntity | null>;
  listByUser(userId: UUID): Promise<AccountEntity[]>;
  create(input: CreateAccountInput): Promise<AccountEntity>;
  lockFunds(accountId: UUID, amount: string): Promise<void>;
  releaseFunds(accountId: UUID, amount: string): Promise<void>;
}
