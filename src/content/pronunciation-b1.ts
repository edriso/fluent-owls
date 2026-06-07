/**
 * B1 (intermediate) pronunciation drills: the th sounds, v/w, the r-colored
 * vowels, and the weak forms and blends that separate textbook English from the
 * real thing.
 */
import type { PronunciationDrill } from '../types';

export const b1Pronunciation: PronunciationDrill[] = [
  {
    id: 'b1-pn-001',
    focus: 'minimal-pair',
    title: 'think vs sink',
    explanation: `"th" puts the tongue tip between the teeth; "s" keeps it behind them.`,
    items: ['think, sink', 'thick, sick', 'thing, sing', 'I think the sink is full.'],
    note: `Let the tongue tip lightly touch the teeth for "th".`,
    audio: 'b1-pn-001.ogg',
  },
  {
    id: 'b1-pn-002',
    focus: 'minimal-pair',
    title: 'three vs tree',
    explanation: `"th" is soft with the tongue out; "t" is a hard tap behind the teeth.`,
    items: ['three, tree', 'thread, tread', 'thrill, trill', 'There are three trees.'],
    note: `Do not turn "th" into a hard "t".`,
    audio: 'b1-pn-002.ogg',
  },
  {
    id: 'b1-pn-003',
    focus: 'minimal-pair',
    title: 'vest vs west',
    explanation: `"v" rests the top teeth on the bottom lip; "w" rounds the lips with no teeth.`,
    items: ['vest, west', 'vine, wine', 'veil, wail', 'The west wind is cold.'],
    note: `For v, the top teeth touch the bottom lip and buzz.`,
    audio: 'b1-pn-003.ogg',
  },
  {
    id: 'b1-pn-004',
    focus: 'minimal-pair',
    title: 'walk vs work',
    explanation: `"walk" is an open "aw"; "work" uses the r-colored "er" sound.`,
    items: ['walk, work', 'ward, word', 'born, burn', 'I walk to work.'],
    note: `Work, word, and burn all share the "er" sound.`,
    audio: 'b1-pn-004.ogg',
  },
  {
    id: 'b1-pn-005',
    focus: 'minimal-pair',
    title: 'pull vs pool',
    explanation: `"pull" is short and relaxed; "pool" is long with rounded lips.`,
    items: ['pull, pool', 'full, fool', 'should, shooed', 'Pull the chair to the pool.'],
    note: `Round and hold the lips longer for the long oo.`,
    audio: 'b1-pn-005.ogg',
  },
  {
    id: 'b1-pn-006',
    focus: 'connected-speech',
    title: 'did you becomes didja',
    explanation: `"did you" often blends into "didja" because the d and y merge.`,
    items: ['Did you see it?', 'Did you eat?', 'What did you do?'],
    note: `The "d" and "y" join into a soft "j" sound.`,
    audio: 'b1-pn-006.ogg',
  },
  {
    id: 'b1-pn-007',
    focus: 'weak-forms',
    title: 'weak to and of',
    explanation: `Small words like "to" and "of" reduce to "tuh" and "uv" when unstressed.`,
    items: ['I need to go.', 'A cup of tea.', 'Nice to meet you.'],
    note: `Never stress these words; keep them short and quiet.`,
    audio: 'b1-pn-007.ogg',
  },
  {
    id: 'b1-pn-008',
    focus: 'connected-speech',
    title: 'linking consonant to vowel',
    explanation: `A word that ends in a consonant links onto the next word's vowel.`,
    items: ['Pick it up.', 'Turn it off.', 'Hold on a second.'],
    note: `It sounds like "pi-ki-tup" and "tur-ni-toff".`,
    audio: 'b1-pn-008.ogg',
  },
];
