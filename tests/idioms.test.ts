import { describe, expect, it } from 'vitest';
import { ALL_IDIOMS, idiomsPool } from '../src/content/idioms';
import { buildIdiomMessage } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  IDIOM_EXAMPLE_MAX_CHARS,
  IDIOM_MAX_EXAMPLES,
  IDIOM_MEANING_MAX_CHARS,
  IDIOM_MIN_EXAMPLES,
  IDIOM_PHRASE_MAX_CHARS,
  NOTE_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('idiom banks', () => {
  it('has idioms at every level', () => {
    for (const level of LEVELS) {
      expect(idiomsPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the idm marker', () => {
    const ids = ALL_IDIOMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const i of ALL_IDIOMS) {
      expect(i.id.startsWith(`${i.level}-idm-`), i.id).toBe(true);
    }
  });

  it('has unique idioms (no entry repeats an idiom)', () => {
    const phrases = ALL_IDIOMS.map((i) => i.idiom.trim().toLowerCase());
    expect(new Set(phrases).size).toBe(phrases.length);
  });

  it('has an idiom, meaning, and note within their limits', () => {
    for (const i of ALL_IDIOMS) {
      expect(i.idiom.trim().length, i.id).toBeGreaterThan(0);
      expect(i.idiom.length, i.id).toBeLessThanOrEqual(IDIOM_PHRASE_MAX_CHARS);
      expect(i.meaning.trim().length, i.id).toBeGreaterThan(0);
      expect(i.meaning.length, i.id).toBeLessThanOrEqual(IDIOM_MEANING_MAX_CHARS);
      expect(i.note.trim().length, i.id).toBeGreaterThan(0);
      expect(i.note.length, i.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('has 2 to 3 non-empty example sentences within the example limit', () => {
    for (const i of ALL_IDIOMS) {
      expect(i.examples.length, i.id).toBeGreaterThanOrEqual(IDIOM_MIN_EXAMPLES);
      expect(i.examples.length, i.id).toBeLessThanOrEqual(IDIOM_MAX_EXAMPLES);
      for (const ex of i.examples) {
        expect(ex.trim().length, i.id).toBeGreaterThan(0);
        expect(ex.length, i.id).toBeLessThanOrEqual(IDIOM_EXAMPLE_MAX_CHARS);
      }
    }
  });

  it('has an audio name of <id>.ogg and renders a caption within the limit', () => {
    for (const i of ALL_IDIOMS) {
      expect(i.audio, i.id).toBe(`${i.id}.ogg`);
      const caption = buildIdiomMessage(i);
      expect(caption.length, i.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption, i.id).toContain(i.idiom);
    }
  });

  it('uses no em-dashes (house style)', () => {
    for (const i of ALL_IDIOMS) {
      const blob = [i.idiom, i.meaning, i.note, ...i.examples].join(' ');
      expect(blob.includes('—'), i.id).toBe(false);
    }
  });
});
