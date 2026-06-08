import { describe, expect, it } from 'vitest';
import { ALL_STORIES, storiesPool } from '../src/content/stories';
import { buildStoryCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  NOTE_MAX_CHARS,
  STORY_MAX_CHARS,
  STORY_TITLE_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('story banks', () => {
  it('has stories at every level', () => {
    for (const level of LEVELS) {
      expect(storiesPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the st marker', () => {
    const ids = ALL_STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of ALL_STORIES) {
      expect(s.id.startsWith(`${s.level}-st-`), s.id).toBe(true);
    }
  });

  it('has a title, text, and note within their limits', () => {
    for (const s of ALL_STORIES) {
      expect(s.title.trim().length, s.id).toBeGreaterThan(0);
      expect(s.title.length, s.id).toBeLessThanOrEqual(STORY_TITLE_MAX_CHARS);
      expect(s.text.trim().length, s.id).toBeGreaterThan(0);
      expect(s.text.length, s.id).toBeLessThanOrEqual(STORY_MAX_CHARS);
      expect(s.note.trim().length, s.id).toBeGreaterThan(0);
      expect(s.note.length, s.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('has an audio name of <id>.ogg and a caption that renders within the limit, LTR-pinned', () => {
    for (const s of ALL_STORIES) {
      expect(s.audio, s.id).toBe(`${s.id}.ogg`);
      const caption = buildStoryCaption(s);
      expect(caption.length, s.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption.codePointAt(0), s.id).toBe(0x2066);
      expect(caption, s.id).toContain(s.title);
    }
  });

  it('uses no em-dashes (house style)', () => {
    for (const s of ALL_STORIES) {
      const blob = [s.title, s.text, s.note].join(' ');
      expect(blob.includes('—'), s.id).toBe(false);
    }
  });
});
