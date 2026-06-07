/**
 * C2 (mastery) pronunciation drills: assimilation across word boundaries, the
 * American tapped t, heavy reductions of function words, and the way sentence
 * stress alone can change a whole meaning.
 */
import type { PronunciationDrill } from '../types';

export const c2Pronunciation: PronunciationDrill[] = [
  {
    id: 'c2-pn-001',
    focus: 'connected-speech',
    title: 'assimilation of place',
    explanation: `Sounds shift to match their neighbor: "ten boys" can sound like "tem boys".`,
    items: ['ten boys', 'good girl', 'that boy'],
    note: `The "n" or "d" moves toward the next sound; do not force it, just relax.`,
    audio: 'c2-pn-001.ogg',
  },
  {
    id: 'c2-pn-002',
    focus: 'weak-forms',
    title: 'shoulda, coulda, musta',
    explanation: `Strings of small words blur: "should have" becomes "shoulda" in fast speech.`,
    items: ["I shouldn't have asked.", 'You could have told me.', 'It must have been late.'],
    note: `"have" becomes a quick "uh-v" or even just "uh"; never "of" in writing.`,
    audio: 'c2-pn-002.ogg',
  },
  {
    id: 'c2-pn-003',
    focus: 'word-stress',
    title: 'stress for contrast',
    explanation: `Move the stress onto the word you want to contrast, and the meaning sharpens.`,
    items: ['I said the BLUE one, not the red one.', 'She LIKES him, she does not love him.'],
    note: `Stress tells the listener exactly what you mean.`,
    audio: 'c2-pn-003.ogg',
  },
  {
    id: 'c2-pn-004',
    focus: 'connected-speech',
    title: 'the American tapped t',
    explanation: `Between vowels, American "t" becomes a quick "d"-like tap.`,
    items: ['water', 'better', 'a lot of it'],
    note: `It sounds like "wadder" and "bedder" in American English.`,
    audio: 'c2-pn-004.ogg',
  },
  {
    id: 'c2-pn-005',
    focus: 'minimal-pair',
    title: 'cot vs caught vs court',
    explanation: `These vary by accent; in many American accents only "court" adds an r-color.`,
    items: ['cot, caught, court', 'tot, taught, taut', 'He sat on the cot.'],
    note: `Court carries the r-color; the other two do not.`,
    audio: 'c2-pn-005.ogg',
  },
  {
    id: 'c2-pn-006',
    focus: 'weak-forms',
    title: 'you and your become ya, yer',
    explanation: `In fast, casual speech, "you" and "your" shrink to "ya" and "yer".`,
    items: ['See you later.', "What's your name?", 'Thank you very much.'],
    note: `Casual only; over-reducing can sound sloppy in formal talk.`,
    audio: 'c2-pn-006.ogg',
  },
  {
    id: 'c2-pn-007',
    focus: 'connected-speech',
    title: 'rhythm in a long phrase',
    explanation: `English is stress-timed: it squeezes weak syllables between the strong beats.`,
    items: ['a cup of coffee and a piece of cake', 'out of sight, out of mind'],
    note: `Hit the strong content words; rush lightly through the rest.`,
    audio: 'c2-pn-007.ogg',
  },
  {
    id: 'c2-pn-008',
    focus: 'word-stress',
    title: 'sentence stress changes meaning',
    explanation: `The stressed word carries the main message, so moving it rewrites the sentence.`,
    items: [
      'I never said she stole it.',
      'I never said SHE stole it.',
      'I never said she STOLE it.',
    ],
    note: `Say each version stressing the capital word and feel the meaning change.`,
    audio: 'c2-pn-008.ogg',
  },
];
