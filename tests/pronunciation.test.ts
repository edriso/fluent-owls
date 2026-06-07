import { describe, expect, it } from 'vitest';
import { ALL_PRONUNCIATION, pronunciationPool } from '../src/content/pronunciation';
import { buildPronunciationCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  NOTE_MAX_CHARS,
  PRON_EXPLANATION_MAX_CHARS,
  PRON_ITEM_MAX_CHARS,
  PRON_MAX_ITEMS,
  PRON_MIN_ITEMS,
  PRON_TITLE_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS, type PronunciationFocus } from '../src/types';

const VALID_FOCUS: PronunciationFocus[] = [
  'minimal-pair',
  'connected-speech',
  'word-stress',
  'weak-forms',
  'spelling-sound',
];

describe('pronunciation banks', () => {
  it('has drills at every level', () => {
    for (const level of LEVELS) {
      expect(pronunciationPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the pn marker', () => {
    const ids = ALL_PRONUNCIATION.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of ALL_PRONUNCIATION) {
      expect(d.id.startsWith(`${d.level}-pn-`), d.id).toBe(true);
    }
  });

  it('has a title, explanation, and note within their limits', () => {
    for (const d of ALL_PRONUNCIATION) {
      expect(d.title.trim().length, d.id).toBeGreaterThan(0);
      expect(d.title.length, d.id).toBeLessThanOrEqual(PRON_TITLE_MAX_CHARS);
      expect(d.explanation.trim().length, d.id).toBeGreaterThan(0);
      expect(d.explanation.length, d.id).toBeLessThanOrEqual(PRON_EXPLANATION_MAX_CHARS);
      expect(d.note.trim().length, d.id).toBeGreaterThan(0);
      expect(d.note.length, d.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('has 2 to 6 non-empty items within the item limit', () => {
    for (const d of ALL_PRONUNCIATION) {
      expect(d.items.length, d.id).toBeGreaterThanOrEqual(PRON_MIN_ITEMS);
      expect(d.items.length, d.id).toBeLessThanOrEqual(PRON_MAX_ITEMS);
      for (const item of d.items) {
        expect(item.trim().length, d.id).toBeGreaterThan(0);
        expect(item.length, d.id).toBeLessThanOrEqual(PRON_ITEM_MAX_CHARS);
      }
    }
  });

  it('has a valid focus and an audio name of <id>.ogg', () => {
    for (const d of ALL_PRONUNCIATION) {
      expect(VALID_FOCUS, d.id).toContain(d.focus);
      expect(d.audio, d.id).toBe(`${d.id}.ogg`);
    }
  });

  it('renders a caption within the Telegram limit, pinned left-to-right', () => {
    for (const d of ALL_PRONUNCIATION) {
      const caption = buildPronunciationCaption(d);
      expect(caption.length, d.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      // The caption is wrapped in a left-to-right isolate (U+2066) so a leading
      // emoji does not mirror for a reader on an RTL-locale client (see format.ts).
      expect(caption.codePointAt(0), d.id).toBe(0x2066);
      expect(caption, d.id).toContain(d.title);
    }
  });

  it('uses no em-dashes (house style)', () => {
    for (const d of ALL_PRONUNCIATION) {
      const blob = [d.title, d.explanation, d.note, ...d.items].join(' ');
      expect(blob.includes('—'), d.id).toBe(false);
    }
  });
});
