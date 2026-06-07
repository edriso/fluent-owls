/**
 * Grammar registry. Mirrors the other content registries: each level has its own
 * bank, this module tags every rule with its level and exposes a pool builder.
 *
 * To add a level bank, create `grammar-<level>.ts`, import it here, and add it to
 * GRAMMAR_BANKS.
 */
import { LEVELS, type GrammarRule, type Level, type LeveledGrammarRule } from '../types';
import { interleaveByLevel } from './pool';

import { a1Grammar } from './grammar-a1';
import { a2Grammar } from './grammar-a2';
import { b1Grammar } from './grammar-b1';
import { b2Grammar } from './grammar-b2';
import { c1Grammar } from './grammar-c1';
import { c2Grammar } from './grammar-c2';

/** The raw, untagged grammar bank for each CEFR level. */
const GRAMMAR_BANKS: Record<Level, GrammarRule[]> = {
  a1: a1Grammar,
  a2: a2Grammar,
  b1: b1Grammar,
  b2: b2Grammar,
  c1: c1Grammar,
  c2: c2Grammar,
};

/** Tag a level's rules with their level so callers know where each came from. */
function tag(level: Level, rules: GrammarRule[]): LeveledGrammarRule[] {
  return rules.map((rule) => ({ ...rule, level }));
}

/** Every grammar rule across every level, tagged with its level. */
export const ALL_GRAMMAR: LeveledGrammarRule[] = LEVELS.flatMap((level) =>
  tag(level, GRAMMAR_BANKS[level] ?? []),
);

/** Build a pool of grammar rules drawn from the given band of levels, interleaved. */
export function grammarPool(levels: readonly Level[]): LeveledGrammarRule[] {
  return interleaveByLevel(ALL_GRAMMAR, levels);
}
