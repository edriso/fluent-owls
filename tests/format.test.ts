import { describe, expect, it } from 'vitest';
import {
  buildDialogueCaption,
  buildPhraseMessage,
  buildPrompt,
  buildShadowingCaption,
  clampExplanation,
  toPollOptions,
} from '../src/lib/format';
import type {
  LeveledDialogue,
  LeveledNativePhrase,
  LeveledQuestion,
  LeveledShadowingClip,
} from '../src/types';

const sample: LeveledQuestion = {
  id: 'b1-001',
  level: 'b1',
  topic: 'collocations',
  prompt: 'We need to ____ a decision by Friday.',
  options: ['do', 'make', 'take', 'have'],
  correctIndex: 1,
  explanation: 'You make a decision.',
};

const sampleClip: LeveledShadowingClip = {
  id: 'b1-sh-001',
  level: 'b1',
  text: 'Honestly, I think it is worth a try.',
  context: 'Sharing an opinion',
  focus: 'stress',
  note: 'Lean on the strong words.',
  audio: 'b1-sh-001.ogg',
};

const samplePhrase: LeveledNativePhrase = {
  id: 'b1-ph-001',
  level: 'b1',
  phrase: 'I see your point, but ...',
  situation: 'Disagreeing politely',
  example: 'I see your point, but it is too expensive.',
  fn: 'disagreeing',
};

const sampleDialogue: LeveledDialogue = {
  id: 'b1-dl-001',
  level: 'b1',
  situation: 'A request at work',
  turns: [
    { speaker: 'A', text: 'Could you send me the report?' },
    { speaker: 'B', text: 'Sure, I will do it now.' },
  ],
  note: 'Accept warmly.',
  audio: 'b1-dl-001.ogg',
};

describe('buildPrompt', () => {
  it('prefixes a level and topic header before the prompt', () => {
    const out = buildPrompt(sample);
    expect(out).toContain('B1');
    expect(out).toContain('Collocations');
    expect(out).toContain(sample.prompt);
  });

  it('renders the badge and label for a different level and topic', () => {
    const out = buildPrompt({ ...sample, id: 'c2-001', level: 'c2', topic: 'idioms' });
    expect(out).toContain('C2');
    expect(out).toContain('Idioms');
  });
});

describe('toPollOptions', () => {
  it('maps strings to Telegram option objects, preserving order', () => {
    expect(toPollOptions(['a', 'b', 'c', 'd'])).toEqual([
      { text: 'a' },
      { text: 'b' },
      { text: 'c' },
      { text: 'd' },
    ]);
  });

  it('throws when there are too few options', () => {
    expect(() => toPollOptions(['only-one'])).toThrowError();
  });

  it('throws when there are too many options (Telegram caps at 10)', () => {
    expect(() => toPollOptions(Array.from({ length: 11 }, (_, i) => `option ${i}`))).toThrowError();
  });

  it('throws when an option is too long', () => {
    expect(() => toPollOptions(['a', 'x'.repeat(101)])).toThrowError();
  });
});

describe('clampExplanation', () => {
  it('returns undefined for empty input', () => {
    expect(clampExplanation(undefined)).toBeUndefined();
    expect(clampExplanation('   ')).toBeUndefined();
  });

  it('keeps short explanations intact and trims surrounding whitespace', () => {
    expect(clampExplanation('short')).toBe('short');
    expect(clampExplanation('  trimmed  ')).toBe('trimmed');
  });

  it('keeps an explanation that is exactly at the limit intact (no ellipsis)', () => {
    const exact = 'y'.repeat(200);
    expect(clampExplanation(exact)).toBe(exact);
  });

  it('clamps over-long explanations to the limit with an ellipsis', () => {
    const out = clampExplanation('x'.repeat(250));
    expect(out).toBeDefined();
    expect(out!.length).toBe(200);
    expect(out!.endsWith('…')).toBe(true);
  });
});

describe('buildShadowingCaption', () => {
  it('includes the level, context, transcript, and tip', () => {
    const out = buildShadowingCaption(sampleClip);
    expect(out).toContain('B1');
    expect(out).toContain('Shadow this');
    expect(out).toContain(sampleClip.context);
    expect(out).toContain(sampleClip.text);
    expect(out).toContain(sampleClip.note);
  });

  it('pins the caption left-to-right with a Unicode isolate', () => {
    const out = buildShadowingCaption(sampleClip);
    expect(out.codePointAt(0)).toBe(0x2066);
    expect(out.codePointAt(out.length - 1)).toBe(0x2069);
  });
});

describe('buildDialogueCaption', () => {
  it('includes the level, situation, both lines, and the tip', () => {
    const out = buildDialogueCaption(sampleDialogue);
    expect(out).toContain('B1');
    expect(out).toContain('Role-play');
    expect(out).toContain(sampleDialogue.situation);
    expect(out).toContain('A: Could you send me the report?');
    expect(out).toContain('B: Sure, I will do it now.');
    expect(out).toContain(sampleDialogue.note);
  });

  it('pins the caption left-to-right with a Unicode isolate', () => {
    const out = buildDialogueCaption(sampleDialogue);
    expect(out.codePointAt(0)).toBe(0x2066);
    expect(out.codePointAt(out.length - 1)).toBe(0x2069);
  });
});

describe('buildPhraseMessage', () => {
  it('includes the level, function label, phrase, situation, and example', () => {
    const out = buildPhraseMessage(samplePhrase);
    expect(out).toContain('B1');
    expect(out).toContain('Say it like a native');
    expect(out).toContain('Disagreeing');
    expect(out).toContain(samplePhrase.phrase);
    expect(out).toContain(samplePhrase.situation);
    expect(out).toContain(samplePhrase.example);
  });

  it('escapes HTML-special characters in the content', () => {
    const out = buildPhraseMessage({
      ...samplePhrase,
      phrase: 'me & you < them',
      example: '1 < 2 & true',
    });
    expect(out).toContain('me &amp; you &lt; them');
    expect(out).toContain('1 &lt; 2 &amp; true');
    // The raw, unescaped ampersand must not leak through.
    expect(out).not.toContain('me & you');
  });
});
