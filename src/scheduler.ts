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
 * configured timezone) and post it as a quiz poll. Pure orchestration, all the
 * real work lives in pick and post.
 */
export async function runOnce(slot: ScheduleDef, bot: Bot): Promise<void> {
  const pool = poolForLevels(slot.levels);
  if (pool.length === 0) {
    logger.warn('No questions for slot, skipping', { slot: slot.name, levels: slot.levels });
    return;
  }
  const question = pickQuestion(pool, new Date(), config.timezone);
  await postQuizPoll(bot, question);
}

/** Look up a slot by name. Used by /admin commands and the send-test script. */
export function findSlot(name: string): ScheduleDef | undefined {
  return schedules.find((s) => s.name === name);
}

/**
 * Register every schedule with node-cron. A bad cron expression is logged and
 * skipped so one typo never takes the whole bot down. Returns the number of
 * schedules registered, mainly so /health can report it.
 */
export function startScheduler(bot: Bot): number {
  let registered = 0;
  for (const s of schedules) {
    if (!cron.validate(s.cron)) {
      logger.error('Invalid cron expression, skipping schedule', { name: s.name, cron: s.cron });
      continue;
    }
    cron.schedule(
      s.cron,
      async () => {
        logger.info('Schedule fired', { name: s.name, cron: s.cron });
        try {
          await runOnce(s, bot);
        } catch (err) {
          logger.error('Schedule failed', { name: s.name, error: String(err) });
        }
      },
      { timezone: config.timezone },
    );
    registered += 1;
    logger.info('Schedule registered', {
      name: s.name,
      cron: s.cron,
      levels: s.levels,
      timezone: config.timezone,
    });
  }
  return registered;
}
