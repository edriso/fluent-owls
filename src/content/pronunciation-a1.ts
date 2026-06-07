/**
 * A1 (beginner) pronunciation drills: the most common vowel and consonant
 * contrasts that change meaning, plus the first, simplest reductions. Short word
 * pairs and one example sentence, read aloud so the learner hears the difference.
 */
import type { PronunciationDrill } from '../types';

export const a1Pronunciation: PronunciationDrill[] = [
  {
    id: 'a1-pn-001',
    focus: 'minimal-pair',
    title: 'ship vs sheep',
    explanation: `The "i" in ship is short and quick; the "ee" in sheep is long. Stretch the long one.`,
    items: ['ship, sheep', 'it, eat', 'this, these', 'I see a sheep on the ship.'],
    note: `Short i is relaxed; long ee is longer and tense, with a small smile.`,
    audio: 'a1-pn-001.ogg',
  },
  {
    id: 'a1-pn-002',
    focus: 'minimal-pair',
    title: 'bad vs bed',
    explanation: `"bad" uses a wide, open "a"; "bed" uses a shorter "e". Open your mouth more for bad.`,
    items: ['bad, bed', 'sat, set', 'man, men', 'The man sat on the bed.'],
    note: `Drop your jaw lower for the "a" in bad.`,
    audio: 'a1-pn-002.ogg',
  },
  {
    id: 'a1-pn-003',
    focus: 'minimal-pair',
    title: 'cat vs cut',
    explanation: `"cat" uses a front "a"; "cut" uses a relaxed, central "uh". Keep cut short.`,
    items: ['cat, cut', 'bat, but', 'hat, hut', 'The cat ran to the hut.'],
    note: `The "u" in cut is the relaxed, central sound.`,
    audio: 'a1-pn-003.ogg',
  },
  {
    id: 'a1-pn-004',
    focus: 'minimal-pair',
    title: 'pen vs pan',
    explanation: `"pen" uses "e"; "pan" uses a wider "a". Smile a little for pen, open more for pan.`,
    items: ['pen, pan', 'men, man', 'ten, tan', 'Put the pen in the pan.'],
    note: `Open your mouth wider for pan than for pen.`,
    audio: 'a1-pn-004.ogg',
  },
  {
    id: 'a1-pn-005',
    focus: 'minimal-pair',
    title: 'full vs fool',
    explanation: `"full" is short; "fool" is long. Round your lips more for the long oo in fool.`,
    items: ['full, fool', 'pull, pool', 'look, Luke', 'Do not be a fool by the pool.'],
    note: `Long oo is longer and more rounded than short oo.`,
    audio: 'a1-pn-005.ogg',
  },
  {
    id: 'a1-pn-006',
    focus: 'connected-speech',
    title: 'going to becomes gonna',
    explanation: `In fast, casual speech, "going to" often sounds like "gonna".`,
    items: ['I am going to call you.', 'We are going to be late.', 'It is going to rain.'],
    note: `Say "gonna" only in casual speech, never in writing.`,
    audio: 'a1-pn-006.ogg',
  },
  {
    id: 'a1-pn-007',
    focus: 'connected-speech',
    title: 'want to becomes wanna',
    explanation: `"want to" often sounds like "wanna" in relaxed, everyday speech.`,
    items: ['I want to go home.', 'Do you want to eat?', 'They want to help.'],
    note: `Say "wanna" casually, but always write "want to".`,
    audio: 'a1-pn-007.ogg',
  },
  {
    id: 'a1-pn-008',
    focus: 'connected-speech',
    title: 'linking two vowels',
    explanation: `When one word ends in a vowel and the next begins with one, glide them together.`,
    items: ['I am happy.', 'She is here.', 'Go away.'],
    note: `Move smoothly from one word to the next, with no hard stop.`,
    audio: 'a1-pn-008.ogg',
  },
];
