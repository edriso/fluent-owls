import { describe, expect, it } from 'vitest';
import { schedules } from '../src/schedules';
import { LEVELS } from '../src/types';

describe('schedules (the daily batch)', () => {
  it('runs the three quizzes first, then the phrase, then the shadowing clip', () => {
    expect(schedules.map((s) => s.name)).toEqual([
      'morning',
      'midday',
      'evening',
      'phrase',
      'shadow',
    ]);
    expect(schedules.map((s) => s.kind)).toEqual(['quiz', 'quiz', 'quiz', 'phrase', 'shadow']);
  });

  it('rings exactly once a day: only the last slot is audible', () => {
    const audible = schedules.filter((s) => !s.silent);
    expect(audible).toHaveLength(1);
    // The single audible post must be the last one, so the notification lands
    // on the final message in the feed (the shadowing clip).
    expect(audible[0]).toBe(schedules[schedules.length - 1]);
  });

  it('every slot has at least one level, all levels are valid, and names are unique', () => {
    for (const s of schedules) {
      expect(s.levels.length).toBeGreaterThan(0);
      for (const level of s.levels) expect(LEVELS).toContain(level);
    }
    const names = schedules.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('covers every CEFR level across the batch', () => {
    const covered = new Set(schedules.flatMap((s) => s.levels));
    for (const level of LEVELS) expect(covered).toContain(level);
  });
});
