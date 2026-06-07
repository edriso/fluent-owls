import { describe, expect, it } from 'vitest';
import { ALL_VOCABULARY, vocabularyPool } from '../src/content/vocabulary';
import { buildVocabularyMessage } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  NOTE_MAX_CHARS,
  VOCAB_EXAMPLE_MAX_CHARS,
  VOCAB_MAX_EXAMPLES,
  VOCAB_MEANING_MAX_CHARS,
  VOCAB_MIN_EXAMPLES,
  VOCAB_WORD_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('vocabulary banks', () => {
  it('has entries at every level', () => {
    for (const level of LEVELS) {
      expect(vocabularyPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the vc marker', () => {
    const ids = ALL_VOCABULARY.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const v of ALL_VOCABULARY) {
      expect(v.id.startsWith(`${v.level}-vc-`), v.id).toBe(true);
    }
  });

  it('has unique words (no entry repeats a word)', () => {
    const words = ALL_VOCABULARY.map((v) => v.word.trim().toLowerCase());
    expect(new Set(words).size).toBe(words.length);
  });

  it('has a word, meaning, and note within their limits', () => {
    for (const v of ALL_VOCABULARY) {
      expect(v.word.trim().length, v.id).toBeGreaterThan(0);
      expect(v.word.length, v.id).toBeLessThanOrEqual(VOCAB_WORD_MAX_CHARS);
      expect(v.meaning.trim().length, v.id).toBeGreaterThan(0);
      expect(v.meaning.length, v.id).toBeLessThanOrEqual(VOCAB_MEANING_MAX_CHARS);
      expect(v.note.trim().length, v.id).toBeGreaterThan(0);
      expect(v.note.length, v.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('has 2 to 3 non-empty example sentences within the example limit', () => {
    for (const v of ALL_VOCABULARY) {
      expect(v.examples.length, v.id).toBeGreaterThanOrEqual(VOCAB_MIN_EXAMPLES);
      expect(v.examples.length, v.id).toBeLessThanOrEqual(VOCAB_MAX_EXAMPLES);
      for (const ex of v.examples) {
        expect(ex.trim().length, v.id).toBeGreaterThan(0);
        expect(ex.length, v.id).toBeLessThanOrEqual(VOCAB_EXAMPLE_MAX_CHARS);
      }
    }
  });

  it('has an audio name of <id>.ogg and renders a caption within the limit', () => {
    for (const v of ALL_VOCABULARY) {
      expect(v.audio, v.id).toBe(`${v.id}.ogg`);
      const caption = buildVocabularyMessage(v);
      expect(caption.length, v.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption, v.id).toContain(v.word);
    }
  });

  it('uses no em-dashes (house style)', () => {
    for (const v of ALL_VOCABULARY) {
      const blob = [v.word, v.meaning, v.note, ...v.examples].join(' ');
      expect(blob.includes('—'), v.id).toBe(false);
    }
  });
});
