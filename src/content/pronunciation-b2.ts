/**
 * B2 (upper-intermediate) pronunciation drills: finer vowel contrasts, the
 * voiced/voiceless endings that change a word's job, stress that changes
 * meaning, and the natural blends of everyday speech.
 */
import type { PronunciationDrill } from '../types';

export const b2Pronunciation: PronunciationDrill[] = [
  {
    id: 'b2-pn-001',
    focus: 'minimal-pair',
    title: 'beat vs bit vs bet',
    explanation: `Long ee (beat), short i (bit), and "e" (bet) are three different vowels.`,
    items: ['beat, bit, bet', 'seat, sit, set', 'He bet he could beat it.'],
    note: `Three clearly different mouth positions, from tense to relaxed.`,
    audio: 'b2-pn-001.ogg',
  },
  {
    id: 'b2-pn-002',
    focus: 'minimal-pair',
    title: 'advice vs advise',
    explanation: `The noun "advice" ends in an "s" sound; the verb "advise" ends in a buzzing "z".`,
    items: ['advice, advise', 'a device, to devise', 'My advice is to advise them.'],
    note: `The verb buzzes at the end; the noun hisses.`,
    audio: 'b2-pn-002.ogg',
  },
  {
    id: 'b2-pn-003',
    focus: 'minimal-pair',
    title: 'pleasure vs pressure',
    explanation: `The middle differs: a soft, buzzing "zh" in pleasure vs a sharp "sh" in pressure.`,
    items: ['pleasure, pressure', 'measure, mesher', 'It is a pleasure under pressure.'],
    note: `"zh" is voiced and buzzing; "sh" is quiet and voiceless.`,
    audio: 'b2-pn-003.ogg',
  },
  {
    id: 'b2-pn-004',
    focus: 'word-stress',
    title: 'DEsert vs desSERT',
    explanation: `Stress changes the word: DEsert (dry sand) vs dessSERT (the sweet course).`,
    items: ['desert, dessert', 'We crossed the desert.', 'I want some dessert.'],
    note: `Stress the first part for sand, the second part for sweet.`,
    audio: 'b2-pn-004.ogg',
  },
  {
    id: 'b2-pn-005',
    focus: 'minimal-pair',
    title: 'fan vs fun vs phone',
    explanation: `The vowel does the work: front "a" (fan), central "uh" (fun), gliding "oh" (phone).`,
    items: ['fan, fun, phone', 'ran, run, roan', 'The fan is fun.'],
    note: `Move from a front, open vowel to a relaxed one to a rounded glide.`,
    audio: 'b2-pn-005.ogg',
  },
  {
    id: 'b2-pn-006',
    focus: 'connected-speech',
    title: 'wanna, gonna, hafta',
    explanation: `"want to", "going to", and "have to" reduce to wanna, gonna, and hafta.`,
    items: ['I want to leave.', 'I am going to try.', 'I have to work.'],
    note: `Common and natural in speech; keep the writing standard.`,
    audio: 'b2-pn-006.ogg',
  },
  {
    id: 'b2-pn-007',
    focus: 'connected-speech',
    title: 'assimilation: doncha, woncha',
    explanation: `A "t" before "y" blends into "ch"; a "d" before "y" blends into "j".`,
    items: ["Don't you know?", "Won't you come?", 'Would you mind?'],
    note: `It sounds like "doncha", "woncha", and "wouldja".`,
    audio: 'b2-pn-007.ogg',
  },
  {
    id: 'b2-pn-008',
    focus: 'weak-forms',
    title: 'weak was, were, and can',
    explanation: `When unstressed, "was", "were", and "can" reduce to "wuz", "wer", and "kn".`,
    items: ['I was late.', 'They were ready.', 'I can help.'],
    note: `Stressed "can" and weak "can" sound different; usually it is weak.`,
    audio: 'b2-pn-008.ogg',
  },
];
