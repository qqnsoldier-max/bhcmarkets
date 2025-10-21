/*
  Application bootstrap for @repo/backend
  - We deliberately start with Node's built-in HTTP to minimize dependencies.
  - Wiring order: config -> database -> repositories -> domain services -> http router.
  - You can later swap the router with Fastify (see ADR-0004) without touching domain logic.
*/

import http, { IncomingMessage, ServerResponse } from "http";
import { AddressInfo } from "net";
import { loadEnv } from "./config/env.js";
import { createBcryptHasher } from "./security/hasher.js";
import { createJwtTokenManager } from "./security/tokens.js";
import { createPgPool, runMigrations } from "./db/pg.js";
import { AuthError, createUserService } from "./domains/user/userService.js";
import {
  createUserRepository,
  createCredentialRepository,
  createSessionRepository,
} from "./domains/user/repositories.pg.js";
import type { SessionInvalidationReason } from "./domains/user/user.types.js";

// Config loader documents our runtime contract and provides safe defaults.
const config = loadEnv();

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

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

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

  const sendJson = (status: number, payload: unknown) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(payload));
  };

  const mapAuthErrorToStatus = (code: AuthError["code"]): number => {
    switch (code) {
      case "EMAIL_ALREADY_REGISTERED":
        return 409;
      case "INVALID_CREDENTIALS":
      case "PASSWORD_MISMATCH":
      case "REFRESH_TOKEN_INVALID":
      case "REFRESH_TOKEN_REUSED":
      case "REFRESH_TOKEN_EXPIRED":
        return 401;
      case "USER_NOT_ACTIVE":
      case "USER_SUSPENDED":
        return 403;
      case "SESSION_NOT_FOUND":
        return 404;
      case "SESSION_REVOKED":
      case "SESSION_EXPIRED":
      case "UNKNOWN_USER":
        return 401;
      default:
        return 400;
    }
  };

  const handleAuthError = (err: unknown, fallback: number) => {
    if (err instanceof AuthError) {
      const status = mapAuthErrorToStatus(err.code) || fallback;
      sendJson(status, { error: err.code });
      return;
    }
    logger.error("auth_route_error", { err: String(err) });
    sendJson(fallback, { error: "internal_error" });
  };

  // Simple JSON body parser for small requests; avoids bringing a full framework.
  async function readJsonBody<T>(): Promise<T | null> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      req
        .on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
        .on("end", () => {
          try {
            if (!chunks.length) return resolve(null);
            const json = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            resolve(json as T);
          } catch {
            resolve(null);
          }
        });
    });
  }

  // Auth routes (MVP). In a later phase we'll swap to Fastify.
  if (method === "POST" && url === "/auth/register") {
    const body = await readJsonBody<{ email: string; password: string }>();
    if (!body?.email || !body?.password) {
      sendJson(400, { error: "invalid_body" });
      return;
    }
    try {
      const result = await services.user.register({ email: body.email, password: body.password });
      sendJson(200, result);
    } catch (e) {
      handleAuthError(e, 400);
    }
    return;
  }

  if (method === "POST" && url === "/auth/login") {
    const body = await readJsonBody<{ email: string; password: string }>();
    if (!body?.email || !body?.password) {
      sendJson(400, { error: "invalid_body" });
      return;
    }
    try {
      const result = await services.user.authenticate({ email: body.email, password: body.password });
      sendJson(200, result);
    } catch (e) {
      handleAuthError(e, 401);
    }
    return;
  }

  if (method === "POST" && url === "/auth/refresh") {
    const body = await readJsonBody<{ refreshToken: string }>();
    if (!body?.refreshToken) {
      sendJson(400, { error: "invalid_body" });
      return;
    }
    try {
      const result = await services.user.refreshSession({ refreshToken: body.refreshToken });
      sendJson(200, result);
    } catch (e) {
      handleAuthError(e, 401);
    }
    return;
  }

  if (method === "POST" && url === "/auth/logout") {
    const body = await readJsonBody<{ sessionId?: string; userId?: string; reason?: string }>();
    if (!body?.sessionId) {
      sendJson(400, { error: "invalid_body" });
      return;
    }
    try {
      await services.user.logout({
        sessionId: body.sessionId,
        userId: body.userId,
        reason: body.reason as SessionInvalidationReason | undefined,
      });
      res.writeHead(204);
      res.end();
    } catch (e) {
      handleAuthError(e, 400);
    }
    return;
  }

  if (method === "POST" && url === "/auth/logout-all") {
    const body = await readJsonBody<{ userId?: string; excludeSessionId?: string; reason?: string }>();
    if (!body?.userId) {
      sendJson(400, { error: "invalid_body" });
      return;
    }
    await services.user.logoutAll({
      userId: body.userId,
      excludeSessionId: body.excludeSessionId,
      reason: body.reason as SessionInvalidationReason | undefined,
    });
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === "GET" && url?.startsWith("/auth/sessions")) {
    const search = new URL(url, "http://localhost").searchParams;
    const userId = search.get("userId");
    if (!userId) {
      sendJson(400, { error: "user_id_required" });
      return;
    }
    const sessions = await services.user.listActiveSessions(userId);
    sendJson(200, { sessions });
    return;
  }

  sendJson(404, { error: "not_found" });
};

// Very small dependency container. In a larger codebase we'd use a proper DI/wiring layer.
const services = await (async () => {
  const pool = createPgPool({ connectionString: config.databaseUrl });
  await runMigrations(pool);

  const userRepository = createUserRepository(pool);
  const credentialRepository = createCredentialRepository(pool);
  const sessionRepository = createSessionRepository(pool);

  const passwordHasher = createBcryptHasher(config.bcryptRounds);
  const tokenManager = createJwtTokenManager(config.jwtSecret);

  const user = createUserService({
    userRepository,
    credentialRepository,
    sessionRepository,
    passwordHasher,
    tokenManager,
    config: {
      accessTokenTtlSeconds: config.accessTtlSec,
      refreshTokenTtlSeconds: config.refreshTtlSec,
      maxSessionsPerUser: config.maxSessionsPerUser,
    },
  });

  return { user } as const;
})();

async function main() {
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
  void main();
}

export { main };
