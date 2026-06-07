/**
 * C1 (advanced) pronunciation drills: stress that shifts with word forms, the
 * schwa and weak forms that drive English rhythm, elision, and the smooth
 * catenation of natural speech.
 */
import type { PronunciationDrill } from '../types';

export const c1Pronunciation: PronunciationDrill[] = [
  {
    id: 'c1-pn-001',
    focus: 'word-stress',
    title: 'REcord vs reCORD',
    explanation: `Many words shift stress by job: REcord (noun) vs reCORD (verb). Stress changes meaning.`,
    items: ['record, record', 'present, present', 'Please record this record.'],
    note: `Stress the first part for the noun, the second for the verb.`,
    audio: 'c1-pn-001.ogg',
  },
  {
    id: 'c1-pn-002',
    focus: 'word-stress',
    title: 'stress moves with endings',
    explanation: `Adding a suffix can move the stress to a different syllable.`,
    items: ['PHOto, phoTOgrapher, photoGRAPHic', 'ECONomy, ecoNOMic', 'POLitics, poLItical'],
    note: `Let the stress shift; do not keep it fixed on the root.`,
    audio: 'c1-pn-002.ogg',
  },
  {
    id: 'c1-pn-003',
    focus: 'weak-forms',
    title: 'the schwa, English rhythm',
    explanation: `Unstressed vowels collapse to a quick "uh", the schwa. It is the most common sound.`,
    items: ['banana', 'about', 'the support of a teacher'],
    note: `Squeeze the weak syllables; only the stressed one is clear.`,
    audio: 'c1-pn-003.ogg',
  },
  {
    id: 'c1-pn-004',
    focus: 'connected-speech',
    title: 'elision: dropping sounds',
    explanation: `In clusters, sounds drop, like the "t" in "next day" or "most people".`,
    items: ['next day', 'most people', 'kept quiet'],
    note: `The middle consonant often vanishes in fast speech.`,
    audio: 'c1-pn-004.ogg',
  },
  {
    id: 'c1-pn-005',
    focus: 'weak-forms',
    title: 'two ways to say the',
    explanation: `"the" is "thuh" before a consonant sound and "thee" before a vowel sound.`,
    items: ['the book', 'the apple', 'the end of the hour'],
    note: `It follows the sound, not the spelling: "thee hour".`,
    audio: 'c1-pn-005.ogg',
  },
  {
    id: 'c1-pn-006',
    focus: 'connected-speech',
    title: 'catenation across words',
    explanation: `Final consonants flow onto the next word's vowel, making one smooth stream.`,
    items: ['an apple a day', 'first of all', 'an hour and a half'],
    note: `Aim for a single connected sound, not separate words.`,
    audio: 'c1-pn-006.ogg',
  },
  {
    id: 'c1-pn-007',
    focus: 'word-stress',
    title: 'compound noun stress',
    explanation: `Compound nouns usually stress the first word, which marks one specific thing.`,
    items: ['GREENhouse', 'BLACKboard', 'a HOTdog, not a hot DOG'],
    note: `Stress the first part to mean the compound, not two separate words.`,
    audio: 'c1-pn-007.ogg',
  },
  {
    id: 'c1-pn-008',
    focus: 'minimal-pair',
    title: 'saw vs sore vs so',
    explanation: `Subtle differences in vowel and r-coloring (American English) set these apart.`,
    items: ['saw, sore, so', 'law, lore, low', 'I saw a sore on my toe.'],
    note: `In American English, "sore" carries an r-color; "saw" and "so" do not.`,
    audio: 'c1-pn-008.ogg',
  },
];
