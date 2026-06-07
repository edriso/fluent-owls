import { describe, expect, it } from 'vitest';
import { dayKeyIn, nextStreak } from '../src/lib/streak';

describe('dayKeyIn', () => {
  it('formats a date as YYYY-MM-DD in the given timezone', () => {
    // 2026-06-07T02:30:00Z is still June 6 in New York (UTC-4 in summer).
    const d = new Date('2026-06-07T02:30:00Z');
    expect(dayKeyIn(d, 'UTC')).toBe('2026-06-07');
    expect(dayKeyIn(d, 'America/New_York')).toBe('2026-06-06');
  });
});

describe('nextStreak', () => {
  it('starts a streak on the first practice', () => {
    expect(nextStreak(null, '2026-06-07', 0)).toEqual({ streak: 1, isNewDay: true });
  });

  it('does not double-count the same day', () => {
    expect(nextStreak('2026-06-07', '2026-06-07', 4)).toEqual({ streak: 4, isNewDay: false });
  });

  it('increments on a consecutive day', () => {
    expect(nextStreak('2026-06-06', '2026-06-07', 4)).toEqual({ streak: 5, isNewDay: true });
  });

  it('resets after a gap', () => {
    expect(nextStreak('2026-06-04', '2026-06-07', 9)).toEqual({ streak: 1, isNewDay: true });
  });

  it('handles a month boundary as consecutive', () => {
    expect(nextStreak('2026-05-31', '2026-06-01', 2)).toEqual({ streak: 3, isNewDay: true });
  });
});
