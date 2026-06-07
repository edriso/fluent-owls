/**
 * Role-play dialogue registry.
 *
 * Mirrors the other content registries: each level has its own bank exporting a
 * plain `Dialogue[]`, and this module maps each file to a CEFR level, tags every
 * dialogue with its level, and exposes a pool builder.
 *
 * To add a level bank, create `dialogues-<level>.ts`, import it here, and add it
 * to DIALOGUE_BANKS. Nothing else changes.
 */
import { LEVELS, type Dialogue, type Level, type LeveledDialogue } from '../types';
import { interleaveByLevel } from './pool';

import { a1Dialogues } from './dialogues-a1';
import { a2Dialogues } from './dialogues-a2';
import { b1Dialogues } from './dialogues-b1';
import { b2Dialogues } from './dialogues-b2';
import { c1Dialogues } from './dialogues-c1';
import { c2Dialogues } from './dialogues-c2';

/** The raw, untagged dialogue bank for each CEFR level. */
const DIALOGUE_BANKS: Record<Level, Dialogue[]> = {
  a1: a1Dialogues,
  a2: a2Dialogues,
  b1: b1Dialogues,
  b2: b2Dialogues,
  c1: c1Dialogues,
  c2: c2Dialogues,
};

/** Tag a level's dialogues with their level so callers know where each came from. */
function tag(level: Level, dialogues: Dialogue[]): LeveledDialogue[] {
  return dialogues.map((dialogue) => ({ ...dialogue, level }));
}

/** Every dialogue across every level, tagged with its level. */
export const ALL_DIALOGUES: LeveledDialogue[] = LEVELS.flatMap((level) =>
  tag(level, DIALOGUE_BANKS[level] ?? []),
);

/**
 * Build a pool of dialogues drawn from the given band of levels, interleaved by
 * level. The daily dialogue slot pools every level (see schedules.ts), with the
 * level shown on each post.
 */
export function dialoguesPool(levels: readonly Level[]): LeveledDialogue[] {
  return interleaveByLevel(ALL_DIALOGUES, levels);
}
