/**
 * B2 (upper-intermediate) grammar points: unreal conditionals, the passive,
 * reported speech, and the structures that make speech sound polished.
 */
import type { GrammarRule } from '../types';

export const b2Grammar: GrammarRule[] = [
  {
    id: 'b2-gr-001',
    rule: 'Second conditional (unreal present)',
    explanation: `If + past simple, then would + base verb. For imaginary or unlikely situations.`,
    examples: [
      'If I had time, I would travel.',
      'If I were you, I would wait.',
      'What would you do if you won?',
    ],
    note: `Use "were" for everyone here: "If I were you".`,
    audio: 'b2-gr-001.ogg',
  },
  {
    id: 'b2-gr-002',
    rule: 'Present perfect continuous',
    explanation: `Have/has been + -ing for an action that started in the past and is still going.`,
    examples: [
      'I have been working all day.',
      'It has been raining for hours.',
      'How long have you been waiting?',
    ],
    note: `It stresses the activity and its duration, not the result.`,
    audio: 'b2-gr-002.ogg',
  },
  {
    id: 'b2-gr-003',
    rule: 'The passive voice',
    explanation: `Be + past participle, when the action matters more than who did it.`,
    examples: [
      'The report was written by Sam.',
      'English is spoken here.',
      'The keys have been found.',
    ],
    note: `Add "by" only if you need to say who did it.`,
    audio: 'b2-gr-003.ogg',
  },
  {
    id: 'b2-gr-004',
    rule: 'Reported speech',
    explanation: `When you report what someone said, shift the tense one step back.`,
    examples: [
      'She said she was tired.',
      'He told me he would come.',
      'They said they had finished.',
    ],
    note: `"I am tired" becomes "She said she was tired".`,
    audio: 'b2-gr-004.ogg',
  },
  {
    id: 'b2-gr-005',
    rule: 'Relative clauses (who, which, that)',
    explanation: `Use "who" for people, "which" for things, and "that" for either.`,
    examples: [
      'The man who called is my boss.',
      'The book that I read was great.',
      'The car, which is new, broke down.',
    ],
    note: `Use commas only for extra, non-essential information.`,
    audio: 'b2-gr-005.ogg',
  },
  {
    id: 'b2-gr-006',
    rule: 'Modals of deduction',
    explanation: `Use "must" when you are sure, and "can't" when something is impossible.`,
    examples: ['She must be tired.', 'That can not be true.', 'He might be at home.'],
    note: `Use "might" or "could" when you are only guessing.`,
    audio: 'b2-gr-006.ogg',
  },
  {
    id: 'b2-gr-007',
    rule: 'wish for present regrets',
    explanation: `Use "wish" plus the past simple to talk about a present situation you want to be different.`,
    examples: [
      'I wish I had more time.',
      'I wish I were taller.',
      'She wishes she knew the answer.',
    ],
    note: `The past form here is about now, not the past: "I wish I had time" (but I do not).`,
    audio: 'b2-gr-007.ogg',
  },
  {
    id: 'b2-gr-008',
    rule: 'so and such',
    explanation: `Use "so" before an adjective alone, and "such" before (a) plus a noun.`,
    examples: [
      'It was so cold.',
      'It was such a cold day.',
      'She is so kind. She is such a kind person.',
    ],
    note: `so + adjective; such + (a/an) + (adjective) + noun.`,
    audio: 'b2-gr-008.ogg',
  },
];
