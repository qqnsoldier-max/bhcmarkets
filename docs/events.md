# Events and Real-time Flows (Draft)

We use an internal event bus to decouple domains.

Example events:
- order.placed { orderId, accountId, symbol, side, type, price?, quantity }
- order.filled { orderId, filledQty, remainingQty, price }
- trade.executed { tradeId, orderId, price, quantity, fee }
- ledger.posted { debitAccountId, creditAccountId, amount, reference }

Real-time:
- WebSocket gateway publishes market ticks and user-specific updates (orders/trades)
- Clients subscribe by symbol and by user session

Event schemas will be defined next to the service methods emitting them.
