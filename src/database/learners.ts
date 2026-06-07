/**
 * The learner service: everything the personal-tutor commands need, on top of
 * Prisma. It wraps the pure logic (streak math, item selection) with the
 * database reads and writes. Every function is a no-op returning null/false when
 * the database is disabled, so callers can stay simple.
 */
import { prisma } from './client';
import { config } from '../config';
import { dayKeyIn, nextStreak } from '../lib/streak';
import { kindForStep, pickNext, type TutorPick } from '../lib/tutor';
import { LEVELS, type Level } from '../types';

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

/** Coerce a stored level string to a valid Level, defaulting to b1. */
function toLevel(value: string): Level {
  return (LEVELS as readonly string[]).includes(value) ? (value as Level) : 'b1';
}

/** Insert the learner if new, then return their row. */
async function getOrCreate(telegramId: number) {
  return prisma!.learner.upsert({
    where: { telegramId: BigInt(telegramId) },
    create: { telegramId: BigInt(telegramId), cursors: '{}' },
    update: {},
  });
}

/** Register a learner (called by /start). Safe to call repeatedly. */
export async function registerLearner(telegramId: number): Promise<void> {
  if (!prisma) return;
  await getOrCreate(telegramId);
}

/** Read a learner's profile, creating the row if needed. */
export async function getProfile(telegramId: number): Promise<LearnerProfile | null> {
  if (!prisma) return null;
  const row = await getOrCreate(telegramId);
  return { level: toLevel(row.level), streak: row.streak, lastDay: row.lastDay };
}

/** Set a learner's preferred level. Returns false if the database is off. */
export async function setLevel(telegramId: number, level: Level): Promise<boolean> {
  if (!prisma) return false;
  await prisma.learner.upsert({
    where: { telegramId: BigInt(telegramId) },
    create: { telegramId: BigInt(telegramId), level, cursors: '{}' },
    update: { level },
  });
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
  if (!prisma) return null;
  const row = await getOrCreate(telegramId);
  const level = toLevel(row.level);
  const cursors = parseCursors(row.cursors);
  const kind = kindForStep(row.step);
  const position = cursors[kind] ?? 0;

  const result = pickNext(level, row.step, position);
  if (!result) return null;

  const today = dayKeyIn(new Date(), config.timezone);
  const streak = nextStreak(row.lastDay, today, row.streak);
  cursors[result.kind] = result.nextPosition;

  await prisma.learner.update({
    where: { telegramId: BigInt(telegramId) },
    data: {
      step: row.step + 1,
      cursors: JSON.stringify(cursors),
      streak: streak.streak,
      lastDay: today,
    },
  });

  return { pick: result.pick, streak: streak.streak, isNewDay: streak.isNewDay, level };
}
