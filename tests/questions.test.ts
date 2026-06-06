import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS, poolForLevels } from '../src/content/index';
import { buildPrompt } from '../src/lib/format';
import {
  EXPLANATION_MAX_CHARS,
  MAX_OPTIONS,
  MIN_OPTIONS,
  OPTION_MAX_CHARS,
  QUESTION_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('question banks', () => {
  it('has questions at every level', () => {
    for (const level of LEVELS) {
      expect(poolForLevels([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of ALL_QUESTIONS) {
      expect(q.id.startsWith(`${q.level}-`), q.id).toBe(true);
    }
  });

  it('has a valid number of unique, non-empty options', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(MIN_OPTIONS);
      expect(q.options.length, q.id).toBeLessThanOrEqual(MAX_OPTIONS);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      for (const opt of q.options) {
        expect(opt.trim().length, q.id).toBeGreaterThan(0);
        expect(opt.length, `${q.id}: "${opt}"`).toBeLessThanOrEqual(OPTION_MAX_CHARS);
      }
    }
  });

  it('has a correctIndex that points at a real option', () => {
    for (const q of ALL_QUESTIONS) {
      expect(Number.isInteger(q.correctIndex), q.id).toBe(true);
      expect(q.correctIndex, q.id).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex, q.id).toBeLessThan(q.options.length);
    }
  });

  it('uses the fill-in-the-blank format and renders within the limit', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.prompt.includes('____'), q.id).toBe(true);
      expect(buildPrompt(q).length, q.id).toBeLessThanOrEqual(QUESTION_MAX_CHARS);
    }
  });

  it('has a non-empty explanation within the Telegram limit', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.explanation.trim().length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeLessThanOrEqual(EXPLANATION_MAX_CHARS);
    }
  });

  it('does not use em-dashes in prose (a house style rule)', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.prompt.includes('—'), q.id).toBe(false);
      expect(q.explanation.includes('—'), q.id).toBe(false);
    }
  });
});

describe('poolForLevels', () => {
  it('interleaves a two-level band so the levels alternate', () => {
    const pool = poolForLevels(['a1', 'a2']);
    // The first two entries should be one a1 and one a2, not two a1s. That is
    // the whole point of interleaving: the slot alternates levels day to day.
    expect(pool[0]?.level).toBe('a1');
    expect(pool[1]?.level).toBe('a2');
  });

  it('returns every question from the requested levels, with no extras', () => {
    const pool = poolForLevels(['b1', 'b2']);
    const expected = ALL_QUESTIONS.filter((q) => q.level === 'b1' || q.level === 'b2');
    expect(pool.length).toBe(expected.length);
    expect(new Set(pool.map((q) => q.id))).toEqual(new Set(expected.map((q) => q.id)));
  });

  it('is empty for an empty band', () => {
    expect(poolForLevels([])).toEqual([]);
  });
});

describe('content coverage', () => {
  it('ships a healthy number of questions per level', () => {
    for (const level of LEVELS) {
      // A daily slot pairs two levels, so even 20 per level gives ~6 weeks
      // before a repeat. Guard against a bank accidentally shrinking.
      expect(poolForLevels([level]).length, level).toBeGreaterThanOrEqual(20);
    }
  });

  it('varies the correct answer position (not always the same index)', () => {
    // A quiz where the answer is always option A is boring and gameable. Make
    // sure each level uses at least three distinct correct positions.
    for (const level of LEVELS) {
      const positions = new Set(poolForLevels([level]).map((q) => q.correctIndex));
      expect(positions.size, level).toBeGreaterThanOrEqual(3);
    }
  });

  it('does not bunch the correct answer in one position (<= 45% per level)', () => {
    // Beyond "at least 3 positions", guard against a single position
    // dominating, so a reader cannot do well by always guessing the same
    // letter. Mirrors the NumNinjas spread guard.
    for (const level of LEVELS) {
      const pool = poolForLevels([level]);
      const counts = [0, 0, 0, 0];
      for (const q of pool) counts[q.correctIndex] = (counts[q.correctIndex] ?? 0) + 1;
      expect(Math.max(...counts) / pool.length, `${level} ${counts.join('/')}`).toBeLessThanOrEqual(
        0.45,
      );
    }
  });
});
