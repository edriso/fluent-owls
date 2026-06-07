import { describe, expect, it } from 'vitest';
import { ALL_DIALOGUES, dialoguesPool } from '../src/content/dialogues';
import { buildDialogueCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  CONTEXT_MAX_CHARS,
  DIALOGUE_MAX_TURNS,
  DIALOGUE_MIN_TURNS,
  DIALOGUE_TURN_MAX_CHARS,
  NOTE_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('dialogue banks', () => {
  it('has dialogues at every level', () => {
    for (const level of LEVELS) {
      expect(dialoguesPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the dl marker', () => {
    const ids = ALL_DIALOGUES.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of ALL_DIALOGUES) {
      expect(d.id.startsWith(`${d.level}-dl-`), d.id).toBe(true);
    }
  });

  it('has 2 to 4 turns that alternate A, B, A, B', () => {
    for (const d of ALL_DIALOGUES) {
      expect(d.turns.length, d.id).toBeGreaterThanOrEqual(DIALOGUE_MIN_TURNS);
      expect(d.turns.length, d.id).toBeLessThanOrEqual(DIALOGUE_MAX_TURNS);
      d.turns.forEach((t, i) => {
        expect(t.speaker, `${d.id} turn ${i}`).toBe(i % 2 === 0 ? 'A' : 'B');
      });
    }
  });

  it('has non-empty turn lines within the limit', () => {
    for (const d of ALL_DIALOGUES) {
      for (const t of d.turns) {
        expect(t.text.trim().length, d.id).toBeGreaterThan(0);
        expect(t.text.length, `${d.id}: "${t.text}"`).toBeLessThanOrEqual(DIALOGUE_TURN_MAX_CHARS);
      }
    }
  });

  it('has a non-empty situation and note within their limits', () => {
    for (const d of ALL_DIALOGUES) {
      expect(d.situation.trim().length, d.id).toBeGreaterThan(0);
      expect(d.situation.length, d.id).toBeLessThanOrEqual(CONTEXT_MAX_CHARS);
      expect(d.note.trim().length, d.id).toBeGreaterThan(0);
      expect(d.note.length, d.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('names its audio file after its id', () => {
    for (const d of ALL_DIALOGUES) {
      expect(d.audio, d.id).toBe(`${d.id}.ogg`);
    }
  });

  it('renders a caption within the Telegram limit, pinned left-to-right', () => {
    for (const d of ALL_DIALOGUES) {
      const caption = buildDialogueCaption(d);
      expect(caption.length, d.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption.codePointAt(0), d.id).toBe(0x2066);
      expect(caption.codePointAt(caption.length - 1), d.id).toBe(0x2069);
      // The first line of the exchange shows up in the caption.
      expect(caption, d.id).toContain(d.turns[0]!.text);
    }
  });

  it('does not use em-dashes in any prose (a house style rule)', () => {
    for (const d of ALL_DIALOGUES) {
      expect(d.situation.includes('—'), d.id).toBe(false);
      expect(d.note.includes('—'), d.id).toBe(false);
      for (const t of d.turns) expect(t.text.includes('—'), d.id).toBe(false);
    }
  });
});

describe('dialoguesPool', () => {
  it('interleaves a two-level band so the levels alternate', () => {
    const pool = dialoguesPool(['a1', 'a2']);
    expect(pool[0]?.level).toBe('a1');
    expect(pool[1]?.level).toBe('a2');
  });

  it('is empty for an empty band', () => {
    expect(dialoguesPool([])).toEqual([]);
  });
});

describe('dialogue coverage', () => {
  it('ships a healthy number of dialogues per level', () => {
    for (const level of LEVELS) {
      expect(dialoguesPool([level]).length, level).toBeGreaterThanOrEqual(20);
    }
  });
});
