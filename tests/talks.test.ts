import { describe, expect, it } from 'vitest';
import { ALL_TALKS, talksPool } from '../src/content/talks';
import { buildTalkCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  NOTE_MAX_CHARS,
  TALK_MAX_CHARS,
  TALK_TOPIC_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('talk banks', () => {
  it('has talks at every level', () => {
    for (const level of LEVELS) {
      expect(talksPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the tk marker', () => {
    const ids = ALL_TALKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of ALL_TALKS) {
      expect(t.id.startsWith(`${t.level}-tk-`), t.id).toBe(true);
    }
  });

  it('has a topic, text, and note within their limits', () => {
    for (const t of ALL_TALKS) {
      expect(t.topic.trim().length, t.id).toBeGreaterThan(0);
      expect(t.topic.length, t.id).toBeLessThanOrEqual(TALK_TOPIC_MAX_CHARS);
      expect(t.text.trim().length, t.id).toBeGreaterThan(0);
      expect(t.text.length, t.id).toBeLessThanOrEqual(TALK_MAX_CHARS);
      expect(t.note.trim().length, t.id).toBeGreaterThan(0);
      expect(t.note.length, t.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('has an audio name of <id>.ogg and a caption that renders within the limit, LTR-pinned', () => {
    for (const t of ALL_TALKS) {
      expect(t.audio, t.id).toBe(`${t.id}.ogg`);
      const caption = buildTalkCaption(t);
      expect(caption.length, t.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption.codePointAt(0), t.id).toBe(0x2066);
      expect(caption, t.id).toContain(t.topic);
    }
  });

  it('uses no em-dashes (house style)', () => {
    for (const t of ALL_TALKS) {
      const blob = [t.topic, t.text, t.note].join(' ');
      expect(blob.includes('—'), t.id).toBe(false);
    }
  });
});
