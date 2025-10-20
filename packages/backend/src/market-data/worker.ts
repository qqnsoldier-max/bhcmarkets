import { fetchAll } from "./fetcher";
import { saveSnapshot, appendHistory, cleanupHistory } from "./storage";
import { logger } from "./logger";

/**
 * Central refresh worker:
 * - fetches all data
 * - writes snapshot (overwrites)
 * - appends history (time-stamped file)
 * - cleans up old history files by TTL / max count
 */
export async function runRefresh() {
  logger.info("Starting data refresh");
  const data = await fetchAll();
  await saveSnapshot({ ts: new Date().toISOString(), data });
  await appendHistory(data);
  await cleanupHistory();
  logger.info("Data refresh complete");
}