/*
  pg.ts
  Lightweight Postgres client and migration runner.
  We use node-postgres for direct SQL access to keep the MVP lean and explicit.

  On startup, we run `schema.sql` from packages/database/seed to ensure local dev
  has the expected tables. In production, you'd swap to a proper migration tool
  (e.g., Sqitch/Goose/Drizzle/Knex) and disable auto-migrate.
*/

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

export interface PgDeps { connectionString: string }

export function createPgPool({ connectionString }: PgDeps) {
  const pool = new Pool({ connectionString });
  return pool;
}

export async function runMigrations(pool: Pool) {
  // Simple idempotent guard: create a migrations table if not exists
  await pool.query(
    `CREATE TABLE IF NOT EXISTS __migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now());`,
  );

  // For MVP we treat the schema.sql as a single migration id. The script drops tables, so
  // running it twice will reset local data — fine for dev, unsafe for prod.
  const migrationId = "001-bootstrap-auth-ledger";
  const res = await pool.query(`SELECT 1 FROM __migrations WHERE id = $1`, [migrationId]);
  if (res.rowCount && res.rowCount > 0) return; // already applied

  const schemaPath = join(process.cwd(), "packages", "database", "seed", "schema.sql");
  const sql = readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  await pool.query(`INSERT INTO __migrations (id) VALUES ($1)`, [migrationId]);
}
