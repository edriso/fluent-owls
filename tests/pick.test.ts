import { describe, expect, it } from 'vitest';
import { pickForDay } from '../src/lib/pick';

// The timezone-aware day-of-year math (dayOfYearIn) is tested in
// telegram-broadcast-kit now. These tests cover only the fluent-owls-specific
// generic picker: same-day stability, cycling, and the empty-pool throw.
describe('pickForDay', () => {
  it('picks the same item for the same day', () => {
    const pool = ['a', 'b', 'c', 'd'];
    const d = new Date('2026-05-28T10:00:00Z');
    expect(pickForDay(pool, d, 'UTC')).toBe(pickForDay(pool, d, 'UTC'));
  });

  it('cycles through the pool as days advance', () => {
    const pool = ['a', 'b', 'c'];
    const day1 = pickForDay(pool, new Date('2026-01-01T00:00:00Z'), 'UTC');
    const day2 = pickForDay(pool, new Date('2026-01-02T00:00:00Z'), 'UTC');
    const day3 = pickForDay(pool, new Date('2026-01-03T00:00:00Z'), 'UTC');
    const day4 = pickForDay(pool, new Date('2026-01-04T00:00:00Z'), 'UTC');
    expect([day1, day2, day3]).toEqual(['a', 'b', 'c']);
    expect(day4).toBe('a');
  });

  it('throws on an empty pool', () => {
    expect(() => pickForDay([], new Date(), 'UTC')).toThrowError();
  });
});
