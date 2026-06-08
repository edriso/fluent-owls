import type { Bot } from 'grammy';
import { Scheduler, logger, dayOfYearIn } from 'telegram-broadcast-kit';
import { config } from './config';
import { schedules, type ScheduleDef } from './schedules';
import { poolForLevels } from './content/index';
import { shadowingPool } from './content/shadowing';
import { phrasesPool } from './content/phrases';
import { dialoguesPool } from './content/dialogues';
import { grammarPool } from './content/grammar';
import { monologuesPool } from './content/monologues';
import { promptsPool } from './content/prompts';
import { pronunciationPool } from './content/pronunciation';
import { vocabularyPool } from './content/vocabulary';
import { idiomsPool } from './content/idioms';
import { storiesPool } from './content/stories';
import { talksPool } from './content/talks';
import { pickForDay } from './lib/pick';
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
import { dbEnabled } from './database/client';
import { getLearnersToRemind } from './database/learners';
import { dayKeyIn } from './lib/streak';

// The bot-specific schedule layer. The generic cron plumbing (error
// containment, the node-cron registry, cron validation) now lives in
// telegram-broadcast-kit's Scheduler; this file keeps everything
// fluent-owls-specific on top of it: the daily batch, per-slot dispatch, and
// the silent/audible ordering.

// One Scheduler per bot, holding the live cron task so it can be stopped on
// shutdown. Built lazily on the first startScheduler call.
let scheduler: Scheduler | null = null;

/**
 * The "bonus" slot rotation. The daily batch posts ONE of these richer types
 * each day, cycling through the list by day of year, so channel followers slowly
 * meet the whole library (vocabulary, idioms, stories, talks, pronunciation,
 * monologues, prompts) without ever DMing the bot. These types are otherwise
 * on-demand only; the bonus slot is how they reach the channel. It reuses the
 * already-committed audio, so it costs nothing extra to run.
 *
 * Each entry builds its pool for the slot's levels and posts the day's pick in
 * its own shape. Order is the rotation order; add or reorder to taste.
 */
type BonusType = {
  label: string;
  /**
   * Post the day's item for this type, or return false if its bank is empty
   * (logged, never an error). Each entry closes over its own pool and poster, so
   * the pool element type and the poster's argument type always agree.
   */
  run: (bot: Bot, slot: ScheduleDef, now: Date) => Promise<boolean>;
};

/** Build one rotation entry, pairing a pool with its matching poster. */
function bonusType<T>(
  label: string,
  pool: (levels: readonly import('./types').Level[]) => T[],
  post: (bot: Bot, item: T, opts: { silent: boolean }) => Promise<number | null>,
): BonusType {
  return {
    label,
    run: async (bot, slot, now) => {
      const items = pool(slot.levels);
      if (items.length === 0) return false;
      await post(bot, pickForDay(items, now, config.timezone), { silent: slot.silent });
      return true;
    },
  };
}

const BONUS_ROTATION: readonly BonusType[] = [
  bonusType('vocabulary', vocabularyPool, postVocabulary),
  bonusType('idiom', idiomsPool, postIdiom),
  bonusType('story', storiesPool, postStory),
  bonusType('talk', talksPool, postTalk),
  bonusType('pronunciation', pronunciationPool, postPronunciation),
  bonusType('monologue', monologuesPool, postMonologue),
  bonusType('prompt', promptsPool, postPrompt),
];

/**
 * Fire one slot: pick today's item from the slot's content bank (deterministic
 * by day of year, in the configured timezone) and post it in the shape the slot
 * calls for, a quiz poll, a shadowing voice message, or a native-phrase
 * message. Silent slots post without a notification sound. Pure orchestration;
 * the real work lives in the pickers and posters.
 */
export async function runOnce(slot: ScheduleDef, bot: Bot): Promise<void> {
  const now = new Date();
  switch (slot.kind) {
    case 'quiz': {
      const pool = poolForLevels(slot.levels);
      if (pool.length === 0) {
        logger.warn('No questions for slot, skipping', { slot: slot.name, levels: slot.levels });
        return;
      }
      await postQuizPoll(bot, pickForDay(pool, now, config.timezone), { silent: slot.silent });
      return;
    }
    case 'shadow': {
      const pool = shadowingPool(slot.levels);
      if (pool.length === 0) {
        logger.warn('No shadowing clips for slot, skipping', {
          slot: slot.name,
          levels: slot.levels,
        });
        return;
      }
      await postVoice(bot, pickForDay(pool, now, config.timezone), { silent: slot.silent });
      return;
    }
    case 'phrase': {
      const pool = phrasesPool(slot.levels);
      if (pool.length === 0) {
        logger.warn('No phrases for slot, skipping', { slot: slot.name, levels: slot.levels });
        return;
      }
      await postPhrase(bot, pickForDay(pool, now, config.timezone), { silent: slot.silent });
      return;
    }
    case 'dialogue': {
      const pool = dialoguesPool(slot.levels);
      if (pool.length === 0) {
        logger.warn('No dialogues for slot, skipping', { slot: slot.name, levels: slot.levels });
        return;
      }
      await postDialogue(bot, pickForDay(pool, now, config.timezone), { silent: slot.silent });
      return;
    }
    case 'grammar': {
      const pool = grammarPool(slot.levels);
      if (pool.length === 0) {
        logger.warn('No grammar for slot, skipping', { slot: slot.name, levels: slot.levels });
        return;
      }
      await postGrammar(bot, pickForDay(pool, now, config.timezone), { silent: slot.silent });
      return;
    }
    case 'bonus': {
      // Rotate the richer on-demand types by day of year, so the channel slowly
      // sees the whole library. The same day always picks the same type and item
      // (no state), matching the rest of the batch.
      const doy = dayOfYearIn(now, config.timezone);
      const bonus = BONUS_ROTATION[(doy - 1) % BONUS_ROTATION.length]!;
      const posted = await bonus.run(bot, slot, now);
      if (!posted) {
        logger.warn('No bonus items for slot, skipping', {
          slot: slot.name,
          type: bonus.label,
          levels: slot.levels,
        });
      }
      return;
    }
  }
}

/**
 * Post the whole daily batch, in order. Posting is sequential (await each) so
 * the feed reads warm-up, stretch, challenge, then the native phrase, then the
 * shadowing clip, with the one audible post landing last. One slot failing is
 * logged and never stops the others.
 */
export async function runDailyBatch(bot: Bot): Promise<void> {
  for (const slot of schedules) {
    try {
      await runOnce(slot, bot);
    } catch (err) {
      logger.error('Slot failed in daily batch', { name: slot.name, error: String(err) });
    }
  }
}

/** Look up a slot by name. Used by /admin commands and the send-test script. */
export function findSlot(name: string): ScheduleDef | undefined {
  return schedules.find((s) => s.name === name);
}

/**
 * Send the daily practice reminder (personal tutor only). DMs every learner who
 * has reminders on, has practised before, and has not practised today, nudging
 * them to keep their streak. Each send is wrapped so one blocked user cannot
 * stop the rest. A no-op when the database is off.
 */
export async function runReminders(bot: Bot): Promise<void> {
  if (!dbEnabled) return;
  const today = dayKeyIn(new Date(), config.timezone);
  const learners = await getLearnersToRemind(today);
  let sent = 0;
  for (const learner of learners) {
    try {
      await bot.api.sendMessage(
        learner.telegramId,
        `🦉 Time for today's English! Send /next to keep your ${learner.streak}-day streak going.`,
      );
      sent += 1;
    } catch (err) {
      // A blocked or deleted chat is routine; log and keep going.
      logger.warn('Reminder send failed', { telegramId: learner.telegramId, error: String(err) });
    }
  }
  logger.info('Reminders sent', { sent, candidates: learners.length });
}

/**
 * Register the single daily batch with the kernel's Scheduler. The Scheduler
 * validates the cron (a bad expression is logged and skipped, never crashing
 * the bot) and wraps every fire in error containment so one bad tick cannot
 * kill the loop. Returns the number of posts the batch makes (so /health
 * can report it), or 0 if the cron was invalid.
 */
export function startScheduler(bot: Bot): number {
  scheduler = new Scheduler(config.timezone);
  const jobs = [
    {
      name: 'daily-batch',
      cron: config.dailyCron,
      run: () => runDailyBatch(bot),
    },
  ];
  // Only schedule the personal reminder when the tutor database is enabled.
  if (dbEnabled) {
    jobs.push({
      name: 'reminders',
      cron: config.reminderCron,
      run: () => runReminders(bot),
    });
  }
  const registered = scheduler.start(jobs);
  if (registered === 0) {
    logger.error('Invalid cron, scheduler not started', {
      dailyCron: config.dailyCron,
      reminderCron: config.reminderCron,
    });
    return 0;
  }
  logger.info('Scheduler started', {
    dailyCron: config.dailyCron,
    reminderCron: dbEnabled ? config.reminderCron : null,
    posts: schedules.length,
    timezone: config.timezone,
  });
  return schedules.length;
}

/** Stop the scheduler (clean shutdown). Safe to call when never started. */
export function stopScheduler(): void {
  scheduler?.stop();
  scheduler = null;
}
