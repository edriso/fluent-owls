/**
 * Vocabulary registry. Mirrors the other content registries: each level has its
 * own bank, this module tags every entry with its level and exposes a pool
 * builder. Vocabulary entries are not in the daily batch; they are available on
 * demand (the /vocab command) and via send-test.
 *
 * To add a level bank, create `vocabulary-<level>.ts`, import it here, and add it
 * to VOCABULARY_BANKS.
 */
import { LEVELS, type Level, type LeveledVocabularyEntry, type VocabularyEntry } from '../types';
import { interleaveByLevel } from './pool';

import { a1Vocabulary } from './vocabulary-a1';
import { a2Vocabulary } from './vocabulary-a2';
import { b1Vocabulary } from './vocabulary-b1';
import { b2Vocabulary } from './vocabulary-b2';
import { c1Vocabulary } from './vocabulary-c1';
import { c2Vocabulary } from './vocabulary-c2';

/** The raw, untagged vocabulary bank for each CEFR level. */
const VOCABULARY_BANKS: Record<Level, VocabularyEntry[]> = {
  a1: a1Vocabulary,
  a2: a2Vocabulary,
  b1: b1Vocabulary,
  b2: b2Vocabulary,
  c1: c1Vocabulary,
  c2: c2Vocabulary,
};

/** Tag a level's entries with their level so callers know where each came from. */
function tag(level: Level, entries: VocabularyEntry[]): LeveledVocabularyEntry[] {
  return entries.map((entry) => ({ ...entry, level }));
}

/** Every vocabulary entry across every level, tagged with its level. */
export const ALL_VOCABULARY: LeveledVocabularyEntry[] = LEVELS.flatMap((level) =>
  tag(level, VOCABULARY_BANKS[level] ?? []),
);

/** Build a pool of vocabulary entries drawn from the given band of levels, interleaved. */
export function vocabularyPool(levels: readonly Level[]): LeveledVocabularyEntry[] {
  return interleaveByLevel(ALL_VOCABULARY, levels);
}
