/**
 * The learner service: everything the personal-tutor commands need. It wraps the
 * pure logic (streak math, item selection) with the database reads and writes.
 * Every function is a no-op returning null when the database is disabled, so
 * callers can stay simple.
 */
import type { RowDataPacket } from 'mysql2';
import { pool } from './client';
import { config } from '../config';
import { dayKeyIn, nextStreak } from '../lib/streak';
import { kindForStep, pickNext, type TutorPick } from '../lib/tutor';
import { LEVELS, type Level } from '../types';

interface LearnerRow extends RowDataPacket {
  telegram_id: number;
  level: string;
  step: number;
  cursors: string | null;
  streak: number;
  last_day: string | null;
}

/** A learner's profile, for /streak and /level. */
export type LearnerProfile = { level: Level; streak: number; lastDay: string | null };

/** Parse the stored cursors JSON into a kind to position map. */
function parseCursors(raw: string | null): Record<string, number> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/** Insert the learner if new, then return their row. */
async function getOrCreate(telegramId: number): Promise<LearnerRow> {
  await pool!.query('INSERT IGNORE INTO learners (telegram_id, cursors) VALUES (?, ?)', [
    telegramId,
    '{}',
  ]);
  const [rows] = await pool!.query<LearnerRow[]>('SELECT * FROM learners WHERE telegram_id = ?', [
    telegramId,
  ]);
  return rows[0]!;
}

/** Register a learner (called by /start). Safe to call repeatedly. */
export async function registerLearner(telegramId: number): Promise<void> {
  if (!pool) return;
  await getOrCreate(telegramId);
}

/** Read a learner's profile, creating the row if needed. */
export async function getProfile(telegramId: number): Promise<LearnerProfile | null> {
  if (!pool) return null;
  const row = await getOrCreate(telegramId);
  return {
    level: (LEVELS as readonly string[]).includes(row.level) ? (row.level as Level) : 'b1',
    streak: row.streak,
    lastDay: row.last_day,
  };
}

/** Set a learner's preferred level. Returns false if the database is off. */
export async function setLevel(telegramId: number, level: Level): Promise<boolean> {
  if (!pool) return false;
  await pool.query(
    'INSERT INTO learners (telegram_id, level, cursors) VALUES (?, ?, ?) ' +
      'ON DUPLICATE KEY UPDATE level = VALUES(level)',
    [telegramId, level, '{}'],
  );
  return true;
}

/**
 * Pick the learner's next item (round-robin across kinds, in sequence within
 * each kind), advance the saved cursors and streak, and return what to send.
 * Returns null when the database is off.
 */
export async function nextForLearner(
  telegramId: number,
): Promise<{ pick: TutorPick; streak: number; isNewDay: boolean; level: Level } | null> {
  if (!pool) return null;
  const row = await getOrCreate(telegramId);
  const level: Level = (LEVELS as readonly string[]).includes(row.level)
    ? (row.level as Level)
    : 'b1';
  const cursors = parseCursors(row.cursors);
  const kind = kindForStep(row.step);
  const position = cursors[kind] ?? 0;

  const result = pickNext(level, row.step, position);
  if (!result) return null;

  const today = dayKeyIn(new Date(), config.timezone);
  const streak = nextStreak(row.last_day, today, row.streak);
  cursors[result.kind] = result.nextPosition;

  await pool.query(
    'UPDATE learners SET step = ?, cursors = ?, streak = ?, last_day = ? WHERE telegram_id = ?',
    [row.step + 1, JSON.stringify(cursors), streak.streak, today, telegramId],
  );

  return { pick: result.pick, streak: streak.streak, isNewDay: streak.isNewDay, level };
}
