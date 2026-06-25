/**
 * Pure subscriber-stats math for /admin_stats, kept separate from the database
 * so it can be unit-tested with no connection (the same split as streak.ts and
 * tutor.ts). It takes the few learner fields it needs plus the day strings to
 * compare against, so all date logic stays in the timezone-safe caller.
 */
import { LEVELS, type Level } from '../types';

/** The minimal learner shape the summary needs (a subset of the DB row). */
export type LearnerStatRow = {
  level: Level;
  lastDay: string | null;
  remindersOn: boolean;
};

/** Counts for /admin_stats: a total plus the natural breakdowns the schema supports. */
export type LearnerStats = {
  /** Every learner row (anyone who ever sent /start). */
  total: number;
  /** Learners who have practised at least once (lastDay set). */
  everPractised: number;
  /** Practised today (the bot's calendar day). */
  activeToday: number;
  /** Practised within the last 7 days (today included). */
  activeThisWeek: number;
  /** Have the daily reminder turned on. */
  remindersOn: number;
  /** Headcount per CEFR level, in LEVELS order (always every level, zero-filled). */
  byLevel: { level: Level; count: number }[];
};

/** Whole-day difference between two "YYYY-MM-DD" strings (b - a), date-only. */
function dayDiff(a: string, b: string): number {
  const ta = Date.parse(`${a}T00:00:00Z`);
  const tb = Date.parse(`${b}T00:00:00Z`);
  return Math.round((tb - ta) / 86_400_000);
}

/**
 * Summarise the learner rows into the counts /admin_stats shows. `today` and the
 * 7-day window are passed in (not computed here) so the date math stays
 * timezone-safe and testable, matching streak.ts.
 */
export function summarizeLearners(rows: LearnerStatRow[], today: string): LearnerStats {
  // Start every level at zero so a missing level still shows (a stable table).
  const counts = new Map<Level, number>(LEVELS.map((l) => [l, 0]));
  let everPractised = 0;
  let activeToday = 0;
  let activeThisWeek = 0;
  let remindersOn = 0;

  for (const row of rows) {
    counts.set(row.level, (counts.get(row.level) ?? 0) + 1);
    if (row.remindersOn) remindersOn += 1;
    if (row.lastDay) {
      everPractised += 1;
      const ago = dayDiff(row.lastDay, today);
      // ago can be negative if a learner's clock ran ahead; count that as today.
      if (ago <= 0) activeToday += 1;
      if (ago <= 6) activeThisWeek += 1;
    }
  }

  return {
    total: rows.length,
    everPractised,
    activeToday,
    activeThisWeek,
    remindersOn,
    byLevel: LEVELS.map((level) => ({ level, count: counts.get(level) ?? 0 })),
  };
}
