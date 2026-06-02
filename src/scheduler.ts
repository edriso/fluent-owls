import type { Bot } from 'grammy';
import { Scheduler, logger } from 'telegram-broadcast-kit';
import { config } from './config';
import { schedules, type ScheduleDef } from './schedules';
import { poolForLevels } from './content/index';
import { pickQuestion } from './lib/pick';
import { postQuizPoll } from './lib/post';

// The bot-specific schedule layer. The generic cron plumbing (error
// containment, the node-cron registry, cron validation) now lives in
// telegram-broadcast-kit's Scheduler; this file keeps everything
// fluent-owls-specific on top of it: the daily batch, per-slot dispatch, and
// the silent/audible ordering.

// One Scheduler per bot, holding the live cron task so it can be stopped on
// shutdown. Built lazily on the first startScheduler call.
let scheduler: Scheduler | null = null;

/**
 * Fire one slot: pick today's question from the slot's level band (in the
 * configured timezone) and post it as a quiz poll. Silent slots post without a
 * notification sound. Pure orchestration; the real work lives in pick and post.
 */
export async function runOnce(slot: ScheduleDef, bot: Bot): Promise<void> {
  const pool = poolForLevels(slot.levels);
  if (pool.length === 0) {
    logger.warn('No questions for slot, skipping', { slot: slot.name, levels: slot.levels });
    return;
  }
  const question = pickQuestion(pool, new Date(), config.timezone);
  await postQuizPoll(bot, question, { silent: slot.silent });
}

/**
 * Post the whole daily batch, in order. Posting is sequential (await each) so
 * the feed reads warm-up, then stretch, then challenge, and the one audible
 * post lands last. One slot failing is logged and never stops the others.
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
 * kill the loop. Returns the number of questions the batch posts (so /health
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
    questions: schedules.length,
    timezone: config.timezone,
  });
  return schedules.length;
}

/** Stop the scheduler (clean shutdown). Safe to call when never started. */
export function stopScheduler(): void {
  scheduler?.stop();
  scheduler = null;
}
