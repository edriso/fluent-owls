import { Bot } from 'grammy';
import { logger } from 'telegram-broadcast-kit';
import { config } from './config';
import { findSlot, runOnce } from './scheduler';
import { schedules } from './schedules';
import { ALL_QUESTIONS } from './content/index';
import { ALL_SHADOWING } from './content/shadowing';
import { ALL_DIALOGUES } from './content/dialogues';
import { ALL_PHRASES } from './content/phrases';
import { ALL_GRAMMAR } from './content/grammar';
import { ALL_MONOLOGUES } from './content/monologues';
import {
  postDialogue,
  postGrammar,
  postMonologue,
  postPhrase,
  postQuizPoll,
  postVoice,
} from './lib/post';

// Public profile texts the bot self-sets on start (commands + About +
// Description). The name, botpic, and other profile fields cannot be set via the
// Bot API; those stay in @BotFather.
//
// About is BotFather's "short description": ≤120 code points.
export const botAbout =
  'Daily English 🦉 Quizzes, phrases, role-plays, grammar, and audio to shadow, A1 to C2. Or pull any on demand. Tap Start.';

// Description: BotFather's "description", ≤512 code points. Shown on the
// empty-chat start screen before the user presses Start.
export const botDescription = [
  '🦉 Hi! Fluent Owls posts a short daily English set to its Telegram channel every evening, to help you be both correct and well spoken.',
  'Each day: three fill-in-the-blank quizzes (with instant explanations), a grammar point, a "say it like a native" phrase, a role-play dialogue, and an audio clip to shadow.',
  'Want more anytime? Message me /quiz, /grammar, /phrase, /dialogue, /shadow, or /monologue and I will send one right away.',
  'Organized by CEFR level (A1 to C2). No signup. Tap Start for the channel link.',
].join('\n');

/** Pick a random item from a non-empty list (for the on-demand commands). */
function randomOf<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

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
        '🦉 Hi! Fluent Owls posts a short daily English set to its Telegram channel.',
        '',
        'Each evening: three fill-in-the-blank quizzes (with instant explanations), a grammar point, a "say it like a native" phrase, a role-play dialogue, and an audio clip to shadow. A little every day, so you become both correct and well spoken.',
        '',
        'Want more right now? Send me /quiz, /grammar, /phrase, /dialogue, /shadow, or /monologue.',
        tail,
      ].join('\n'),
      { link_preview_options: { is_disabled: true } },
    );
  });

  bot.command('about', async (ctx) => {
    await ctx.reply(
      [
        'Fluent Owls is a tiny open-source Telegram bot that posts a daily English set to a channel: quizzes, grammar, phrases, role-play dialogues, and audio to shadow.',
        'It has no database. All content lives in the source, organized by CEFR level. Audio is pre-generated, so the bot needs no text-to-speech key to run.',
        'Want more anytime? Try /quiz, /grammar, /phrase, /dialogue, /shadow, or /monologue.',
      ].join('\n'),
    );
  });

  // On-demand content: anyone can pull a random exercise in a DM whenever they
  // want more than the daily set. Stateless (a random pick), so no database is
  // needed; the reply goes to the chat that asked.
  bot.command('quiz', async (ctx) => {
    if (ctx.chat) await postQuizPoll(bot, randomOf(ALL_QUESTIONS), { chatId: ctx.chat.id });
  });
  bot.command('grammar', async (ctx) => {
    if (ctx.chat) await postGrammar(bot, randomOf(ALL_GRAMMAR), { chatId: ctx.chat.id });
  });
  bot.command('phrase', async (ctx) => {
    if (ctx.chat) await postPhrase(bot, randomOf(ALL_PHRASES), { chatId: ctx.chat.id });
  });
  bot.command('dialogue', async (ctx) => {
    if (ctx.chat) await postDialogue(bot, randomOf(ALL_DIALOGUES), { chatId: ctx.chat.id });
  });
  bot.command('shadow', async (ctx) => {
    if (ctx.chat) await postVoice(bot, randomOf(ALL_SHADOWING), { chatId: ctx.chat.id });
  });
  bot.command('monologue', async (ctx) => {
    if (ctx.chat) await postMonologue(bot, randomOf(ALL_MONOLOGUES), { chatId: ctx.chat.id });
  });

  // Admin-only manual fire, useful for previewing a slot without waiting for
  // the cron. One command per slot in the daily batch (derived from schedules,
  // so a new slot gets its /admin_* command for free). Anyone other than the
  // configured admin is silently ignored, so the bot never leaks the command to
  // strangers in DMs.
  for (const slot of schedules.map((s) => s.name)) {
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

/**
 * Self-set the bot's public profile (commands + About + Description) on the Bot
 * API, so a deploy is self-describing with no manual @BotFather step. Each
 * command here must have a real handler in buildBot above.
 */
export async function setBotProfile(bot: Bot): Promise<void> {
  await bot.api.setMyCommands([
    { command: 'start', description: 'What Fluent Owls is and how to join the channel' },
    { command: 'about', description: 'About this open-source bot' },
    { command: 'quiz', description: 'Send me a random quiz' },
    { command: 'grammar', description: 'Send me a random grammar point (with audio)' },
    { command: 'phrase', description: 'Send me a "say it like a native" phrase' },
    { command: 'dialogue', description: 'Send me a role-play dialogue (audio)' },
    { command: 'shadow', description: 'Send me a shadowing clip (audio)' },
    { command: 'monologue', description: 'Send me a model passage to retell (audio)' },
  ]);
  await bot.api.setMyShortDescription(botAbout);
  await bot.api.setMyDescription(botDescription);
}

function isAdmin(id: number | undefined): boolean {
  if (!config.adminTelegramId || !id) return false;
  return BigInt(id) === config.adminTelegramId;
}
