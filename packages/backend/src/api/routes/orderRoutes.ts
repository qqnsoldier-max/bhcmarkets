import type { RouteRegistrar, Router } from "../types.js";
import { listByAccount, placeOrder, cancelOrder } from "../controllers/orderController.js";

export const registerOrderRoutes: RouteRegistrar = (router: Router) => {
  router.route("GET", "/api/accounts/:accountId/orders", listByAccount as any);
  router.route("POST", "/api/orders", placeOrder);
  router.route("POST", "/api/orders/:id/cancel", cancelOrder as any);
};
