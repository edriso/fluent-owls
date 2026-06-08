import { describe, expect, it } from 'vitest';
import { poolForLevel } from '../src/lib/select';
import type { Level } from '../src/types';

const items: { id: string; level: Level }[] = [
  { id: 'a1-1', level: 'a1' },
  { id: 'a1-2', level: 'a1' },
  { id: 'b1-1', level: 'b1' },
  { id: 'c2-1', level: 'c2' },
];

describe('poolForLevel', () => {
  it('narrows to the named level when the arg is a valid CEFR level', () => {
    expect(poolForLevel(items, 'a1').map((i) => i.id)).toEqual(['a1-1', 'a1-2']);
    expect(poolForLevel(items, 'b1').map((i) => i.id)).toEqual(['b1-1']);
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(poolForLevel(items, '  C2 ').map((i) => i.id)).toEqual(['c2-1']);
  });

  it('returns all items when the arg is empty or not a level', () => {
    expect(poolForLevel(items, '')).toHaveLength(4);
    expect(poolForLevel(items, 'present perfect')).toHaveLength(4);
    expect(poolForLevel(items, 'z9')).toHaveLength(4);
  });

  it('falls back to all items when the level has none', () => {
    const onlyA1 = [{ id: 'a1-1', level: 'a1' as Level }];
    expect(poolForLevel(onlyA1, 'b2')).toHaveLength(1);
  });
});
