export type UUID = string;

export interface RiskCheckInput {
  accountId: UUID;
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit" | "stop" | "take_profit";
  price?: string;
  quantity: string;
}

export interface RiskService {
  validateOrder(input: RiskCheckInput): Promise<{
    ok: true;
  } | {
    ok: false;
    reason: string;
  }>;
}
