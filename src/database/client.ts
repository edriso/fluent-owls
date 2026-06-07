/**
 * The optional database layer (a lightweight direct MySQL/MariaDB driver).
 *
 * Why not Prisma like the tilawah bot: this bot compiles to dist/ and ships a
 * slim runtime image, where Prisma's generated client and a separate migrate
 * service add fragile build steps for what is a two-table schema. A direct
 * driver with idempotent table creation needs no codegen and no migrate step.
 *
 * The database is OPTIONAL. If DATABASE_URL is unset, `pool` is null and the
 * personal-tutor commands report that they are off; the channel broadcaster runs
 * exactly as before, with no database. This keeps the "no database by default"
 * design while letting one env var switch the tutor on.
 */
import mysql from 'mysql2/promise';
import { logger } from 'telegram-broadcast-kit';
import { config } from '../config';

/** Turn the DATABASE_URL into a connection pool, or null if it is not set. */
function createPool(): mysql.Pool | null {
  if (!config.databaseUrl) return null;
  // The URL host is the docker service name (e.g. shared-db); the driver reads
  // host/user/password/database straight from the URL.
  return mysql.createPool({
    uri: config.databaseUrl,
    connectionLimit: 5,
    waitForConnections: true,
    // BigInt ids (Telegram user ids) stay safe as JS numbers (< 2^53), so the
    // defaults are fine; we never enable supportBigNumbers.
  });
}

/** The shared pool, or null when no DATABASE_URL is configured. */
export const pool: mysql.Pool | null = createPool();

/** Whether the personal-tutor (database) features are enabled. */
export const dbEnabled = pool !== null;

/**
 * Create the tables if they do not exist. Idempotent, so it is safe to run on
 * every boot. Called once at startup when the database is enabled. A failure is
 * logged and turns the tutor off for this run rather than crashing the bot, so a
 * database hiccup never stops the daily channel posts.
 */
export async function ensureSchema(): Promise<boolean> {
  if (!pool) return false;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learners (
        telegram_id BIGINT PRIMARY KEY,
        level VARCHAR(2) NOT NULL DEFAULT 'b1',
        step INT NOT NULL DEFAULT 0,
        cursors TEXT NULL,
        streak INT NOT NULL DEFAULT 0,
        last_day VARCHAR(10) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    logger.info('Database ready (personal tutor enabled)');
    return true;
  } catch (err) {
    logger.error('Database setup failed; personal tutor disabled for this run', {
      error: String(err),
    });
    return false;
  }
}

/** Close the pool on shutdown. Safe to call when there is no pool. */
export async function closeDb(): Promise<void> {
  if (pool) await pool.end();
}
