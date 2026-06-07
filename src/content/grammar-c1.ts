/**
 * C1 (advanced) grammar points: the unreal past, inversion, cleft and participle
 * clauses, and the structures that add precision and style.
 */
import type { GrammarRule } from '../types';

export const c1Grammar: GrammarRule[] = [
  {
    id: 'c1-gr-001',
    rule: 'Third conditional (unreal past)',
    explanation: `If + past perfect, then would have + past participle. For a past that did not happen.`,
    examples: [
      'If I had known, I would have helped.',
      'She would have passed if she had studied.',
      'If we had left earlier, we would have caught it.',
    ],
    note: `Both parts are about the past and are now impossible to change.`,
    audio: 'c1-gr-001.ogg',
  },
  {
    id: 'c1-gr-002',
    rule: 'Mixed conditionals',
    explanation: `Mix a past condition with a present result, or the reverse.`,
    examples: [
      'If I had studied medicine, I would be a doctor now.',
      'If she were more careful, she would not have lost it.',
      'If I had saved money, I would not be worried today.',
    ],
    note: `One half points to the past, the other to the present.`,
    audio: 'c1-gr-002.ogg',
  },
  {
    id: 'c1-gr-003',
    rule: 'Inversion for emphasis',
    explanation: `Start with a negative adverb, then invert the subject and verb, as in a question.`,
    examples: [
      'Never have I seen such a mess.',
      'Rarely does he complain.',
      'Not only did she win, but she also set a record.',
    ],
    note: `This sounds formal and dramatic. Use it sparingly for effect.`,
    audio: 'c1-gr-003.ogg',
  },
  {
    id: 'c1-gr-004',
    rule: 'Cleft sentences for focus',
    explanation: `Reorder a sentence with "What..." or "It was..." to stress one part.`,
    examples: [
      'What I need is a break.',
      'It was Sam who called.',
      'What surprised me was the price.',
    ],
    note: `It moves the spotlight onto the part you care about.`,
    audio: 'c1-gr-004.ogg',
  },
  {
    id: 'c1-gr-005',
    rule: 'Participle clauses',
    explanation: `Use an -ing clause to join two ideas that share the same subject, more smoothly.`,
    examples: [
      'Walking home, I saw an old friend.',
      'Feeling tired, she went to bed.',
      'Not knowing the way, we asked for help.',
    ],
    note: `The subject of both parts must be the same person.`,
    audio: 'c1-gr-005.ogg',
  },
  {
    id: 'c1-gr-006',
    rule: 'Reporting with the passive',
    explanation: `Use "is said/believed/thought to..." for a careful, impersonal report.`,
    examples: [
      'He is said to be very rich.',
      'It is believed that prices will rise.',
      'The company is thought to be struggling.',
    ],
    note: `Common in news and formal writing, where the source is general.`,
    audio: 'c1-gr-006.ogg',
  },
  {
    id: 'c1-gr-007',
    rule: 'would for past habits',
    explanation: `Use "would" plus the base verb for repeated actions in the past, like "used to".`,
    examples: [
      'We would spend summers at the lake.',
      'He would always arrive early.',
      'On Sundays, she would bake.',
    ],
    note: `Use it for repeated ACTIONS, not states. For states use "used to".`,
    audio: 'c1-gr-007.ogg',
  },
  {
    id: 'c1-gr-008',
    rule: 'Concession: although and despite',
    explanation: `"Although" is followed by a clause; "despite" is followed by a noun or -ing.`,
    examples: [
      'Although it was late, we kept going.',
      'Despite the rain, we walked.',
      'Despite being tired, she finished.',
    ],
    note: `Do not say "despite of". It is just "despite".`,
    audio: 'c1-gr-008.ogg',
  },
];
