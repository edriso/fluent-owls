import { startHealthServer, logger } from 'telegram-broadcast-kit';
import { buildBot, setBotProfile } from './bot';
import { startScheduler, stopScheduler } from './scheduler';
import { closeDb } from './database/client';
import { config } from './config';

async function main(): Promise<void> {
  const bot = buildBot();

  // The optional personal-tutor database (Prisma). Its tables are created by
  // `prisma migrate deploy` (the migrate service), not at runtime; the client is
  // built in database/client.ts only when DATABASE_URL is set.

  const scheduleCount = startScheduler(bot);
  // The kernel's health server reads PORT from the env itself and binds /health.
  startHealthServer();

  // Self-set About + Description on the Bot API. This must run BEFORE bot.start,
  // which does not resolve while long-polling — anything after the awaited start
  // would never run. (Commands stay manual in @BotFather by design.)
  await setBotProfile(bot);

  logger.info('Starting bot', {
    timezone: config.timezone,
    dailyCron: config.dailyCron,
    posts: scheduleCount,
    isDev: config.isDev,
  });

  await bot.start({
    onStart: (info) => {
      logger.info('Bot started', { username: info.username });
    },
  });
}

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return; // a second signal must not race the first
  shuttingDown = true;
  logger.info(`${signal} received, shutting down...`);
  stopScheduler();
  await closeDb();
  process.exit(0);
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

main().catch((err) => {
  logger.error('Fatal error during startup', { error: String(err) });
  process.exit(1);
});
