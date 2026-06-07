/**
 * The personal-tutor selection logic: given a learner's level, their overall
 * step, and their per-kind position, pick the NEXT item to send. Pure and
 * testable: it reads the static content pools but touches no database.
 *
 * /next rotates through the kinds in a fixed order (so a learner gets variety),
 * and within each kind it walks that kind's pool in sequence by a saved cursor,
 * so they do not see the same item again until the level's pool cycles.
 */
import { poolForLevels } from '../content/index';
import { shadowingPool } from '../content/shadowing';
import { dialoguesPool } from '../content/dialogues';
import { grammarPool } from '../content/grammar';
import { phrasesPool } from '../content/phrases';
import { promptsPool } from '../content/prompts';
import type {
  Level,
  LeveledDialogue,
  LeveledGrammarRule,
  LeveledNativePhrase,
  LeveledPrompt,
  LeveledQuestion,
  LeveledShadowingClip,
} from '../types';

/** The kinds /next rotates through, in order. Monologues stay /monologue-only. */
export const TUTOR_KINDS = ['quiz', 'grammar', 'phrase', 'dialogue', 'shadow', 'prompt'] as const;

export type TutorKind = (typeof TUTOR_KINDS)[number];

/** A picked item, tagged by kind so the caller can post it with the right poster. */
export type TutorPick =
  | { kind: 'quiz'; item: LeveledQuestion }
  | { kind: 'grammar'; item: LeveledGrammarRule }
  | { kind: 'phrase'; item: LeveledNativePhrase }
  | { kind: 'dialogue'; item: LeveledDialogue }
  | { kind: 'shadow'; item: LeveledShadowingClip }
  | { kind: 'prompt'; item: LeveledPrompt };

/** The pool for one kind at one level. */
function poolFor(kind: TutorKind, level: Level) {
  switch (kind) {
    case 'quiz':
      return poolForLevels([level]);
    case 'grammar':
      return grammarPool([level]);
    case 'phrase':
      return phrasesPool([level]);
    case 'dialogue':
      return dialoguesPool([level]);
    case 'shadow':
      return shadowingPool([level]);
    case 'prompt':
      return promptsPool([level]);
  }
}

/**
 * Pick the next item for a learner. `step` chooses the kind (round-robin);
 * `position` is that kind's saved cursor. Returns the tagged pick plus the kind
 * and the next position to save, or null if that kind's pool is empty.
 */
export function pickNext(
  level: Level,
  step: number,
  position: number,
): { pick: TutorPick; kind: TutorKind; nextPosition: number } | null {
  const kind = TUTOR_KINDS[step % TUTOR_KINDS.length]!;
  const pool = poolFor(kind, level);
  if (pool.length === 0) return null;
  const item = pool[position % pool.length]!;
  // The cast is safe: poolFor(kind) returns the pool whose element type matches
  // the kind in TutorPick (enforced by the switch above).
  return {
    pick: { kind, item } as TutorPick,
    kind,
    nextPosition: position + 1,
  };
}

/** The kind /next will use for a given step (without needing the pools). */
export function kindForStep(step: number): TutorKind {
  return TUTOR_KINDS[step % TUTOR_KINDS.length]!;
}
