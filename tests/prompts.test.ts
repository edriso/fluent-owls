import { describe, expect, it } from 'vitest';
import { ALL_PROMPTS, promptsPool } from '../src/content/prompts';
import { buildPromptCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  NOTE_MAX_CHARS,
  PROMPT_ANSWER_MAX_CHARS,
  PROMPT_QUESTION_MAX_CHARS,
  TOPIC_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

describe('prompt banks', () => {
  it('has prompts at every level', () => {
    for (const level of LEVELS) {
      expect(promptsPool([level]).length, level).toBeGreaterThan(0);
    }
  });

  it('has unique ids that start with their level and the pr marker', () => {
    const ids = ALL_PROMPTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of ALL_PROMPTS) {
      expect(p.id.startsWith(`${p.level}-pr-`), p.id).toBe(true);
    }
  });

  it('has topic, question, answer, and note within their limits', () => {
    for (const p of ALL_PROMPTS) {
      expect(p.topic.trim().length, p.id).toBeGreaterThan(0);
      expect(p.topic.length, p.id).toBeLessThanOrEqual(TOPIC_MAX_CHARS);
      expect(p.question.trim().length, p.id).toBeGreaterThan(0);
      expect(p.question.length, p.id).toBeLessThanOrEqual(PROMPT_QUESTION_MAX_CHARS);
      expect(p.answer.trim().length, p.id).toBeGreaterThan(0);
      expect(p.answer.length, p.id).toBeLessThanOrEqual(PROMPT_ANSWER_MAX_CHARS);
      expect(p.note.trim().length, p.id).toBeGreaterThan(0);
      expect(p.note.length, p.id).toBeLessThanOrEqual(NOTE_MAX_CHARS);
    }
  });

  it('names its audio file after its id', () => {
    for (const p of ALL_PROMPTS) {
      expect(p.audio, p.id).toBe(`${p.id}.ogg`);
    }
  });

  it('renders a caption within the Telegram limit, pinned left-to-right', () => {
    for (const p of ALL_PROMPTS) {
      const caption = buildPromptCaption(p);
      expect(caption.length, p.id).toBeLessThanOrEqual(CAPTION_MAX_CHARS);
      expect(caption.codePointAt(0), p.id).toBe(0x2066);
      expect(caption.codePointAt(caption.length - 1), p.id).toBe(0x2069);
      expect(caption, p.id).toContain(p.question);
    }
  });

  it('does not use em-dashes in any prose (a house style rule)', () => {
    for (const p of ALL_PROMPTS) {
      expect(p.topic.includes('—'), p.id).toBe(false);
      expect(p.question.includes('—'), p.id).toBe(false);
      expect(p.answer.includes('—'), p.id).toBe(false);
      expect(p.note.includes('—'), p.id).toBe(false);
    }
  });
});

describe('promptsPool', () => {
  it('interleaves a two-level band so the levels alternate', () => {
    const pool = promptsPool(['a1', 'a2']);
    expect(pool[0]?.level).toBe('a1');
    expect(pool[1]?.level).toBe('a2');
  });

  it('is empty for an empty band', () => {
    expect(promptsPool([])).toEqual([]);
  });
});

describe('prompt coverage', () => {
  it('ships a healthy number of prompts per level', () => {
    for (const level of LEVELS) {
      expect(promptsPool([level]).length, level).toBeGreaterThanOrEqual(12);
    }
  });
});
