/**
 * Monologue registry. Mirrors the other content registries: each level has its
 * own bank, this module tags every passage with its level and exposes a pool
 * builder. Monologues are not in the daily batch; they are available on demand
 * (the /monologue command) and via send-test.
 *
 * To add a level bank, create `monologues-<level>.ts`, import it here, and add it
 * to MONOLOGUE_BANKS.
 */
import { LEVELS, type Level, type LeveledMonologue, type Monologue } from '../types';
import { interleaveByLevel } from './pool';

import { a1Monologues } from './monologues-a1';
import { a2Monologues } from './monologues-a2';
import { b1Monologues } from './monologues-b1';
import { b2Monologues } from './monologues-b2';
import { c1Monologues } from './monologues-c1';
import { c2Monologues } from './monologues-c2';

/** The raw, untagged monologue bank for each CEFR level. */
const MONOLOGUE_BANKS: Record<Level, Monologue[]> = {
  a1: a1Monologues,
  a2: a2Monologues,
  b1: b1Monologues,
  b2: b2Monologues,
  c1: c1Monologues,
  c2: c2Monologues,
};

/** Tag a level's monologues with their level so callers know where each came from. */
function tag(level: Level, monologues: Monologue[]): LeveledMonologue[] {
  return monologues.map((monologue) => ({ ...monologue, level }));
}

/** Every monologue across every level, tagged with its level. */
export const ALL_MONOLOGUES: LeveledMonologue[] = LEVELS.flatMap((level) =>
  tag(level, MONOLOGUE_BANKS[level] ?? []),
);

/** Build a pool of monologues drawn from the given band of levels, interleaved. */
export function monologuesPool(levels: readonly Level[]): LeveledMonologue[] {
  return interleaveByLevel(ALL_MONOLOGUES, levels);
}
