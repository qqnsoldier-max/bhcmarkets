import Fastify from "fastify";
import fastifyProm from "fastify-prometheus";
import { logger } from "./logger";
import { loadSnapshot } from "./storage";
import { runRefresh } from "./worker";
import { API_KEY } from "./config";
import { getSymbolsList } from "./fetcher";

export function createServer() {
  const app = Fastify({
    logger: false
  });

  // Simple API key protection for /refresh and /metrics if API_KEY is set
  app.addHook("onRequest", async (req, reply) => {
    if (!API_KEY) return;
    const url = req.url || "";
    const protectedPaths = ["/refresh", "/metrics"];
    if (protectedPaths.some((p) => url.startsWith(p))) {
      const key = (req.headers["x-api-key"] || req.headers["authorization"]) as string | undefined;
      const token = key?.startsWith("Bearer ") ? key.slice("Bearer ".length) : key;
      if (token !== API_KEY) {
        reply.code(401).send({ error: "Unauthorized" });
      }
    }
  });

  // Prometheus plugin (exposes /metrics)
  app.register(fastifyProm, {
    endpoint: "/metrics",
    collectDefaultMetrics: true
  });

  app.get("/health", async () => {
    return { status: "ok", ts: new Date().toISOString() };
  });

  app.get("/refresh", async (_req, reply) => {
    try {
      await runRefresh();
      return reply.code(200).send({ ok: true });
    } catch (err) {
      return reply.code(500).send({ ok: false, error: String(err) });
    }
  });

  app.get("/prices", async () => {
    const snap = await loadSnapshot();
    return snap ?? { message: "no snapshot available" };
  });

  app.get("/symbols", async () => {
    const symbols = await getSymbolsList();
    return { symbols };
  });

  return app;
}