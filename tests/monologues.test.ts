import { describe, expect, it } from 'vitest';
import { ALL_MONOLOGUES, monologuesPool } from '../src/content/monologues';
import { buildMonologueCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  MONOLOGUE_MAX_CHARS,
  NOTE_MAX_CHARS,
  TOPIC_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('monologue banks', () => {
  it('has monologues at every level', () => {
    for (const level of LEVELS) {
      expect(monologuesPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the mn marker', () => {
    const ids = ALL_MONOLOGUES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of ALL_MONOLOGUES) {
      expect(m.id.startsWith(`${m.level}-mn-`), m.id).toBe(true);
    }
  });

  it('has topic, text, and note within their limits', () => {
    for (const m of ALL_MONOLOGUES) {
      expect(m.topic.trim().length, m.id).toBeGreaterThan(0);
      expect(m.topic.length, m.id).toBeLessThanOrEqual(TOPIC_MAX_CHARS);
      expect(m.text.trim().length, m.id).toBeGreaterThan(0);
      expect(m.text.length, m.id).toBeLessThanOrEqual(MONOLOGUE_MAX_CHARS);
      expect(m.note.trim().length, m.id).toBeGreaterThan(0);
      expect(m.note.length, m.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('names its audio file after its id', () => {
    for (const m of ALL_MONOLOGUES) {
      expect(m.audio, m.id).toBe(`${m.id}.ogg`);
    }
  });

  it('renders a caption within the Telegram limit, pinned left-to-right', () => {
    for (const m of ALL_MONOLOGUES) {
      const caption = buildMonologueCaption(m);
      expect(caption.length, m.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption.codePointAt(0), m.id).toBe(0x2066);
      expect(caption.codePointAt(caption.length - 1), m.id).toBe(0x2069);
      expect(caption, m.id).toContain(m.text);
    }
  });

  it('does not use em-dashes in any prose (a house style rule)', () => {
    for (const m of ALL_MONOLOGUES) {
      expect(m.topic.includes('—'), m.id).toBe(false);
      expect(m.text.includes('—'), m.id).toBe(false);
      expect(m.note.includes('—'), m.id).toBe(false);
    }
  });
});

describe('monologuesPool', () => {
  it('interleaves a two-level band so the levels alternate', () => {
    const pool = monologuesPool(['a1', 'a2']);
    expect(pool[0]?.level).toBe('a1');
    expect(pool[1]?.level).toBe('a2');
  });

  it('is empty for an empty band', () => {
    expect(monologuesPool([])).toEqual([]);
  });
});

describe('monologue coverage', () => {
  it('ships a healthy number of monologues per level', () => {
    for (const level of LEVELS) {
      expect(monologuesPool([level]).length, level).toBeGreaterThanOrEqual(10);
    }
  });
});
