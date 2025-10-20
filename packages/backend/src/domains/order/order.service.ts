/*
  OrderService: order lifecycle orchestration (placement, cancelation, status updates)
*/

import type { UUID, Order, OrderStatus } from "./order.types.js";
import type { PlaceOrderInput } from "./order.types.js";

export interface OrderService {
  place(input: PlaceOrderInput, opts?: { idempotencyKey?: string }): Promise<Order>;
  cancel(id: UUID): Promise<void>;
  get(id: UUID): Promise<Order | null>;
  listByAccount(accountId: UUID): Promise<Order[]>;
  setStatus(id: UUID, status: OrderStatus): Promise<void>;
}
