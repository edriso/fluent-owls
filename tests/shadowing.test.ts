import { describe, expect, it } from 'vitest';
import { ALL_SHADOWING, shadowingPool } from '../src/content/shadowing';
import { buildShadowingCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  CONTEXT_MAX_CHARS,
  NOTE_MAX_CHARS,
  TRANSCRIPT_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS, type ShadowingFocus } from '../src/types';

const VALID_FOCUS: ShadowingFocus[] = ['linking', 'stress', 'intonation', 'reduction', 'pacing'];

describe('shadowing banks', () => {
  it('has clips at every level', () => {
    for (const level of LEVELS) {
      expect(shadowingPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the sh marker', () => {
    const ids = ALL_SHADOWING.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of ALL_SHADOWING) {
      expect(c.id.startsWith(`${c.level}-sh-`), c.id).toBe(true);
    }
  });

  it('has a non-empty transcript within the limit', () => {
    for (const c of ALL_SHADOWING) {
      expect(c.text.trim().length, c.id).toBeGreaterThan(0);
      expect(c.text.length, c.id).toBeLessThanOrEqual(TRANSCRIPT_MAX_CHARS);
    }
  });

  it('has a non-empty context and note within their limits', () => {
    for (const c of ALL_SHADOWING) {
      expect(c.context.trim().length, c.id).toBeGreaterThan(0);
      expect(c.context.length, c.id).toBeLessThanOrEqual(CONTEXT_MAX_CHARS);
      expect(c.note.trim().length, c.id).toBeGreaterThan(0);
      expect(c.note.length, c.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('uses a valid focus', () => {
    for (const c of ALL_SHADOWING) {
      expect(VALID_FOCUS, c.id).toContain(c.focus);
    }
  });

  it('names its audio file after its id', () => {
    for (const c of ALL_SHADOWING) {
      expect(c.audio, c.id).toBe(`${c.id}.ogg`);
    }
  });

  it('renders a caption within the Telegram limit, pinned left-to-right', () => {
    for (const c of ALL_SHADOWING) {
      const caption = buildShadowingCaption(c);
      expect(caption.length, c.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      // Wrapped in a Unicode LTR isolate (U+2066 ... U+2069) so a leading emoji
      // never mirrors for a reader on an RTL-locale client.
      expect(caption.codePointAt(0), c.id).toBe(0x2066);
      expect(caption.codePointAt(caption.length - 1), c.id).toBe(0x2069);
      expect(caption, c.id).toContain(c.text);
    }
  });

  it('does not use em-dashes in any prose (a house style rule)', () => {
    for (const c of ALL_SHADOWING) {
      expect(c.text.includes('—'), c.id).toBe(false);
      expect(c.context.includes('—'), c.id).toBe(false);
      expect(c.note.includes('—'), c.id).toBe(false);
    }
  });
});

describe('shadowingPool', () => {
  it('interleaves a two-level band so the levels alternate', () => {
    const pool = shadowingPool(['a1', 'a2']);
    expect(pool[0]?.level).toBe('a1');
    expect(pool[1]?.level).toBe('a2');
  });

  it('is empty for an empty band', () => {
    expect(shadowingPool([])).toEqual([]);
  });
});

describe('shadowing coverage', () => {
  it('ships a healthy number of clips per level', () => {
    for (const level of LEVELS) {
      // 40 per level, pooled across 6 levels at one post a day, is ~8 months
      // before any repeat. Guard against a bank accidentally shrinking.
      expect(shadowingPool([level]).length, level).toBeGreaterThanOrEqual(40);
    }
  });

  it('varies the focus within each level (not all the same drill)', () => {
    for (const level of LEVELS) {
      const focuses = new Set(shadowingPool([level]).map((c) => c.focus));
      expect(focuses.size, level).toBeGreaterThanOrEqual(3);
    }
  });
});
