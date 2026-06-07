/**
 * Shadowing-clip registry.
 *
 * Mirrors the question registry (content/index.ts): each level has its own bank
 * exporting a plain `ShadowingClip[]`, and this module is the single place that
 * maps a file to a CEFR level. It tags every clip with its level (producing
 * {@link LeveledShadowingClip}s) and exposes a pool builder.
 *
 * To add a level bank, create `shadowing-<level>.ts`, import it here, and add it
 * to SHADOWING_BANKS. Nothing else changes.
 */
import { LEVELS, type Level, type LeveledShadowingClip, type ShadowingClip } from '../types';
import { interleaveByLevel } from './pool';

import { a1Shadowing } from './shadowing-a1';
import { a2Shadowing } from './shadowing-a2';
import { b1Shadowing } from './shadowing-b1';
import { b2Shadowing } from './shadowing-b2';
import { c1Shadowing } from './shadowing-c1';
import { c2Shadowing } from './shadowing-c2';

/** The raw, untagged shadowing bank for each CEFR level. */
const SHADOWING_BANKS: Record<Level, ShadowingClip[]> = {
  a1: a1Shadowing,
  a2: a2Shadowing,
  b1: b1Shadowing,
  b2: b2Shadowing,
  c1: c1Shadowing,
  c2: c2Shadowing,
};

/** Tag a level's clips with their level so callers know where each came from. */
function tag(level: Level, clips: ShadowingClip[]): LeveledShadowingClip[] {
  return clips.map((clip) => ({ ...clip, level }));
}

/** Every shadowing clip across every level, tagged with its level. */
export const ALL_SHADOWING: LeveledShadowingClip[] = LEVELS.flatMap((level) =>
  tag(level, SHADOWING_BANKS[level] ?? []),
);

/**
 * Build a pool of shadowing clips drawn from the given band of levels,
 * interleaved by level. The daily shadowing slot pools every level (see
 * schedules.ts) so a learner meets a different level each day, always with the
 * level shown in the caption.
 */
export function shadowingPool(levels: readonly Level[]): LeveledShadowingClip[] {
  return interleaveByLevel(ALL_SHADOWING, levels);
}
