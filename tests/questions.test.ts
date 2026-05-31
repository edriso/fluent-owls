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
