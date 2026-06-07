/**
 * Pronunciation-drill registry. Mirrors the other content registries: each level
 * has its own bank, this module tags every drill with its level and exposes a
 * pool builder. Pronunciation drills are not in the daily batch; they are
 * available on demand (the /pron command) and via send-test.
 *
 * To add a level bank, create `pronunciation-<level>.ts`, import it here, and add
 * it to PRONUNCIATION_BANKS.
 */
import {
  LEVELS,
  type Level,
  type LeveledPronunciationDrill,
  type PronunciationDrill,
} from '../types';
import { interleaveByLevel } from './pool';

import { a1Pronunciation } from './pronunciation-a1';
import { a2Pronunciation } from './pronunciation-a2';
import { b1Pronunciation } from './pronunciation-b1';
import { b2Pronunciation } from './pronunciation-b2';
import { c1Pronunciation } from './pronunciation-c1';
import { c2Pronunciation } from './pronunciation-c2';

/** The raw, untagged pronunciation bank for each CEFR level. */
const PRONUNCIATION_BANKS: Record<Level, PronunciationDrill[]> = {
  a1: a1Pronunciation,
  a2: a2Pronunciation,
  b1: b1Pronunciation,
  b2: b2Pronunciation,
  c1: c1Pronunciation,
  c2: c2Pronunciation,
};

/** Tag a level's drills with their level so callers know where each came from. */
function tag(level: Level, drills: PronunciationDrill[]): LeveledPronunciationDrill[] {
  return drills.map((drill) => ({ ...drill, level }));
}

/** Every pronunciation drill across every level, tagged with its level. */
export const ALL_PRONUNCIATION: LeveledPronunciationDrill[] = LEVELS.flatMap((level) =>
  tag(level, PRONUNCIATION_BANKS[level] ?? []),
);

/** Build a pool of pronunciation drills drawn from the given band of levels, interleaved. */
export function pronunciationPool(levels: readonly Level[]): LeveledPronunciationDrill[] {
  return interleaveByLevel(ALL_PRONUNCIATION, levels);
}
