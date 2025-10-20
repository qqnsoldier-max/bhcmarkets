/*
  TradeService: execution recording and retrieval
*/

import type { UUID, Trade } from "./trade.types.js";

export interface TradeService {
  get(id: UUID): Promise<Trade | null>;
  listByOrder(orderId: UUID): Promise<Trade[]>;
  record(execution: Trade): Promise<void>;
}
