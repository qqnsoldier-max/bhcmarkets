// TODO: Replace with import from @repo/types once project references are finalized
export type UUID = string;
export interface Trade {
  id: UUID;
  orderId: UUID;
  counterpartyOrderId?: UUID;
  price: string;
  quantity: string;
  fee?: string;
  feeCurrency?: string;
  createdAt: string;
}

export interface TradeRepository {
  getById(id: UUID): Promise<Trade | null>;
  listByOrder(orderId: UUID): Promise<Trade[]>;
  recordExecution(execution: Trade): Promise<void>;
}
