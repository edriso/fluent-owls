/**
 * One-off migrate entrypoint for the `fluent-owls-migrate` compose service.
 *
 * The bot also creates its tables on boot (see database/client.ts), so this is
 * optional. It exists so the fleet's `<bot>-migrate` deploy pattern works: it
 * runs the same idempotent CREATE TABLE and exits, then the bot starts.
 *
 * Run it in the container with `pnpm db:deploy`. With no DATABASE_URL it is a
 * no-op (there is nothing to migrate).
 */
import { logger } from 'telegram-broadcast-kit';
import { closeDb, dbEnabled, ensureSchema } from './database/client';

async function main(): Promise<void> {
  if (!dbEnabled) {
    logger.info('No DATABASE_URL set; nothing to migrate.');
    return;
  }
  const ok = await ensureSchema();
  await closeDb();
  if (!ok) process.exit(1);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error('Migrate failed', { error: String(err) });
    process.exit(1);
  });
