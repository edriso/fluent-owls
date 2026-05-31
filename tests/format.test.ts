import { describe, expect, it } from 'vitest';
import { buildPrompt, clampExplanation, toPollOptions } from '../src/lib/format';
import type { LeveledQuestion } from '../src/types';

const sample: LeveledQuestion = {
  id: 'b1-001',
  level: 'b1',
  topic: 'collocations',
  prompt: 'We need to ____ a decision by Friday.',
  options: ['do', 'make', 'take', 'have'],
  correctIndex: 1,
  explanation: 'You make a decision.',
};

describe('buildPrompt', () => {
  it('prefixes a level and topic header before the prompt', () => {
    const out = buildPrompt(sample);
    expect(out).toContain('B1');
    expect(out).toContain('Collocations');
    expect(out).toContain(sample.prompt);
  });
});

describe('toPollOptions', () => {
  it('maps strings to Telegram option objects', () => {
    expect(toPollOptions(['a', 'b'])).toEqual([{ text: 'a' }, { text: 'b' }]);
  });

  it('throws when there are too few options', () => {
    expect(() => toPollOptions(['only-one'])).toThrowError();
  });

  it('throws when an option is too long', () => {
    expect(() => toPollOptions(['a', 'x'.repeat(101)])).toThrowError();
  });
});

describe('clampExplanation', () => {
  it('returns undefined for empty input', () => {
    expect(clampExplanation(undefined)).toBeUndefined();
    expect(clampExplanation('   ')).toBeUndefined();
  });

  it('keeps short explanations intact', () => {
    expect(clampExplanation('short')).toBe('short');
  });

  it('clamps over-long explanations with an ellipsis', () => {
    const out = clampExplanation('x'.repeat(250));
    expect(out).toBeDefined();
    expect(out!.length).toBeLessThanOrEqual(200);
    expect(out!.endsWith('…')).toBe(true);
  });
});
