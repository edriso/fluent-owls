/**
 * C2 (mastery) grammar points: the subjunctive, fronting, ellipsis, nuanced
 * modals, and the subtle structures that mark a truly fluent speaker.
 */
import type { GrammarRule } from '../types';

export const c2Grammar: GrammarRule[] = [
  {
    id: 'c2-gr-001',
    rule: 'The subjunctive (formal)',
    explanation: `After suggest, insist, or "it is essential that", use the base verb for every subject.`,
    examples: [
      'I suggest he be on time.',
      'It is essential that she attend.',
      'They insisted that he leave.',
    ],
    note: `No -s here: "that she attend", not "that she attends".`,
    audio: 'c2-gr-001.ogg',
  },
  {
    id: 'c2-gr-002',
    rule: 'Fronting for effect',
    explanation: `Move a word or phrase to the front of the sentence to emphasize it.`,
    examples: [
      'Brilliant, the whole thing was.',
      'Down the hill they ran.',
      'Such was his fear that he froze.',
    ],
    note: `A strong, literary device. A little goes a long way in speech.`,
    audio: 'c2-gr-002.ogg',
  },
  {
    id: 'c2-gr-003',
    rule: 'Ellipsis (leaving words out)',
    explanation: `Leave out words the listener can fill in, so you do not repeat yourself.`,
    examples: [
      'I can not come, but I wish I could.',
      'She is ready and so am I.',
      'Some left early; others, later.',
    ],
    note: `It sounds natural and concise. Only drop what is clearly understood.`,
    audio: 'c2-gr-003.ogg',
  },
  {
    id: 'c2-gr-004',
    rule: 'Nuanced past modals',
    explanation: `Use "might have" for past guesses and "could have" for missed possibilities or mild criticism.`,
    examples: [
      'She might have missed the train.',
      'You could have told me.',
      'They must have left already.',
    ],
    note: `"You could have told me" gently signals you are a little annoyed.`,
    audio: 'c2-gr-004.ogg',
  },
  {
    id: 'c2-gr-005',
    rule: 'Emphatic do',
    explanation: `Add do, does, or did before a verb to stress that it is true.`,
    examples: ['I do appreciate your help.', 'He does try hard.', 'She did warn us, to be fair.'],
    note: `Useful for insisting or contradicting: "I do like it!"`,
    audio: 'c2-gr-005.ogg',
  },
  {
    id: 'c2-gr-006',
    rule: 'Complex passives',
    explanation: `Stack the passive with a perfect infinitive for a formal, careful claim.`,
    examples: [
      'The plan is thought to have failed.',
      'He is known to have lied before.',
      'The painting is believed to have been stolen.',
    ],
    note: `Common when a claim is reported but not certain.`,
    audio: 'c2-gr-006.ogg',
  },
  {
    id: 'c2-gr-007',
    rule: 'Discourse markers',
    explanation: `Short signposts like "mind you" and "having said that" guide a listener through your point.`,
    examples: [
      'It is expensive. Mind you, it lasts for years.',
      'Having said that, I still agree.',
      'That said, there are risks.',
    ],
    note: `They make speech flow and sound thoughtful, not scripted.`,
    audio: 'c2-gr-007.ogg',
  },
  {
    id: 'c2-gr-008',
    rule: 'Hedging language',
    explanation: `Soften a claim with phrases like "it would seem" or "there may be a case for".`,
    examples: [
      'It would seem that we were wrong.',
      'There may be a case for waiting.',
      'This is arguably the better option.',
    ],
    note: `Hedging sounds measured and diplomatic, not weak.`,
    audio: 'c2-gr-008.ogg',
  },
];
