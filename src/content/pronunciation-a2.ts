/**
 * A2 (elementary) pronunciation drills: more vowel and consonant contrasts, the
 * tricky r/l and -ng sounds, and the everyday reductions that make speech flow.
 */
import type { PronunciationDrill } from '../types';

export const a2Pronunciation: PronunciationDrill[] = [
  {
    id: 'a2-pn-001',
    focus: 'minimal-pair',
    title: 'live vs leave',
    explanation: `"live" has a short i; "leave" has a long ee. Stretch the long vowel in leave.`,
    items: ['live, leave', 'sit, seat', 'fill, feel', 'I live here, so I will not leave.'],
    note: `Hold the ee in leave a little longer than feels natural.`,
    audio: 'a2-pn-001.ogg',
  },
  {
    id: 'a2-pn-002',
    focus: 'minimal-pair',
    title: 'thin vs thing',
    explanation: `"thin" ends with the tongue tip (-n); "thing" ends with the back of the tongue (-ng).`,
    items: ['thin, thing', 'win, wing', 'sin, sing', 'It is a thin thing.'],
    note: `For -ng, let the back of the tongue rise, not the tip.`,
    audio: 'a2-pn-002.ogg',
  },
  {
    id: 'a2-pn-003',
    focus: 'minimal-pair',
    title: 'right vs light',
    explanation: `English r curls the tongue back without touching; l touches the tip behind the teeth.`,
    items: ['right, light', 'road, load', 'rock, lock', 'Turn right at the light.'],
    note: `For r, do not let the tongue touch the roof; for l, it does.`,
    audio: 'a2-pn-003.ogg',
  },
  {
    id: 'a2-pn-004',
    focus: 'minimal-pair',
    title: 'boat vs bought',
    explanation: `"boat" glides (oh-w); "bought" is a single, open "aw" sound. Keep bought steady.`,
    items: ['boat, bought', 'coat, caught', 'so, saw', 'I bought a boat.'],
    note: `Boat moves and glides; bought stays open and still.`,
    audio: 'a2-pn-004.ogg',
  },
  {
    id: 'a2-pn-005',
    focus: 'minimal-pair',
    title: 'cap vs cup',
    explanation: `"cap" uses a front "a"; "cup" uses a relaxed, central "uh".`,
    items: ['cap, cup', 'ran, run', 'bag, bug', 'Put the cap on the cup.'],
    note: `Cup uses the same relaxed vowel as "but" and "up".`,
    audio: 'a2-pn-005.ogg',
  },
  {
    id: 'a2-pn-006',
    focus: 'connected-speech',
    title: 'got to and going to',
    explanation: `"got to" becomes "gotta" and "going to" becomes "gonna" in casual speech.`,
    items: ['I have got to go.', 'We have got to try.', 'I am going to wait.'],
    note: `These are for casual speaking only; keep writing standard.`,
    audio: 'a2-pn-006.ogg',
  },
  {
    id: 'a2-pn-007',
    focus: 'weak-forms',
    title: 'and shrinks to n',
    explanation: `In fast speech, "and" often shrinks to a quick "n" between two words.`,
    items: ['fish and chips', 'salt and pepper', 'rock and roll'],
    note: `Do not stress "and"; let it almost disappear.`,
    audio: 'a2-pn-007.ogg',
  },
  {
    id: 'a2-pn-008',
    focus: 'connected-speech',
    title: 'the disappearing h',
    explanation: `In "him, her, his", the h often drops when the word follows another in speech.`,
    items: ['Give him a hand.', 'Tell her the news.', 'I saw his car.'],
    note: `It sounds like "give-im" and "tell-er" in fast, natural speech.`,
    audio: 'a2-pn-008.ogg',
  },
];
