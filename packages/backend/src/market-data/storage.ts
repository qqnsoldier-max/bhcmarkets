import { promises as fs } from "fs";
import path from "path";
import dayjs from "dayjs";
import { OUTPUT_DIR, SNAPSHOT_FILENAME, HISTORY_RETENTION_DAYS, HISTORY_MAX_FILES } from "./config";
import { logger } from "./logger";

export async function ensureDataDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

export async function saveSnapshot(data: any) {
  await ensureDataDir();
  const filePath = path.join(OUTPUT_DIR, SNAPSHOT_FILENAME);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  logger.info({ filePath }, "Saved snapshot");
}

export async function appendHistory(data: any) {
  await ensureDataDir();
  const ts = dayjs().toISOString();
  const historyDir = path.join(OUTPUT_DIR, "history");
  const filePath = path.join(historyDir, `${dayjs().format("YYYY-MM-DD_HH-mm-ss")}.json`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify({ ts, data }, null, 2), "utf-8");
  logger.info({ filePath }, "Appended history");
}

/**
 * Cleanup old history files:
 * - delete files older than HISTORY_RETENTION_DAYS (if > 0)
 * - keep at most HISTORY_MAX_FILES most-recent files (if > 0)
 */
export async function cleanupHistory() {
  const historyDir = path.join(OUTPUT_DIR, "history");
  try {
    await fs.mkdir(historyDir, { recursive: true });
    const entries = await fs.readdir(historyDir);
    const files = await Promise.all(
      entries
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const full = path.join(historyDir, f);
          const stat = await fs.stat(full);
          return { file: full, mtimeMs: stat.mtimeMs, mtime: stat.mtime };
        })
    );

    // Sort newest first
    files.sort((a, b) => b.mtimeMs - a.mtimeMs);

    const now = dayjs();
    const toDelete: string[] = [];

    if (HISTORY_RETENTION_DAYS > 0) {
      for (const { file, mtime } of files) {
        const ageDays = now.diff(dayjs(mtime), "day");
        if (ageDays > HISTORY_RETENTION_DAYS) {
          toDelete.push(file);
        }
      }
    }

    if (HISTORY_MAX_FILES > 0 && files.length > HISTORY_MAX_FILES) {
      const extra = files.slice(HISTORY_MAX_FILES).map((f) => f.file);
      toDelete.push(...extra);
    }

    // De-duplicate and remove
    const unique = Array.from(new Set(toDelete));
    await Promise.all(
      unique.map(async (f) => {
        try {
          await fs.unlink(f);
          logger.info({ file: f }, "Deleted old history file");
        } catch (err) {
          logger.warn({ err, file: f }, "Failed to delete history file");
        }
      })
    );
  } catch (err) {
    logger.warn({ err }, "cleanupHistory failed");
  }
}

export async function loadSnapshot() {
  try {
    const filePath = path.join(OUTPUT_DIR, SNAPSHOT_FILENAME);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    logger.warn("No snapshot found or failed to read snapshot");
    return null;
  }
}