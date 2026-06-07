/**
 * Pure streak math, kept separate from the database so it can be unit-tested
 * with no connection. A "day" is a calendar day in the bot's timezone, encoded
 * as a "YYYY-MM-DD" string. A streak counts consecutive days on which the
 * learner practised (used /next at least once).
 */

/** The calendar day in the given timezone, as "YYYY-MM-DD". */
export function dayKeyIn(date: Date, timezone: string): string {
  // en-CA formats as YYYY-MM-DD, and Intl applies the timezone correctly, so a
  // UTC host serving a Cairo-time learner still gets the right calendar day.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Whole-day difference between two "YYYY-MM-DD" strings (b - a), date-only. */
function dayDiff(a: string, b: string): number {
  const ta = Date.parse(`${a}T00:00:00Z`);
  const tb = Date.parse(`${b}T00:00:00Z`);
  return Math.round((tb - ta) / 86_400_000);
}

/**
 * Work out the new streak when a learner practises on `today`.
 *
 *  - First ever practice: streak 1.
 *  - Already practised today: unchanged (we never double-count a day).
 *  - Practised yesterday: streak + 1.
 *  - Any longer gap (or a clock oddity): reset to 1.
 *
 * Returns the new streak and whether today is a fresh practice day.
 */
export function nextStreak(
  lastDay: string | null,
  today: string,
  previous: number,
): { streak: number; isNewDay: boolean } {
  if (!lastDay) return { streak: 1, isNewDay: true };
  if (lastDay === today) return { streak: previous, isNewDay: false };
  if (dayDiff(lastDay, today) === 1) return { streak: previous + 1, isNewDay: true };
  return { streak: 1, isNewDay: true };
}
