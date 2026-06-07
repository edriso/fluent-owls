/**
 * A1 (beginner) grammar points.
 *
 * One small, high-frequency rule each, in plain words, with example sentences
 * the audio reads aloud. The learner reads the rule and HEARS it used correctly.
 */
import type { GrammarRule } from '../types';

export const a1Grammar: GrammarRule[] = [
  {
    id: 'a1-gr-001',
    rule: 'The verb "to be": am, is, are',
    explanation: `Use "am" with I, "is" with he, she, or it, and "are" with you, we, and they.`,
    examples: ['I am a student.', 'She is happy.', 'They are at home.'],
    note: `Do not drop it: say "She is happy", not "She happy".`,
    audio: 'a1-gr-001.ogg',
  },
  {
    id: 'a1-gr-002',
    rule: 'a and an',
    explanation: `Use "a" before a consonant sound and "an" before a vowel sound.`,
    examples: ['I have a cat.', 'She ate an apple.', 'He is an hour late.'],
    note: `It is about the sound, not the letter: "an hour", "a university".`,
    audio: 'a1-gr-002.ogg',
  },
  {
    id: 'a1-gr-003',
    rule: 'Plural nouns with -s',
    explanation: `Add -s to most nouns to talk about more than one.`,
    examples: ['One book, two books.', 'I have three cats.', 'We need some chairs.'],
    note: `A few are irregular: one child, two children; one man, two men.`,
    audio: 'a1-gr-003.ogg',
  },
  {
    id: 'a1-gr-004',
    rule: 'this and that',
    explanation: `Use "this" for something near you and "that" for something far.`,
    examples: ['This is my bag.', 'That is your car.', 'I like this one.'],
    note: `For more than one, use "these" (near) and "those" (far).`,
    audio: 'a1-gr-004.ogg',
  },
  {
    id: 'a1-gr-005',
    rule: 'Present simple with I, you, we, they',
    explanation: `Use the base verb (no ending) with I, you, we, and they.`,
    examples: ['I work in a shop.', 'We live here.', 'They play football.'],
    note: `Do not add -s with these subjects: "I work", not "I works".`,
    audio: 'a1-gr-005.ogg',
  },
  {
    id: 'a1-gr-006',
    rule: 'Present simple with he, she, it',
    explanation: `Add -s to the verb with he, she, and it.`,
    examples: ['He works at a bank.', 'She likes tea.', 'It rains a lot here.'],
    note: `This -s is easy to forget. Say "She likes", not "She like".`,
    audio: 'a1-gr-006.ogg',
  },
  {
    id: 'a1-gr-007',
    rule: 'can for ability',
    explanation: `Use "can" plus the base verb to say what you are able to do.`,
    examples: ['I can swim.', 'She can drive.', 'Can you help me?'],
    note: `No "to" and no -s: "She can drive", not "She can to drives".`,
    audio: 'a1-gr-007.ogg',
  },
  {
    id: 'a1-gr-008',
    rule: 'there is and there are',
    explanation: `Use "there is" for one thing and "there are" for more than one.`,
    examples: [
      'There is a book on the desk.',
      'There are two pens here.',
      'Is there a bank nearby?',
    ],
    note: `Match the noun: one means "is", many means "are".`,
    audio: 'a1-gr-008.ogg',
  },
];
