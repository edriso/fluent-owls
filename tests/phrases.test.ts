import { describe, expect, it } from 'vitest';
import { ALL_PHRASES, phrasesPool } from '../src/content/phrases';
import { buildPhraseMessage } from '../src/lib/format';
import { EXAMPLE_MAX_CHARS, PHRASE_MAX_CHARS, SITUATION_MAX_CHARS } from '../src/lib/limits';
import { LEVELS, type PhraseFunction } from '../src/types';

const VALID_FUNCTIONS: PhraseFunction[] = [
  'opinion',
  'agreeing',
  'disagreeing',
  'small-talk',
  'softening',
  'clarifying',
  'reacting',
  'storytelling',
  'transitions',
  'requests',
];

describe('phrase banks', () => {
  it('has phrases at every level', () => {
    for (const level of LEVELS) {
      expect(phrasesPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the ph marker', () => {
    const ids = ALL_PHRASES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of ALL_PHRASES) {
      expect(p.id.startsWith(`${p.level}-ph-`), p.id).toBe(true);
    }
  });

  it('has non-empty fields within their limits', () => {
    for (const p of ALL_PHRASES) {
      expect(p.phrase.trim().length, p.id).toBeGreaterThan(0);
      expect(p.phrase.length, p.id).toBeLessThanOrEqual(PHRASE_MAX_CHARS);
      expect(p.situation.trim().length, p.id).toBeGreaterThan(0);
      expect(p.situation.length, p.id).toBeLessThanOrEqual(SITUATION_MAX_CHARS);
      expect(p.example.trim().length, p.id).toBeGreaterThan(0);
      expect(p.example.length, p.id).toBeLessThanOrEqual(EXAMPLE_MAX_CHARS);
    }
  });

  it('uses a valid conversational function', () => {
    for (const p of ALL_PHRASES) {
      expect(VALID_FUNCTIONS, p.id).toContain(p.fn);
    }
  });

  it('renders a message that includes the phrase, situation, and example', () => {
    for (const p of ALL_PHRASES) {
      const msg = buildPhraseMessage(p);
      expect(msg, p.id).toContain('Say it like a native');
      expect(msg, p.id).toContain(p.situation);
      expect(msg, p.id).toContain(p.example);
    }
  });

  it('does not use em-dashes in any prose (a house style rule)', () => {
    for (const p of ALL_PHRASES) {
      expect(p.phrase.includes('—'), p.id).toBe(false);
      expect(p.situation.includes('—'), p.id).toBe(false);
      expect(p.example.includes('—'), p.id).toBe(false);
    }
  });
});

describe('phrasesPool', () => {
  it('interleaves a two-level band so the levels alternate', () => {
    const pool = phrasesPool(['a1', 'a2']);
    expect(pool[0]?.level).toBe('a1');
    expect(pool[1]?.level).toBe('a2');
  });

  it('is empty for an empty band', () => {
    expect(phrasesPool([])).toEqual([]);
  });
});

describe('phrase coverage', () => {
  it('ships a healthy number of phrases per level', () => {
    for (const level of LEVELS) {
      expect(phrasesPool([level]).length, level).toBeGreaterThanOrEqual(20);
    }
  });
});
