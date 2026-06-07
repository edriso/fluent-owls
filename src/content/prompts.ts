/**
 * Question-prompt registry. Mirrors the other content registries: each level has
 * its own bank, this module tags every prompt with its level and exposes a pool
 * builder. Prompts are on-demand only (the /prompt command), not in the daily
 * batch.
 *
 * To add a level bank, create `prompts-<level>.ts`, import it here, and add it to
 * PROMPT_BANKS.
 */
import { LEVELS, type Level, type LeveledPrompt, type Prompt } from '../types';
import { interleaveByLevel } from './pool';

import { a1Prompts } from './prompts-a1';
import { a2Prompts } from './prompts-a2';
import { b1Prompts } from './prompts-b1';
import { b2Prompts } from './prompts-b2';
import { c1Prompts } from './prompts-c1';
import { c2Prompts } from './prompts-c2';

/** The raw, untagged prompt bank for each CEFR level. */
const PROMPT_BANKS: Record<Level, Prompt[]> = {
  a1: a1Prompts,
  a2: a2Prompts,
  b1: b1Prompts,
  b2: b2Prompts,
  c1: c1Prompts,
  c2: c2Prompts,
};

/** Tag a level's prompts with their level so callers know where each came from. */
function tag(level: Level, prompts: Prompt[]): LeveledPrompt[] {
  return prompts.map((prompt) => ({ ...prompt, level }));
}

/** Every prompt across every level, tagged with its level. */
export const ALL_PROMPTS: LeveledPrompt[] = LEVELS.flatMap((level) =>
  tag(level, PROMPT_BANKS[level] ?? []),
);

/** Build a pool of prompts drawn from the given band of levels, interleaved. */
export function promptsPool(levels: readonly Level[]): LeveledPrompt[] {
  return interleaveByLevel(ALL_PROMPTS, levels);
}
