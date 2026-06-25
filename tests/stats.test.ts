import { describe, expect, it } from 'vitest';
import { summarizeLearners, type LearnerStatRow } from '../src/lib/stats';
import { LEVELS } from '../src/types';

const TODAY = '2026-06-26';

describe('summarizeLearners', () => {
  it('returns zeroed counts (every level present) for an empty list', () => {
    const stats = summarizeLearners([], TODAY);
    expect(stats.total).toBe(0);
    expect(stats.everPractised).toBe(0);
    expect(stats.activeToday).toBe(0);
    expect(stats.activeThisWeek).toBe(0);
    expect(stats.remindersOn).toBe(0);
    // Always one entry per level, in LEVELS order, even with no learners.
    expect(stats.byLevel.map((b) => b.level)).toEqual([...LEVELS]);
    expect(stats.byLevel.every((b) => b.count === 0)).toBe(true);
  });

  it('counts total, reminders, and the per-level breakdown', () => {
    const rows: LearnerStatRow[] = [
      { level: 'a1', lastDay: null, remindersOn: true },
      { level: 'a1', lastDay: null, remindersOn: false },
      { level: 'b1', lastDay: null, remindersOn: true },
    ];
    const stats = summarizeLearners(rows, TODAY);
    expect(stats.total).toBe(3);
    expect(stats.remindersOn).toBe(2);
    const a1 = stats.byLevel.find((b) => b.level === 'a1');
    const b1 = stats.byLevel.find((b) => b.level === 'b1');
    expect(a1?.count).toBe(2);
    expect(b1?.count).toBe(1);
  });

  it('classifies activity by how many days ago a learner last practised', () => {
    const rows: LearnerStatRow[] = [
      { level: 'b1', lastDay: null, remindersOn: false }, // never practised
      { level: 'b1', lastDay: TODAY, remindersOn: false }, // today
      { level: 'b1', lastDay: '2026-06-20', remindersOn: false }, // 6 days ago (in week)
      { level: 'b1', lastDay: '2026-06-19', remindersOn: false }, // 7 days ago (out)
    ];
    const stats = summarizeLearners(rows, TODAY);
    expect(stats.everPractised).toBe(3);
    expect(stats.activeToday).toBe(1);
    expect(stats.activeThisWeek).toBe(2);
  });

  it('treats a future lastDay (clock ahead) as active today', () => {
    const rows: LearnerStatRow[] = [{ level: 'c1', lastDay: '2026-06-27', remindersOn: false }];
    const stats = summarizeLearners(rows, TODAY);
    expect(stats.activeToday).toBe(1);
    expect(stats.activeThisWeek).toBe(1);
  });
});
