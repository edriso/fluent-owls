/**
 * Tiny selection helpers shared by the on-demand DM commands.
 *
 * The commands let a learner optionally target a CEFR level (e.g. "/story b1"),
 * so they can ask for exactly the audio they want. `poolForLevel` is the pure,
 * testable filter; `randomOf` is the (impure) random pick used at runtime.
 */
import { LEVELS, type Level } from '../types';

/**
 * If `arg` names a CEFR level (a1..c2, any case), return only that level's items;
 * otherwise, or if that level happens to be empty, return all of them. So
 * "/idiom b2" narrows to B2, while "/idiom" (or a stray word) gives any level.
 */
export function poolForLevel<T extends { level: Level }>(
  items: readonly T[],
  arg: string,
): readonly T[] {
  const lvl = arg.trim().toLowerCase();
  if ((LEVELS as readonly string[]).includes(lvl)) {
    const filtered = items.filter((item) => item.level === lvl);
    if (filtered.length > 0) return filtered;
  }
  return items;
}

/** Pick a random element from a non-empty list. */
export function randomOf<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
