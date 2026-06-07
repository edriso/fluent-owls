/**
 * Question bank registry.
 *
 * Each level has its own content file exporting a plain `QuizQuestion[]`. This
 * module is the single place that knows which file maps to which CEFR level: it
 * tags every question with its level (producing {@link LeveledQuestion}s) and
 * exposes a helper to build a pool from a band of levels.
 *
 * To add a new level bank, create `questions-<level>.ts`, import it here, and
 * add it to LEVEL_BANKS. Nothing else needs to change.
 */
import { LEVELS, type Level, type LeveledQuestion, type QuizQuestion } from '../types';
import { interleaveByLevel } from './pool';

import { a1Questions } from './questions-a1';
import { a2Questions } from './questions-a2';
import { b1Questions } from './questions-b1';
import { b2Questions } from './questions-b2';
import { c1Questions } from './questions-c1';
import { c2Questions } from './questions-c2';

/** The raw, untagged bank for each CEFR level. */
const LEVEL_BANKS: Record<Level, QuizQuestion[]> = {
  a1: a1Questions,
  a2: a2Questions,
  b1: b1Questions,
  b2: b2Questions,
  c1: c1Questions,
  c2: c2Questions,
};

/** Tag a level's questions with their level so callers know where each came from. */
function tag(level: Level, questions: QuizQuestion[]): LeveledQuestion[] {
  return questions.map((q) => ({ ...q, level }));
}

/** Every question across every level, tagged with its level. */
export const ALL_QUESTIONS: LeveledQuestion[] = LEVELS.flatMap((level) =>
  tag(level, LEVEL_BANKS[level] ?? []),
);

/**
 * Build a pool of questions drawn from the given band of levels, interleaved by
 * level so a two-level slot alternates day to day. See {@link interleaveByLevel}
 * for the why; the interleave logic is shared with the shadowing and phrase
 * banks so all three content types rotate the same way.
 *
 * @param levels The CEFR levels to include (e.g. ['b1', 'b2']).
 * @returns The questions for those levels, interleaved by level.
 */
export function poolForLevels(levels: readonly Level[]): LeveledQuestion[] {
  return interleaveByLevel(ALL_QUESTIONS, levels);
}
