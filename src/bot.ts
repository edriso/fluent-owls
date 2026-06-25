import { Bot } from 'grammy';
import { logger } from 'telegram-broadcast-kit';
import { config } from './config';
import { findSlot, runOnce } from './scheduler';
import { schedules } from './schedules';
import { dbEnabled } from './database/client';
import {
  getProfile,
  getStats,
  nextForLearner,
  registerLearner,
  setLevel,
  setReminders,
} from './database/learners';
import { searchGrammar } from './lib/search';
import type { LearnerStats } from './lib/stats';
import { randomOf } from './lib/select';
import { LEVELS, type Level } from './types';
import { CONTENT_COMMANDS, GRAMMAR_COMMAND } from './content-commands';
// Posters used outside the content-command registry: the /grammar topic search,
// the free-text grammar reply, and the personal-tutor /next sequence.
import {
  postDialogue,
  postGrammar,
  postPhrase,
  postPrompt,
  postQuizPoll,
  postVoice,
} from './lib/post';

// Public profile texts the bot self-sets on start (commands + About +
// Description). The bot's display NAME (set to "Professor Owlivia 🦉"), botpic,
// and other profile fields are set in @BotFather, not via the Bot API.
//
// About is BotFather's "short description": ≤120 code points.
export const botAbout =
  'Meet Owlivia 🦉 your English buddy: daily quizzes, phrases, grammar, and audio to shadow, A1 to C2. Tap Start.';

// Description: BotFather's "description", ≤512 code points. Shown on the
// empty-chat start screen before the user presses Start.
export const botDescription = [
  "🦉 Hi! I'm Owlivia (like Olivia, but owl), your tutor at Fluent Owls. Every evening I post a short English set to the channel, to make you both correct and well spoken.",
  'Each day: three quizzes (with explanations), a grammar point, a native phrase, a role-play dialogue, a rotating bonus, and an audio clip to shadow.',
  'Want more? DM /listen for any audio, or /help for all the types. Add a level like b1. Or /next for a personal track with a daily streak.',
  'CEFR A1 to C2. No signup. Tap Start for the channel link.',
].join('\n');

/**
 * Build and configure the Grammy bot. The bot exists mainly to drive scheduled
 * channel posts. The DM surface is intentionally minimal: a /start that points
 * new arrivals to the channel, and optional admin commands that fire a slot on
 * demand for debugging.
 */
export function buildBot(): Bot {
  const bot = new Bot(config.botToken);

  bot.command('start', async (ctx) => {
    if (dbEnabled && ctx.from) await registerLearner(ctx.from.id);
    const link = config.channelUrl;
    const tail = link ? `\n\nJoin the channel: ${link}` : '';
    const tutorLine = dbEnabled
      ? '\nWant a personal track that remembers where you are? Send /next (and set /level). Build a daily /streak.'
      : '';
    await ctx.reply(
      [
        "🦉 Hi! I'm Professor Owlivia (like Olivia, but owl). Call me Owlivia, your tutor at Fluent Owls, which posts a short daily English set to its Telegram channel.",
        '',
        'Each evening: three fill-in-the-blank quizzes (with instant explanations), a grammar point, a "say it like a native" phrase, a role-play dialogue, a rotating bonus (a story, idiom, useful talk, and more, a different one each day), and an audio clip to shadow. A little every day, so you become both correct and well spoken.',
        '',
        'Want more right now? Send /listen for any audio clip, or pick a type: /quiz, /grammar, /phrase, /dialogue, /shadow, /monologue, /prompt, /pronounce, /vocab, /idiom, /story, /talk. Add a level like "b1" to target it (e.g. /story b1), or /help for the full list.' +
          tutorLine,
        tail,
      ].join('\n'),
      { link_preview_options: { is_disabled: true } },
    );
  });

  bot.command('about', async (ctx) => {
    await ctx.reply(
      [
        'Fluent Owls is a tiny Telegram bot, run by Owlivia 🦉, that posts a daily English set to a channel: quizzes, grammar, phrases, role-play dialogues, a rotating bonus (stories, idioms, talks, and more), and audio to shadow.',
        'It has no database. All content lives in the source, organized by CEFR level. Audio is pre-generated, so the bot needs no text-to-speech key to run.',
        'Want more anytime? Send /listen for any audio clip, or /help to see every exercise type. Add a level like b1 to target any of them.',
      ].join('\n'),
    );
  });

  // On-demand content: anyone can pull a random exercise in a DM whenever they
  // want more than the daily set. Stateless (a random pick), so no database is
  // needed; the reply goes to the chat that asked. Every command takes an
  // OPTIONAL CEFR level (e.g. "/story b1"). The list of commands lives in one
  // registry (src/content-commands.ts), which also drives /listen, /help, and
  // the command menu, so the four never drift apart. /grammar is registered
  // separately below because it also does topic search.
  for (const c of CONTENT_COMMANDS) {
    if (c.customHandler) continue;
    bot.command([c.command, ...(c.aliases ?? [])], async (ctx) => {
      if (ctx.chat) await c.send(bot, ctx.chat.id, ctx.match);
    });
  }

  // /grammar is special: a CEFR level ("/grammar b1") gives a random point at
  // that level; any other text ("/grammar present perfect") searches the bank;
  // no argument sends a random point (via the registry).
  bot.command('grammar', async (ctx) => {
    if (!ctx.chat) return;
    const query = ctx.match.trim();
    const isLevel = (LEVELS as readonly string[]).includes(query.toLowerCase());
    if (query && !isLevel) {
      const found = searchGrammar(query);
      if (!found) {
        await ctx.reply(
          `I could not find a grammar point for "${query}". Try a topic like "present perfect" or "conditionals", a level like "b1", or send /grammar for a random one.`,
        );
        return;
      }
      await postGrammar(bot, found, { chatId: ctx.chat.id });
      return;
    }
    await GRAMMAR_COMMAND.send(bot, ctx.chat.id, ctx.match);
  });

  // /listen surfaces the WHOLE audio library: a random clip from any of the
  // audio banks (so a learner can just ask for "some audio"). Takes an optional
  // level too, e.g. "/listen c1". The text-only quiz is excluded; every type
  // here is a voice message (see `inListen` in the registry).
  const listenCommands = CONTENT_COMMANDS.filter((c) => c.inListen);
  bot.command('listen', async (ctx) => {
    if (ctx.chat) await randomOf(listenCommands).send(bot, ctx.chat.id, ctx.match);
  });

  // /help lists everything the bot can send, built from the same registry as the
  // handlers, so it can never list a command that does not exist (or miss one).
  bot.command('help', async (ctx) => {
    const lines = CONTENT_COMMANDS.map(
      (c) => `${c.emoji} ${c.help}: /${c.command}${c.helpNote ? ` ${c.helpNote}` : ''}`,
    );
    await ctx.reply(
      [
        '🦉 What I can send you (each is a random pick; add a level like "b1" to target it, e.g. /story b1):',
        '',
        '🎧 Audio anything: /listen',
        ...lines,
        dbEnabled ? '\n🔥 Personal track: /next, /level, /streak, /reminders' : '',
        '\n— Owlivia 🦉',
      ]
        .join('\n')
        .trim(),
    );
  });

  // Personal tutor (only when a database is configured). /next walks each kind
  // in sequence at the learner's level (no repeats until the pool cycles) and
  // keeps a daily streak; /level sets the level; /streak shows progress. When
  // the database is off, these explain the on-demand commands instead.
  bot.command('next', async (ctx) => {
    if (!ctx.chat || !ctx.from) return;
    if (!dbEnabled) {
      await ctx.reply(
        'Personal tracking is off here. Try /quiz, /grammar, /shadow, etc. for a random one.',
      );
      return;
    }
    const next = await nextForLearner(ctx.from.id);
    if (!next) {
      await ctx.reply('Sorry, I could not load your next item. Please try again in a moment.');
      return;
    }
    const chatId = ctx.chat.id;
    switch (next.pick.kind) {
      case 'quiz':
        await postQuizPoll(bot, next.pick.item, { chatId });
        break;
      case 'grammar':
        await postGrammar(bot, next.pick.item, { chatId });
        break;
      case 'phrase':
        await postPhrase(bot, next.pick.item, { chatId });
        break;
      case 'dialogue':
        await postDialogue(bot, next.pick.item, { chatId });
        break;
      case 'shadow':
        await postVoice(bot, next.pick.item, { chatId });
        break;
      case 'prompt':
        await postPrompt(bot, next.pick.item, { chatId });
        break;
    }
    if (next.isNewDay) {
      await ctx.reply(`🔥 ${next.streak}-day streak! Send /next for the next one.`);
    }
  });

  bot.command('level', async (ctx) => {
    if (!ctx.from) return;
    if (!dbEnabled) {
      await ctx.reply('Personal tracking is off here, so there is no saved level.');
      return;
    }
    const arg = ctx.match.trim().toLowerCase();
    if (!(LEVELS as readonly string[]).includes(arg)) {
      await ctx.reply(
        'Usage: /level a1 (also a2, b1, b2, c1, c2). Your /next items will match it.',
      );
      return;
    }
    await setLevel(ctx.from.id, arg as Level);
    await ctx.reply(
      `Done. Your level is ${arg.toUpperCase()}. /next will now give you ${arg.toUpperCase()} practice.`,
    );
  });

  bot.command('streak', async (ctx) => {
    if (!ctx.from) return;
    if (!dbEnabled) {
      await ctx.reply('Personal tracking is off here, so streaks are not stored.');
      return;
    }
    const profile = await getProfile(ctx.from.id);
    if (!profile) {
      await ctx.reply('Send /next to start your streak.');
      return;
    }
    await ctx.reply(
      `🔥 Streak: ${profile.streak} day(s)\nLevel: ${profile.level.toUpperCase()}\nDaily reminder: ${profile.remindersOn ? 'on' : 'off'} (change with /reminders on|off)\nSend /next to practice and keep it alive.`,
    );
  });

  bot.command('reminders', async (ctx) => {
    if (!ctx.from) return;
    if (!dbEnabled) {
      await ctx.reply('Personal tracking is off here, so there are no reminders.');
      return;
    }
    const arg = ctx.match.trim().toLowerCase();
    if (arg === 'on' || arg === 'off') {
      await setReminders(ctx.from.id, arg === 'on');
      await ctx.reply(
        arg === 'on'
          ? '🔔 Daily reminders are on. I will nudge you each morning to practice.'
          : '🔕 Daily reminders are off. Turn them back on with /reminders on.',
      );
      return;
    }
    const profile = await getProfile(ctx.from.id);
    await ctx.reply(
      `Daily reminders are ${profile?.remindersOn ? 'on' : 'off'}. Use /reminders on or /reminders off to change it.`,
    );
  });

  // Free-text in a DM is treated as a grammar question: "present perfect" or
  // "when do I use the passive?" returns the matching point with audio examples.
  // Commands (starting with /) are handled above; this only catches plain text.
  bot.on('message:text', async (ctx) => {
    if (ctx.chat.type !== 'private') return;
    const text = ctx.message.text.trim();
    if (text.startsWith('/')) return;
    const found = searchGrammar(text);
    if (found) {
      await postGrammar(bot, found, { chatId: ctx.chat.id });
      return;
    }
    await ctx.reply(
      'Ask me about a grammar point (for example "present perfect" or "second conditional") and I will send the rule with examples. Or try /next, /quiz, /shadow, or /prompt.',
    );
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

  // Subscriber counts. Only useful (and only registered) when the personal
  // tutor database is on, since that is the only per-user state we keep.
  if (dbEnabled) {
    bot.command('admin_stats', async (ctx) => {
      if (!isAdmin(ctx.from?.id)) return;
      const stats = await getStats();
      if (!stats) {
        await ctx.reply('No stats available (the tutor database is off).');
        return;
      }
      await ctx.reply(formatStats(stats));
    });
  }

  // Lists every admin command, so the admin never has to remember them. Like the
  // other /admin_* commands it is silent for non-admins, so it never leaks to
  // strangers in DMs. The list is built from the live schedules (one fire
  // command per slot) so it can never drift from what is actually registered.
  bot.command('admin_help', async (ctx) => {
    if (!isAdmin(ctx.from?.id)) return;
    await ctx.reply(adminHelpText());
  });

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
  // The personal-tutor commands appear only when a database is configured.
  // /next is a high-use daily action, so it leads the menu; the tutor settings
  // (level, streak, reminders) are occasional, so they sit lower with the other
  // utility commands.
  const tutorNext = dbEnabled
    ? [{ command: 'next', description: 'Your next item in sequence (keeps a streak)' }]
    : [];
  const tutorSettings = dbEnabled
    ? [
        { command: 'level', description: 'Set your level: /level b1' },
        { command: 'streak', description: 'Show your streak and level' },
        { command: 'reminders', description: 'Daily reminder on/off: /reminders off' },
      ]
    : [];
  // The content commands come from the registry (descriptions and order in one
  // place). /quiz leads, then /listen, then the rest of the registry order.
  const [quizMenu, ...restMenu] = CONTENT_COMMANDS.map((c) => ({
    command: c.command,
    description: c.menu,
  }));
  // Ordered most-used first for better UX: the personal track and quick practice
  // lead, then the content types roughly by popularity, then the settings and
  // meta commands (help, start, about) last.
  await bot.api.setMyCommands([
    ...tutorNext,
    quizMenu,
    { command: 'listen', description: 'Any audio clip, at random (add a level: /listen b1)' },
    ...restMenu,
    ...tutorSettings,
    { command: 'help', description: 'List everything I can send you' },
    { command: 'start', description: 'What Fluent Owls is and how to join the channel' },
    { command: 'about', description: 'About this bot' },
  ]);
  await bot.api.setMyShortDescription(botAbout);
  await bot.api.setMyDescription(botDescription);
}

function isAdmin(id: number | undefined): boolean {
  if (!config.adminTelegramId || !id) return false;
  return BigInt(id) === config.adminTelegramId;
}

/**
 * The /admin_help body: every admin command with a one-line description. The
 * per-slot fire commands are derived from the live schedules so the list never
 * names a command that does not exist. /admin_stats is shown only when the tutor
 * database is on (it is only registered then). Plain text, matching the terse
 * style of the other admin replies.
 */
function adminHelpText(): string {
  const lines = ['Admin commands:'];
  for (const slot of schedules.map((s) => s.name)) {
    lines.push(`/admin_${slot} - post the "${slot}" slot to the channel now`);
  }
  if (dbEnabled) {
    lines.push('/admin_stats - subscriber counts (total, active, by level)');
  }
  lines.push('/admin_help - this list');
  return lines.join('\n');
}

/** Render the subscriber stats as a short plain-text report for /admin_stats. */
function formatStats(stats: LearnerStats): string {
  const byLevel = stats.byLevel.map((b) => `${b.level.toUpperCase()} ${b.count}`).join(', ');
  return [
    `Learners: ${stats.total}`,
    `Practised at least once: ${stats.everPractised}`,
    `Active today: ${stats.activeToday}`,
    `Active this week: ${stats.activeThisWeek}`,
    `Reminders on: ${stats.remindersOn}`,
    `By level: ${byLevel}`,
  ].join('\n');
}
