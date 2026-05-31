/**
 * Manual dev tool: fire one slot into the configured channel right now. Useful
 * for previewing content or formatting without waiting for the daily cron.
 *
 * Usage:
 *   pnpm send-test            -> sends the morning slot (A1-A2)
 *   pnpm send-test morning    -> sends the morning slot (A1-A2)
 *   pnpm send-test midday     -> sends the midday slot (B1-B2)
 *   pnpm send-test evening    -> sends the evening slot (C1-C2)
 *   pnpm send-test all        -> sends all three, in order
 *
 * Requirements: BOT_TOKEN and CHANNEL_CHAT_ID in env (or .env), and the bot
 * must be a channel admin with "Post messages" permission.
 */
import { Bot } from 'grammy';
import { config } from '../src/config';
import { runOnce, findSlot } from '../src/scheduler';
import { schedules } from '../src/schedules';
import { logger } from '../src/lib/logger';

const SLOT_NAMES = schedules.map((s) => s.name);

async function main(): Promise<void> {
  const arg = (process.argv[2] ?? 'morning').toLowerCase();
  if (arg !== 'all' && !SLOT_NAMES.includes(arg)) {
    console.error(`Unknown slot "${arg}". Use ${SLOT_NAMES.join(', ')}, or all.`);
    process.exit(1);
  }

  const bot = new Bot(config.botToken);
  // Preflight: one clean diagnostic for a bad token or chat id, instead of a
  // confusing failure deep inside runOnce.
  try {
    const chat = await bot.api.getChat(config.channelChatId);
    logger.info('Channel preflight OK', { title: 'title' in chat ? chat.title : '(private)' });
  } catch (err) {
    logger.error('Channel preflight failed. Check BOT_TOKEN and CHANNEL_CHAT_ID.', {
      error: String(err),
    });
    process.exit(1);
  }

  const targets = arg === 'all' ? [...schedules] : [findSlot(arg)!];
  for (const slot of targets) {
    await runOnce(slot, bot);
  }
}

main().catch((err) => {
  logger.error('send-test failed', { error: String(err) });
  process.exit(1);
});
