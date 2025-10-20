import cron from "node-cron";
import { REFRESH_CRON } from "./config";
import { logger } from "./logger";
import { runRefresh } from "./worker";

let task: cron.ScheduledTask | null = null;

export function startScheduler() {
  logger.info({ cron: REFRESH_CRON }, "Starting scheduler");
  task = cron.schedule(REFRESH_CRON, async () => {
    logger.info("Scheduled refresh triggered");
    try {
      await runRefresh();
    } catch (err) {
      logger.error({ err }, "Scheduled refresh failed");
    }
  });
  task.start();
}

export async function stopScheduler() {
  if (task) {
    task.stop();
    logger.info("Scheduler stopped");
  }
}