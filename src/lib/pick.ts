import { dayOfYearIn } from 'telegram-broadcast-kit';
import type { LeveledQuestion } from '../types';

// The timezone-aware day-of-year math (dayOfYearIn) lives in the shared
// kernel now. This file keeps only the fluent-owls-specific picker: a generic,
// strongly-typed pick over a pool of LeveledQuestions that THROWS on an empty
// pool (the kit's pickForDay is string-only and returns null, which does not
// fit a typed-question pool whose emptiness is a real bug, not a skipped tick).

/**
 * Deterministic daily picker. The same calendar day always picks the same
 * item, so a redeploy mid-day cannot accidentally re-pick a "new" question for
 * the same slot. Each band keeps its own pool, so the bands advance
 * independently across the year.
 *
 * Why deterministic and not random: no database, no state file. The cycle
 * length equals the pool size, so adding questions lengthens the cycle for free.
 */
export function pickForDay<T>(pool: readonly T[], date: Date, timezone: string): T {
  if (pool.length === 0) {
    throw new Error('Cannot pick from an empty pool');
  }
  const doy = dayOfYearIn(date, timezone);
  const item = pool[(doy - 1) % pool.length];
  if (!item) {
    throw new Error('Internal: picker returned undefined');
  }
  return item;
}

/** Convenience wrapper used by the scheduler and scripts. */
export function pickQuestion(
  pool: readonly LeveledQuestion[],
  date: Date,
  timezone: string,
): LeveledQuestion {
  return pickForDay(pool, date, timezone);
}
