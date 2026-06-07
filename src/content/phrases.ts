/**
 * Native-phrase registry.
 *
 * Mirrors the question and shadowing registries: each level has its own bank
 * exporting a plain `NativePhrase[]`, and this module maps each file to a CEFR
 * level, tags every phrase with its level, and exposes a pool builder.
 *
 * To add a level bank, create `phrases-<level>.ts`, import it here, and add it
 * to PHRASE_BANKS. Nothing else changes.
 */
import { LEVELS, type Level, type LeveledNativePhrase, type NativePhrase } from '../types';
import { interleaveByLevel } from './pool';

import { a1Phrases } from './phrases-a1';
import { a2Phrases } from './phrases-a2';
import { b1Phrases } from './phrases-b1';
import { b2Phrases } from './phrases-b2';
import { c1Phrases } from './phrases-c1';
import { c2Phrases } from './phrases-c2';

/** The raw, untagged phrase bank for each CEFR level. */
const PHRASE_BANKS: Record<Level, NativePhrase[]> = {
  a1: a1Phrases,
  a2: a2Phrases,
  b1: b1Phrases,
  b2: b2Phrases,
  c1: c1Phrases,
  c2: c2Phrases,
};

/** Tag a level's phrases with their level so callers know where each came from. */
function tag(level: Level, phrases: NativePhrase[]): LeveledNativePhrase[] {
  return phrases.map((phrase) => ({ ...phrase, level }));
}

/** Every native phrase across every level, tagged with its level. */
export const ALL_PHRASES: LeveledNativePhrase[] = LEVELS.flatMap((level) =>
  tag(level, PHRASE_BANKS[level] ?? []),
);

/**
 * Build a pool of native phrases drawn from the given band of levels,
 * interleaved by level. The daily phrase slot pools every level (see
 * schedules.ts), with the level shown in each post.
 */
export function phrasesPool(levels: readonly Level[]): LeveledNativePhrase[] {
  return interleaveByLevel(ALL_PHRASES, levels);
}
