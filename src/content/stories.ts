/**
 * Story registry. Mirrors the other content registries: each level has its own
 * bank, this module tags every story with its level and exposes a pool builder.
 * Stories are not in the daily batch; they are available on demand (the /story
 * command) and via send-test.
 *
 * To add a level bank, create `stories-<level>.ts`, import it here, and add it to
 * STORY_BANKS.
 */
import { LEVELS, type Level, type LeveledStory, type Story } from '../types';
import { interleaveByLevel } from './pool';

import { a1Stories } from './stories-a1';
import { a2Stories } from './stories-a2';
import { b1Stories } from './stories-b1';
import { b2Stories } from './stories-b2';
import { c1Stories } from './stories-c1';
import { c2Stories } from './stories-c2';

/** The raw, untagged story bank for each CEFR level. */
const STORY_BANKS: Record<Level, Story[]> = {
  a1: a1Stories,
  a2: a2Stories,
  b1: b1Stories,
  b2: b2Stories,
  c1: c1Stories,
  c2: c2Stories,
};

/** Tag a level's stories with their level so callers know where each came from. */
function tag(level: Level, stories: Story[]): LeveledStory[] {
  return stories.map((story) => ({ ...story, level }));
}

/** Every story across every level, tagged with its level. */
export const ALL_STORIES: LeveledStory[] = LEVELS.flatMap((level) =>
  tag(level, STORY_BANKS[level] ?? []),
);

/** Build a pool of stories drawn from the given band of levels, interleaved. */
export function storiesPool(levels: readonly Level[]): LeveledStory[] {
  return interleaveByLevel(ALL_STORIES, levels);
}
