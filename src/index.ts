import { startHealthServer, logger } from 'telegram-broadcast-kit';
import { buildBot } from './bot';
import { startScheduler, stopScheduler } from './scheduler';
import { config } from './config';

async function main(): Promise<void> {
  const bot = buildBot();

  const scheduleCount = startScheduler(bot);
  // The kernel's health server reads PORT from the env itself and binds /health.
  startHealthServer();

  logger.info('Starting bot', {
    timezone: config.timezone,
    dailyCron: config.dailyCron,
    questions: scheduleCount,
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
  process.exit(0);
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

main().catch((err) => {
  logger.error('Fatal error during startup', { error: String(err) });
  process.exit(1);
});
