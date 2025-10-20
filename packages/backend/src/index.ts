/*
  Application bootstrap for @repo/backend
  - Zero-dependency HTTP server (Node built-ins) to keep footprint minimal
  - Explicit initialization order: config -> logger -> services (db) -> http
  - Graceful shutdown hooks
  - Clear “next step” comments to guide future implementation
*/

import http, { IncomingMessage, ServerResponse } from "http";
import { AddressInfo } from "net";
import { createRepositories } from "./database";

// Config loader (can be replaced later by dotenv / typed config)
const loadConfig = () => {
  const port = parseInt(process.env.PORT || "3000", 10);
  const nodeEnv = process.env.NODE_ENV || "development";
  return { port, nodeEnv } as const;
};

// Minimal structured logger stub (replace with pino/winston later)
const logger = {
  info: (msg: string, meta?: Record<string, unknown>) =>
    console.log(JSON.stringify({ level: "info", msg, ...meta })),
  error: (msg: string, meta?: Record<string, unknown>) =>
    console.error(JSON.stringify({ level: "error", msg, ...meta })),
};

// Very small router without external deps; extend as needed
const router = async (req: IncomingMessage, res: ServerResponse) => {
  const { method = "GET", url = "/" } = req;

  // Health & readiness
  if (method === "GET" && url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (method === "GET" && url === "/readyz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ready" }));
    return;
  }

  // Example domain route placeholder
  if (method === "GET" && url?.startsWith("/api/markets")) {
    // NEXT STEP: plug into a MarketsRepository once domain defined
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ data: [], nextStep: "connect to MarketsRepository" }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
};

async function main() {
  const config = loadConfig();

  // Initialize services (repositories, caches, etc.)
  const repos = createRepositories();
  // Expose for quick manual inspection during dev (optional)
  // @ts-ignore
  globalThis.__repos = repos;

  const server = http.createServer(router);

  server.on("clientError", (err, socket) => {
    logger.error("client_error", { err: String(err) });
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  });

  server.listen(config.port, () => {
    const address = server.address() as AddressInfo | null;
    const port = address?.port ?? config.port;
    logger.info("server_started", { port, env: config.nodeEnv });
  });

  const shutdown = (signal: string) => {
    logger.info("shutdown_signal", { signal });
    server.close((err?: Error) => {
      if (err) logger.error("server_close_error", { err: String(err) });
      logger.info("server_closed");
      process.exit(err ? 1 : 0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// Run only when invoked directly: `node src/index.ts` with ts-node/register or compiled output
// In this monorepo, `pnpm -w dev`/`bun` may run via node; this guard keeps import safety if used as a lib later.
if (import.meta.url === `file://${process.argv[1]}`) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}

export type AppRepositories = ReturnType<typeof createRepositories>;
export { main };
