import type { Bot } from 'grammy';
import { Scheduler, logger } from 'telegram-broadcast-kit';
import { config } from './config';
import { schedules, type ScheduleDef } from './schedules';
import { poolForLevels } from './content/index';
import { shadowingPool } from './content/shadowing';
import { phrasesPool } from './content/phrases';
import { dialoguesPool } from './content/dialogues';
import { pickForDay } from './lib/pick';
import { postDialogue, postPhrase, postQuizPoll, postVoice } from './lib/post';

// The bot-specific schedule layer. The generic cron plumbing (error
// containment, the node-cron registry, cron validation) now lives in
// telegram-broadcast-kit's Scheduler; this file keeps everything
// fluent-owls-specific on top of it: the daily batch, per-slot dispatch, and
// the silent/audible ordering.

// One Scheduler per bot, holding the live cron task so it can be stopped on
// shutdown. Built lazily on the first startScheduler call.
let scheduler: Scheduler | null = null;

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
 * Register the single daily batch with the kernel's Scheduler. The Scheduler
 * validates the cron (a bad expression is logged and skipped, never crashing
 * the bot) and wraps every fire in error containment so one bad tick cannot
 * kill the loop. Returns the number of posts the batch makes (so /health
 * can report it), or 0 if the cron was invalid.
 */
export function startScheduler(bot: Bot): number {
  scheduler = new Scheduler(config.timezone);
  const registered = scheduler.start([
    {
      name: 'daily-batch',
      cron: config.dailyCron,
      run: () => runDailyBatch(bot),
    },
  ]);
  if (registered === 0) {
    logger.error('Invalid DAILY_CRON, scheduler not started', { cron: config.dailyCron });
    return 0;
  }
  logger.info('Daily batch scheduled', {
    cron: config.dailyCron,
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
