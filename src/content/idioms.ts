/**
 * Idiom registry. Mirrors the other content registries: each level has its own
 * bank, this module tags every entry with its level and exposes a pool builder.
 * Idioms are not in the daily batch; they are available on demand (the /idiom
 * command) and via send-test.
 *
 * To add a level bank, create `idioms-<level>.ts`, import it here, and add it to
 * IDIOM_BANKS.
 */
import { LEVELS, type IdiomEntry, type Level, type LeveledIdiomEntry } from '../types';
import { interleaveByLevel } from './pool';

import { a1Idioms } from './idioms-a1';
import { a2Idioms } from './idioms-a2';
import { b1Idioms } from './idioms-b1';
import { b2Idioms } from './idioms-b2';
import { c1Idioms } from './idioms-c1';
import { c2Idioms } from './idioms-c2';

/** The raw, untagged idiom bank for each CEFR level. */
const IDIOM_BANKS: Record<Level, IdiomEntry[]> = {
  a1: a1Idioms,
  a2: a2Idioms,
  b1: b1Idioms,
  b2: b2Idioms,
  c1: c1Idioms,
  c2: c2Idioms,
};

/** Tag a level's idioms with their level so callers know where each came from. */
function tag(level: Level, entries: IdiomEntry[]): LeveledIdiomEntry[] {
  return entries.map((entry) => ({ ...entry, level }));
}

/** Every idiom across every level, tagged with its level. */
export const ALL_IDIOMS: LeveledIdiomEntry[] = LEVELS.flatMap((level) =>
  tag(level, IDIOM_BANKS[level] ?? []),
);

/** Build a pool of idioms drawn from the given band of levels, interleaved. */
export function idiomsPool(levels: readonly Level[]): LeveledIdiomEntry[] {
  return interleaveByLevel(ALL_IDIOMS, levels);
}
