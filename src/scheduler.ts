import cron from 'node-cron';
import type { Bot } from 'grammy';
import { config } from './config';
import { logger } from './lib/logger';
import { schedules, type ScheduleDef } from './schedules';
import { poolForLevels } from './content/index';
import { pickQuestion } from './lib/pick';
import { postQuizPoll } from './lib/post';

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
 * Register the single daily batch with node-cron. A bad cron expression is
 * logged and the batch is skipped, rather than crashing the bot. Returns the
 * number of questions the batch posts (so /health can report it), or 0 if the
 * cron was invalid.
 */
export function startScheduler(bot: Bot): number {
  if (!cron.validate(config.dailyCron)) {
    logger.error('Invalid DAILY_CRON, scheduler not started', { cron: config.dailyCron });
    return 0;
  }
  cron.schedule(
    config.dailyCron,
    async () => {
      logger.info('Daily batch fired', { cron: config.dailyCron, questions: schedules.length });
      await runDailyBatch(bot);
    },
    { timezone: config.timezone },
  );
  logger.info('Daily batch scheduled', {
    cron: config.dailyCron,
    questions: schedules.length,
    timezone: config.timezone,
  });
  return schedules.length;
}
