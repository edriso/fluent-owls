/**
 * B1 (intermediate) grammar points: the present perfect, real conditionals,
 * past habits, and the structures that trip learners up most.
 */
import type { GrammarRule } from '../types';

export const b1Grammar: GrammarRule[] = [
  {
    id: 'b1-gr-001',
    rule: 'Present perfect for experience',
    explanation: `Use "have/has" plus the past participle for life experience, with no exact time.`,
    examples: [
      'I have visited Paris.',
      'Have you ever tried sushi?',
      'She has never flown before.',
    ],
    note: `No finished time word here. Do not say "I have visited Paris last year".`,
    audio: 'b1-gr-001.ogg',
  },
  {
    id: 'b1-gr-002',
    rule: 'Present perfect vs past simple',
    explanation: `Use the past simple when you say WHEN; use the present perfect when you do not.`,
    examples: [
      'I have lost my keys.',
      'I lost them yesterday.',
      'She has finished. She finished at six.',
    ],
    note: `A finished time word (yesterday, at six) forces the past simple.`,
    audio: 'b1-gr-002.ogg',
  },
  {
    id: 'b1-gr-003',
    rule: 'First conditional (real future)',
    explanation: `If + present simple, then will + base verb. For likely future situations.`,
    examples: [
      'If it rains, I will stay home.',
      'She will pass if she studies.',
      'If you ask, he will help.',
    ],
    note: `Do not use "will" in the if-part: "If it rains", not "If it will rain".`,
    audio: 'b1-gr-003.ogg',
  },
  {
    id: 'b1-gr-004',
    rule: 'used to for past habits',
    explanation: `Use "used to" plus the base verb for things that were true before but are not now.`,
    examples: ['I used to smoke.', 'She used to live here.', 'We used to play together.'],
    note: `In questions and negatives, drop the -d: "Did you use to...?"`,
    audio: 'b1-gr-004.ogg',
  },
  {
    id: 'b1-gr-005',
    rule: 'Comparatives with more',
    explanation: `Use "more" before longer adjectives instead of adding -er.`,
    examples: [
      'This is more expensive.',
      'It is more interesting than the book.',
      'She is more careful now.',
    ],
    note: `Say "more careful", never "more carefuller" or "carefuller".`,
    audio: 'b1-gr-005.ogg',
  },
  {
    id: 'b1-gr-006',
    rule: 'too and enough',
    explanation: `"Too" goes before an adjective (a problem); "enough" goes after it (the right amount).`,
    examples: [
      'It is too expensive.',
      'It is not big enough.',
      'I am not tall enough to reach it.',
    ],
    note: `"too" means more than you want; "enough" means as much as you need.`,
    audio: 'b1-gr-006.ogg',
  },
  {
    id: 'b1-gr-007',
    rule: 'Past continuous',
    explanation: `Was/were + -ing for an action in progress at a past moment.`,
    examples: [
      'I was sleeping when you called.',
      'They were eating at noon.',
      'What were you doing?',
    ],
    note: `Often paired with the past simple: a longer action interrupted by a shorter one.`,
    audio: 'b1-gr-007.ogg',
  },
  {
    id: 'b1-gr-008',
    rule: 'should for advice',
    explanation: `Use "should" plus the base verb to give advice or an opinion.`,
    examples: ['You should rest.', 'You should not worry.', 'Should I call her?'],
    note: `No "to" after should: "You should rest", not "You should to rest".`,
    audio: 'b1-gr-008.ogg',
  },
];
