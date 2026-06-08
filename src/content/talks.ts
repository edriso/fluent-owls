/**
 * Useful-talk registry. Mirrors the other content registries: each level has its
 * own bank, this module tags every talk with its level and exposes a pool
 * builder. Talks are not in the daily batch; they are available on demand (the
 * /talk command) and via send-test.
 *
 * To add a level bank, create `talks-<level>.ts`, import it here, and add it to
 * TALK_BANKS.
 */
import { LEVELS, type Level, type LeveledTalk, type Talk } from '../types';
import { interleaveByLevel } from './pool';

import { a1Talks } from './talks-a1';
import { a2Talks } from './talks-a2';
import { b1Talks } from './talks-b1';
import { b2Talks } from './talks-b2';
import { c1Talks } from './talks-c1';
import { c2Talks } from './talks-c2';

/** The raw, untagged talk bank for each CEFR level. */
const TALK_BANKS: Record<Level, Talk[]> = {
  a1: a1Talks,
  a2: a2Talks,
  b1: b1Talks,
  b2: b2Talks,
  c1: c1Talks,
  c2: c2Talks,
};

/** Tag a level's talks with their level so callers know where each came from. */
function tag(level: Level, talks: Talk[]): LeveledTalk[] {
  return talks.map((talk) => ({ ...talk, level }));
}

/** Every talk across every level, tagged with its level. */
export const ALL_TALKS: LeveledTalk[] = LEVELS.flatMap((level) =>
  tag(level, TALK_BANKS[level] ?? []),
);

/** Build a pool of talks drawn from the given band of levels, interleaved. */
export function talksPool(levels: readonly Level[]): LeveledTalk[] {
  return interleaveByLevel(ALL_TALKS, levels);
}
