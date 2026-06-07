import type { Level } from '../types';

/**
 * Build a pool from a band of levels, round-robin interleaved by level.
 *
 * Shared by every content type (quizzes, shadowing clips, native phrases): each
 * has its own level-tagged list, and each daily slot draws from a band of one
 * or more levels. The result is interleaved (a1, a2, a1, a2, ...) rather than
 * concatenated (all a1, then all a2), because the daily picker walks the pool in
 * order: interleaving makes a two-level slot alternate levels day to day instead
 * of showing only the easier level for weeks before switching. Order stays fully
 * deterministic, so the picker remains stable across restarts.
 *
 * @param items  Every level-tagged item of one content type.
 * @param levels The CEFR levels to include (e.g. ['b1', 'b2']).
 * @returns The items for those levels, interleaved by level.
 */
export function interleaveByLevel<T extends { level: Level }>(
  items: readonly T[],
  levels: readonly Level[],
): T[] {
  const byLevel = levels.map((level) => items.filter((item) => item.level === level));
  const longest = byLevel.reduce((max, list) => Math.max(max, list.length), 0);

  const interleaved: T[] = [];
  for (let i = 0; i < longest; i += 1) {
    for (const list of byLevel) {
      const item = list[i];
      if (item) interleaved.push(item);
    }
  }
  return interleaved;
}
