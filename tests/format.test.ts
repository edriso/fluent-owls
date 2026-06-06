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

  it('renders the badge and label for a different level and topic', () => {
    const out = buildPrompt({ ...sample, id: 'c2-001', level: 'c2', topic: 'idioms' });
    expect(out).toContain('C2');
    expect(out).toContain('Idioms');
  });
});

describe('toPollOptions', () => {
  it('maps strings to Telegram option objects, preserving order', () => {
    expect(toPollOptions(['a', 'b', 'c', 'd'])).toEqual([
      { text: 'a' },
      { text: 'b' },
      { text: 'c' },
      { text: 'd' },
    ]);
  });

  it('throws when there are too few options', () => {
    expect(() => toPollOptions(['only-one'])).toThrowError();
  });

  it('throws when there are too many options (Telegram caps at 10)', () => {
    expect(() => toPollOptions(Array.from({ length: 11 }, (_, i) => `option ${i}`))).toThrowError();
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

  it('keeps short explanations intact and trims surrounding whitespace', () => {
    expect(clampExplanation('short')).toBe('short');
    expect(clampExplanation('  trimmed  ')).toBe('trimmed');
  });

  it('keeps an explanation that is exactly at the limit intact (no ellipsis)', () => {
    const exact = 'y'.repeat(200);
    expect(clampExplanation(exact)).toBe(exact);
  });

  it('clamps over-long explanations to the limit with an ellipsis', () => {
    const out = clampExplanation('x'.repeat(250));
    expect(out).toBeDefined();
    expect(out!.length).toBe(200);
    expect(out!.endsWith('…')).toBe(true);
  });
});
