/*
  Lightweight repository factory stub.
  Replace with real implementations (e.g., Postgres via pg/prisma) as we flesh out domains.
*/

export type Repository<T> = {
  getById(id: string): Promise<T | null>;
  list(params?: Record<string, unknown>): Promise<T[]>;
};

// Example domain entities to be refined
export interface MarketSymbol {
  symbol: string; // e.g. "EUR/USD"
  description?: string;
}

export interface Account {
  id: string;
  userId: string;
  currency: string; // ISO code
  balance: string; // decimal as string to avoid float
  locked: string;
}

export function createRepositories() {
  // In-memory stubs for early wiring
  const markets: MarketSymbol[] = [];
  const accounts: Account[] = [];

  const MarketsRepository: Repository<MarketSymbol> = {
    async getById(id: string) {
      return markets.find((m) => m.symbol === id) ?? null;
    },
    async list() {
      return markets;
    },
  };

  const AccountsRepository: Repository<Account> = {
    async getById(id: string) {
      return accounts.find((a) => a.id === id) ?? null;
    },
    async list() {
      return accounts;
    },
  };

  return { MarketsRepository, AccountsRepository } as const;
}

export type Repositories = ReturnType<typeof createRepositories>;
