import { Bot } from 'grammy';
import { logger } from 'telegram-broadcast-kit';
import { config } from './config';
import { findSlot, runOnce } from './scheduler';

/**
 * Build and configure the Grammy bot. The bot exists mainly to drive scheduled
 * channel posts. The DM surface is intentionally minimal: a /start that points
 * new arrivals to the channel, and optional admin commands that fire a slot on
 * demand for debugging.
 */
export function buildBot(): Bot {
  const bot = new Bot(config.botToken);

  bot.command('start', async (ctx) => {
    const link = config.channelUrl;
    const tail = link ? `\n\nJoin the channel: ${link}` : '';
    await ctx.reply(
      [
        '🦉 Hi! Fluent Owls posts three short English quizzes a day to its Telegram channel.',
        '',
        'A beginner warm-up, an intermediate question, and an advanced challenge, posted together each afternoon. Each is a quick fill-in-the-blank quiz with an instant explanation, so you learn a little every day.',
        tail,
      ].join('\n'),
      { link_preview_options: { is_disabled: true } },
    );
  });

  bot.command('about', async (ctx) => {
    await ctx.reply(
      [
        'Fluent Owls is a tiny open-source Telegram bot that posts daily English quizzes to a channel.',
        'It has no database. Questions live in the source, organized by CEFR level.',
      ].join('\n'),
    );
  });

  // Admin-only manual fire, useful for previewing a slot without waiting for
  // the cron. Anyone other than the configured admin is silently ignored, so
  // the bot never leaks the command to strangers in DMs.
  for (const slot of ['morning', 'midday', 'evening']) {
    bot.command(`admin_${slot}`, async (ctx) => {
      if (!isAdmin(ctx.from?.id)) return;
      const def = findSlot(slot);
      if (!def) return;
      await ctx.reply(`Firing ${slot}...`);
      await runOnce(def, bot);
      await ctx.reply('Done.');
    });
  }

  bot.catch((err) => {
    logger.error('Grammy uncaught error', { error: String(err.error) });
  });

  return bot;
}

function isAdmin(id: number | undefined): boolean {
  if (!config.adminTelegramId || !id) return false;
  return BigInt(id) === config.adminTelegramId;
}
