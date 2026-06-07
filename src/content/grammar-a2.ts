/**
 * A2 (elementary) grammar points: the past, the near future, and everyday
 * function words. Plain rules with spoken examples.
 */
import type { GrammarRule } from '../types';

export const a2Grammar: GrammarRule[] = [
  {
    id: 'a2-gr-001',
    rule: 'Past simple: regular verbs (-ed)',
    explanation: `Add -ed to a regular verb to talk about a finished past action.`,
    examples: ['I worked yesterday.', 'We watched a movie.', 'She called me last night.'],
    note: `The time is finished and known (yesterday, last night).`,
    audio: 'a2-gr-001.ogg',
  },
  {
    id: 'a2-gr-002',
    rule: 'Past simple: irregular verbs',
    explanation: `Many common verbs change form in the past instead of adding -ed.`,
    examples: ['I went home early.', 'She saw a bird.', 'We had a great time.'],
    note: `These must be learned one by one: go-went, see-saw, have-had.`,
    audio: 'a2-gr-002.ogg',
  },
  {
    id: 'a2-gr-003',
    rule: 'Present continuous (am/is/are + -ing)',
    explanation: `Use it for an action happening right now.`,
    examples: ['I am eating lunch.', 'They are playing outside.', 'She is working now.'],
    note: `For things happening now, not for habits (use present simple for habits).`,
    audio: 'a2-gr-003.ogg',
  },
  {
    id: 'a2-gr-004',
    rule: 'going to for plans',
    explanation: `Use "going to" plus the base verb for future plans and intentions.`,
    examples: ['I am going to call her.', 'We are going to travel.', 'It is going to rain.'],
    note: `Use it when you have already decided something.`,
    audio: 'a2-gr-004.ogg',
  },
  {
    id: 'a2-gr-005',
    rule: 'Comparatives with -er',
    explanation: `Add -er to short adjectives, then "than" to compare two things.`,
    examples: [
      'She is taller than me.',
      'This phone is cheaper.',
      'Today is colder than yesterday.',
    ],
    note: `Double the last letter sometimes: big becomes bigger.`,
    audio: 'a2-gr-005.ogg',
  },
  {
    id: 'a2-gr-006',
    rule: 'some and any',
    explanation: `Use "some" in positive sentences and "any" in questions and negatives.`,
    examples: ['I have some money.', 'Do you have any questions?', 'There is not any milk.'],
    note: `Offers are an exception: "Would you like some tea?"`,
    audio: 'a2-gr-006.ogg',
  },
  {
    id: 'a2-gr-007',
    rule: 'have to for obligation',
    explanation: `Use "have to" (or "has to") plus the base verb for things you must do.`,
    examples: ['I have to go now.', 'She has to work tomorrow.', 'Do we have to pay?'],
    note: `Use "has to" with he, she, and it.`,
    audio: 'a2-gr-007.ogg',
  },
  {
    id: 'a2-gr-008',
    rule: 'would like for polite wants',
    explanation: `"Would like" is a polite way to say "want".`,
    examples: ['I would like a coffee.', 'Would you like some help?', 'She would like to join us.'],
    note: `Use "to" before a verb: "would like to join".`,
    audio: 'a2-gr-008.ogg',
  },
];
