import { createServer } from "./server";
import { PORT } from "./config";
import { logger } from "./logger";
import { startScheduler, stopScheduler } from "./scheduler";
import { runRefresh } from "./worker";

const app = createServer();

async function start() {
  // ensure initial refresh before server comes online
  try {
    logger.info("Performing initial refresh");
    await runRefresh();
  } catch (err) {
    logger.error({ err }, "Initial refresh failed — continuing to start server");
  }

  startScheduler();

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    logger.info({ port: PORT }, "Server listening");
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
}

// Graceful shutdown
async function stop() {
  logger.info("Shutting down...");
  stopScheduler();
  try {
    await app.close();
    logger.info("Fastify closed");
  } catch (err) {
    logger.error({ err }, "Error closing Fastify");
  }
  process.exit(0);
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

start();