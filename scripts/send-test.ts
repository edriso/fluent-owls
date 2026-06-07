/**
 * Manual dev tool: fire one slot into the configured channel right now. Useful
 * for previewing content or formatting without waiting for the daily cron.
 *
 * Usage:
 *   pnpm send-test            -> sends the morning slot (A1-A2 quiz)
 *   pnpm send-test morning    -> A1-A2 quiz
 *   pnpm send-test midday     -> B1-B2 quiz
 *   pnpm send-test evening    -> C1-C2 quiz
 *   pnpm send-test phrase     -> today's "say it like a native" phrase
 *   pnpm send-test shadow     -> today's shadowing clip (needs the .ogg generated)
 *   pnpm send-test all        -> the whole daily set, in order
 *
 * The slot names come from src/schedules.ts, so a new slot works here for free.
 *
 * Requirements: BOT_TOKEN and CHANNEL_CHAT_ID in env (or .env), and the bot
 * must be a channel admin with "Post messages" permission. The shadow slot also
 * needs the audio generated and committed (pnpm generate-audio).
 */
import { Bot } from 'grammy';
import { logger } from 'telegram-broadcast-kit';
import { config } from '../src/config';
import { runOnce, findSlot } from '../src/scheduler';
import { schedules } from '../src/schedules';

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
