import { describe, expect, it } from 'vitest';
import { ALL_GRAMMAR, grammarPool } from '../src/content/grammar';
import { buildGrammarCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  EXPLANATION_LINE_MAX_CHARS,
  GRAMMAR_EXAMPLE_MAX_CHARS,
  GRAMMAR_MAX_EXAMPLES,
  GRAMMAR_MIN_EXAMPLES,
  NOTE_MAX_CHARS,
  RULE_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('grammar banks', () => {
  it('has rules at every level', () => {
    for (const level of LEVELS) {
      expect(grammarPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the gr marker', () => {
    const ids = ALL_GRAMMAR.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const g of ALL_GRAMMAR) {
      expect(g.id.startsWith(`${g.level}-gr-`), g.id).toBe(true);
    }
  });

  it('has rule, explanation, and note within their limits', () => {
    for (const g of ALL_GRAMMAR) {
      expect(g.rule.trim().length, g.id).toBeGreaterThan(0);
      expect(g.rule.length, g.id).toBeLessThanOrEqual(RULE_MAX_CHARS);
      expect(g.explanation.trim().length, g.id).toBeGreaterThan(0);
      expect(g.explanation.length, g.id).toBeLessThanOrEqual(EXPLANATION_LINE_MAX_CHARS);
      expect(g.note.trim().length, g.id).toBeGreaterThan(0);
      expect(g.note.length, g.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('has 2 to 3 non-empty example sentences within the limit', () => {
    for (const g of ALL_GRAMMAR) {
      expect(g.examples.length, g.id).toBeGreaterThanOrEqual(GRAMMAR_MIN_EXAMPLES);
      expect(g.examples.length, g.id).toBeLessThanOrEqual(GRAMMAR_MAX_EXAMPLES);
      for (const ex of g.examples) {
        expect(ex.trim().length, g.id).toBeGreaterThan(0);
        expect(ex.length, `${g.id}: "${ex}"`).toBeLessThanOrEqual(GRAMMAR_EXAMPLE_MAX_CHARS);
      }
    }
  });

  it('names its audio file after its id', () => {
    for (const g of ALL_GRAMMAR) {
      expect(g.audio, g.id).toBe(`${g.id}.ogg`);
    }
  });

  it('renders a caption within the Telegram limit, pinned left-to-right', () => {
    for (const g of ALL_GRAMMAR) {
      const caption = buildGrammarCaption(g);
      expect(caption.length, g.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption.codePointAt(0), g.id).toBe(0x2066);
      expect(caption.codePointAt(caption.length - 1), g.id).toBe(0x2069);
      expect(caption, g.id).toContain(g.rule);
    }
  });

  it('does not use em-dashes in any prose (a house style rule)', () => {
    for (const g of ALL_GRAMMAR) {
      expect(g.rule.includes('—'), g.id).toBe(false);
      expect(g.explanation.includes('—'), g.id).toBe(false);
      expect(g.note.includes('—'), g.id).toBe(false);
      for (const ex of g.examples) expect(ex.includes('—'), g.id).toBe(false);
    }
  });
});

describe('grammarPool', () => {
  it('interleaves a two-level band so the levels alternate', () => {
    const pool = grammarPool(['a1', 'a2']);
    expect(pool[0]?.level).toBe('a1');
    expect(pool[1]?.level).toBe('a2');
  });

  it('is empty for an empty band', () => {
    expect(grammarPool([])).toEqual([]);
  });
});

describe('grammar coverage', () => {
  it('ships a healthy number of rules per level', () => {
    for (const level of LEVELS) {
      expect(grammarPool([level]).length, level).toBeGreaterThanOrEqual(16);
    }
  });
});
