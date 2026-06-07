import { describe, expect, it } from 'vitest';
import { kindForStep, pickNext, TUTOR_KINDS } from '../src/lib/tutor';
import { LEVELS } from '../src/types';

describe('kindForStep', () => {
  it('rotates through the kinds in order', () => {
    for (let step = 0; step < TUTOR_KINDS.length * 2; step += 1) {
      expect(kindForStep(step)).toBe(TUTOR_KINDS[step % TUTOR_KINDS.length]);
    }
  });
});

describe('pickNext', () => {
  it('picks the kind for the step and an item at the learner level', () => {
    for (const level of LEVELS) {
      for (let step = 0; step < TUTOR_KINDS.length; step += 1) {
        const result = pickNext(level, step, 0);
        expect(result, `${level} step ${step}`).not.toBeNull();
        expect(result!.kind).toBe(TUTOR_KINDS[step]);
        expect(result!.pick.kind).toBe(TUTOR_KINDS[step]);
        // The chosen item belongs to the learner's level.
        expect((result!.pick.item as { level: string }).level).toBe(level);
        expect(result!.nextPosition).toBe(1);
      }
    }
  });

  it('advances the position and wraps around the pool', () => {
    const first = pickNext('b1', 0, 0)!; // quiz at position 0
    const wrapped = pickNext('b1', 0, 1)!; // quiz at position 1
    expect(first.pick.item.id).not.toBe(wrapped.pick.item.id);
    expect(wrapped.nextPosition).toBe(2);
    // A position past the pool length wraps to the start (no crash, no gap).
    const huge = pickNext('b1', 0, 100_000)!;
    expect(huge.pick.kind).toBe('quiz');
    expect(huge.nextPosition).toBe(100_001);
  });
});
