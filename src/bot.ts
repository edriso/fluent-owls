import { Bot } from 'grammy';
import { logger } from 'telegram-broadcast-kit';
import { config } from './config';
import { findSlot, runOnce } from './scheduler';
import { schedules } from './schedules';
import { dbEnabled } from './database/client';
import {
  getProfile,
  nextForLearner,
  registerLearner,
  setLevel,
  setReminders,
} from './database/learners';
import { searchGrammar } from './lib/search';
import { poolForLevel, randomOf } from './lib/select';
import { LEVELS, type Level } from './types';
import { ALL_QUESTIONS } from './content/index';
import { ALL_SHADOWING } from './content/shadowing';
import { ALL_DIALOGUES } from './content/dialogues';
import { ALL_PHRASES } from './content/phrases';
import { ALL_GRAMMAR } from './content/grammar';
import { ALL_MONOLOGUES } from './content/monologues';
import { ALL_PROMPTS } from './content/prompts';
import { ALL_PRONUNCIATION } from './content/pronunciation';
import { ALL_VOCABULARY } from './content/vocabulary';
import { ALL_IDIOMS } from './content/idioms';
import { ALL_STORIES } from './content/stories';
import { ALL_TALKS } from './content/talks';
import {
  postDialogue,
  postGrammar,
  postIdiom,
  postMonologue,
  postPhrase,
  postPrompt,
  postPronunciation,
  postQuizPoll,
  postStory,
  postTalk,
  postVocabulary,
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
  'Each day: three quizzes (with explanations), a grammar point, a native phrase, a role-play dialogue, and an audio clip to shadow.',
  'Want more? DM /listen for any audio clip, or /help to see all the exercise types. Add a level like b1 to target it. Or /next for a personal track with a daily streak.',
  'By CEFR level (A1 to C2). No signup. Tap Start for the channel link.',
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
        '🦉 Hi! Fluent Owls posts a short daily English set to its Telegram channel.',
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
        'Fluent Owls is a tiny Telegram bot that posts a daily English set to a channel: quizzes, grammar, phrases, role-play dialogues, a rotating bonus (stories, idioms, talks, and more), and audio to shadow.',
        'It has no database. All content lives in the source, organized by CEFR level. Audio is pre-generated, so the bot needs no text-to-speech key to run.',
        'Want more anytime? Send /listen for any audio clip, or /help to see every exercise type. Add a level like b1 to target any of them.',
      ].join('\n'),
    );
  });

  // On-demand content: anyone can pull a random exercise in a DM whenever they
  // want more than the daily set. Stateless (a random pick), so no database is
  // needed; the reply goes to the chat that asked. Every command takes an
  // OPTIONAL CEFR level (e.g. "/story b1"), so a learner can target their level;
  // with no level it draws from all of them (see poolForLevel).
  bot.command('quiz', async (ctx) => {
    if (ctx.chat)
      await postQuizPoll(bot, randomOf(poolForLevel(ALL_QUESTIONS, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  // /grammar is special: a CEFR level ("/grammar b1") gives a random point at
  // that level; any other text ("/grammar present perfect") searches the bank;
  // no argument sends a random point.
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
    await postGrammar(bot, randomOf(poolForLevel(ALL_GRAMMAR, ctx.match)), { chatId: ctx.chat.id });
  });
  bot.command('phrase', async (ctx) => {
    if (ctx.chat)
      await postPhrase(bot, randomOf(poolForLevel(ALL_PHRASES, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  bot.command('dialogue', async (ctx) => {
    if (ctx.chat)
      await postDialogue(bot, randomOf(poolForLevel(ALL_DIALOGUES, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  bot.command('shadow', async (ctx) => {
    if (ctx.chat)
      await postVoice(bot, randomOf(poolForLevel(ALL_SHADOWING, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  bot.command('monologue', async (ctx) => {
    if (ctx.chat)
      await postMonologue(bot, randomOf(poolForLevel(ALL_MONOLOGUES, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  bot.command('prompt', async (ctx) => {
    if (ctx.chat)
      await postPrompt(bot, randomOf(poolForLevel(ALL_PROMPTS, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  // /pronounce is the public name; /pron stays as a quiet (unlisted) alias so
  // anyone who learned the old command is not broken.
  bot.command(['pronounce', 'pron'], async (ctx) => {
    if (ctx.chat)
      await postPronunciation(bot, randomOf(poolForLevel(ALL_PRONUNCIATION, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  bot.command('vocab', async (ctx) => {
    if (ctx.chat)
      await postVocabulary(bot, randomOf(poolForLevel(ALL_VOCABULARY, ctx.match)), {
        chatId: ctx.chat.id,
      });
  });
  bot.command('idiom', async (ctx) => {
    if (ctx.chat)
      await postIdiom(bot, randomOf(poolForLevel(ALL_IDIOMS, ctx.match)), { chatId: ctx.chat.id });
  });
  bot.command('story', async (ctx) => {
    if (ctx.chat)
      await postStory(bot, randomOf(poolForLevel(ALL_STORIES, ctx.match)), { chatId: ctx.chat.id });
  });
  bot.command('talk', async (ctx) => {
    if (ctx.chat)
      await postTalk(bot, randomOf(poolForLevel(ALL_TALKS, ctx.match)), { chatId: ctx.chat.id });
  });

  // /listen surfaces the WHOLE audio library: a random clip from any of the
  // audio banks (so a learner can just ask for "some audio"). Takes an optional
  // level too, e.g. "/listen c1". Quizzes and text-only items are excluded; every
  // kind here is a voice message.
  bot.command('listen', async (ctx) => {
    if (!ctx.chat) return;
    const chatId = ctx.chat.id;
    const arg = ctx.match;
    const pick = randomOf([
      'shadow',
      'dialogue',
      'grammar',
      'monologue',
      'prompt',
      'pron',
      'vocab',
      'idiom',
      'story',
      'talk',
      'phrase',
    ] as const);
    switch (pick) {
      case 'shadow':
        await postVoice(bot, randomOf(poolForLevel(ALL_SHADOWING, arg)), { chatId });
        break;
      case 'dialogue':
        await postDialogue(bot, randomOf(poolForLevel(ALL_DIALOGUES, arg)), { chatId });
        break;
      case 'grammar':
        await postGrammar(bot, randomOf(poolForLevel(ALL_GRAMMAR, arg)), { chatId });
        break;
      case 'monologue':
        await postMonologue(bot, randomOf(poolForLevel(ALL_MONOLOGUES, arg)), { chatId });
        break;
      case 'prompt':
        await postPrompt(bot, randomOf(poolForLevel(ALL_PROMPTS, arg)), { chatId });
        break;
      case 'pron':
        await postPronunciation(bot, randomOf(poolForLevel(ALL_PRONUNCIATION, arg)), { chatId });
        break;
      case 'vocab':
        await postVocabulary(bot, randomOf(poolForLevel(ALL_VOCABULARY, arg)), { chatId });
        break;
      case 'idiom':
        await postIdiom(bot, randomOf(poolForLevel(ALL_IDIOMS, arg)), { chatId });
        break;
      case 'story':
        await postStory(bot, randomOf(poolForLevel(ALL_STORIES, arg)), { chatId });
        break;
      case 'talk':
        await postTalk(bot, randomOf(poolForLevel(ALL_TALKS, arg)), { chatId });
        break;
      case 'phrase':
        await postPhrase(bot, randomOf(poolForLevel(ALL_PHRASES, arg)), { chatId });
        break;
    }
  });

  // /help lists everything the bot can send, grouped, with the optional-level tip.
  bot.command('help', async (ctx) => {
    await ctx.reply(
      [
        '🦉 What I can send you (each is a random pick; add a level like "b1" to target it, e.g. /story b1):',
        '',
        '🎧 Audio anything: /listen',
        '📝 Quiz: /quiz',
        '📘 Grammar: /grammar (or a topic: /grammar present perfect)',
        '🗣️ Native phrase: /phrase',
        '🎭 Role-play dialogue: /dialogue',
        '🔁 Shadowing clip: /shadow',
        '🎙️ Monologue to retell: /monologue',
        '🎤 Question to answer: /prompt',
        '🔊 Pronunciation drill: /pronounce',
        '📖 Vocabulary word: /vocab',
        '💡 Idiom: /idiom',
        '📚 Short story: /story',
        '🧠 Useful talk: /talk',
        dbEnabled ? '\n🔥 Personal track: /next, /level, /streak, /reminders' : '',
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
  const tutorCommands = dbEnabled
    ? [
        { command: 'next', description: 'Your next item in sequence (keeps a streak)' },
        { command: 'level', description: 'Set your level: /level b1' },
        { command: 'streak', description: 'Show your streak and level' },
        { command: 'reminders', description: 'Daily reminder on/off: /reminders off' },
      ]
    : [];
  await bot.api.setMyCommands([
    { command: 'start', description: 'What Fluent Owls is and how to join the channel' },
    { command: 'help', description: 'List everything I can send you' },
    { command: 'listen', description: 'Any audio clip, at random (add a level: /listen b1)' },
    { command: 'quiz', description: 'A random quiz (add a level: /quiz a2)' },
    { command: 'grammar', description: 'A grammar point; add a topic or level: /grammar b1' },
    { command: 'phrase', description: 'A "say it like a native" phrase (audio; add a level)' },
    { command: 'dialogue', description: 'A role-play dialogue (audio; add a level)' },
    { command: 'shadow', description: 'A shadowing clip (audio; add a level)' },
    { command: 'monologue', description: 'A passage to retell (audio; add a level)' },
    { command: 'prompt', description: 'A question to answer out loud (audio; add a level)' },
    { command: 'pronounce', description: 'A pronunciation drill (audio; add a level)' },
    { command: 'vocab', description: 'A word to learn, with examples (audio; add a level)' },
    { command: 'idiom', description: 'An idiom to sound native (audio; add a level)' },
    { command: 'story', description: 'A short story to listen to and retell (audio; add a level)' },
    {
      command: 'talk',
      description: 'A useful talk on focus, health, or habits (audio; add a level)',
    },
    ...tutorCommands,
    // /about goes last in the menu, by preference.
    { command: 'about', description: 'About this bot' },
  ]);
  await bot.api.setMyShortDescription(botAbout);
  await bot.api.setMyDescription(botDescription);
}

function isAdmin(id: number | undefined): boolean {
  if (!config.adminTelegramId || !id) return false;
  return BigInt(id) === config.adminTelegramId;
}
