/**
 * B2 (upper-intermediate) English quiz questions.
 *
 * Now we add colour and precision: common idioms, stronger collocations,
 * trickier phrasal verbs, the conditionals and "wish", the passive, and the
 * confusing pairs that even confident speakers slip on (affect/effect).
 *
 * Answer indices are 0-based. Keep explanations under 200 characters so they
 * fit Telegram's quiz explanation limit.
 */
import type { QuizQuestion } from '../types';

export const b2Questions: QuizQuestion[] = [
  {
    id: 'b2-001',
    prompt: "It's raining cats and ____ out there!",
    options: ['dogs', 'frogs', 'pigs', 'birds'],
    correctIndex: 0,
    explanation: "'Raining cats and dogs' is an idiom meaning raining very heavily.",
    topic: 'idioms',
  },
  {
    id: 'b2-002',
    prompt: 'Please ____ into account the needs of all the staff.',
    options: ['make', 'take', 'put', 'bring'],
    correctIndex: 1,
    explanation: "'Take into account' means to consider something when making a decision.",
    topic: 'collocations',
  },
  {
    id: 'b2-003',
    prompt: 'If I ____ more time, I would have finished the report.',
    options: ['had', 'had had', 'have had', 'would have'],
    correctIndex: 1,
    explanation:
      "Third conditional: 'if' + past perfect (had had), then 'would have' + participle.",
    topic: 'grammar',
  },
  {
    id: 'b2-004',
    prompt: 'The new policy will ____ how we work from home.',
    options: ['effect', 'affect', 'afflict', 'effort'],
    correctIndex: 1,
    explanation:
      "'Affect' (verb) = to influence. Tip: the policy AFFECTS us and has an EFFECT on us.",
    topic: 'confusing-pairs',
  },
  {
    id: 'b2-005',
    prompt: 'Stop beating around the ____ and tell me what happened.',
    options: ['tree', 'bush', 'corner', 'block'],
    correctIndex: 1,
    explanation: "'Beat around the bush' means to avoid getting to the main point.",
    topic: 'idioms',
  },
  {
    id: 'b2-006',
    prompt: 'She really ____ her late grandmother, same smile, same laugh.',
    options: ['takes off', 'takes after', 'takes up', 'takes in'],
    correctIndex: 1,
    explanation: "'Take after' means to resemble an older relative in looks or character.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b2-007',
    prompt: 'The company is trying to ____ costs by going paperless.',
    options: ['cut', 'drop', 'fall', 'lower down'],
    correctIndex: 0,
    explanation: "'Cut costs' is the natural business collocation for reducing spending.",
    topic: 'collocations',
  },
  {
    id: 'b2-008',
    prompt: 'I wish I ____ harder for the exam last week.',
    options: ['studied', 'had studied', 'would study', 'have studied'],
    correctIndex: 1,
    explanation: "To regret a past action, use 'wish' + past perfect: I wish I had studied.",
    topic: 'grammar',
  },
  {
    id: 'b2-009',
    prompt: 'The new phone costs an arm and a ____.',
    options: ['hand', 'leg', 'foot', 'head'],
    correctIndex: 1,
    explanation: "'Cost an arm and a leg' is an idiom meaning to be very expensive.",
    topic: 'idioms',
  },
  {
    id: 'b2-010',
    prompt: 'A good judge should remain ____ and weigh both sides fairly.',
    options: ['uninterested', 'disinterested', 'careless', 'carefree'],
    correctIndex: 1,
    explanation: "'Disinterested' means impartial (no personal stake). 'Uninterested' means bored.",
    topic: 'confusing-pairs',
  },
  {
    id: 'b2-011',
    prompt: "I can't ____ why she's so upset about the change.",
    options: ['work on', 'work out', 'work up', 'work off'],
    correctIndex: 1,
    explanation: "'Work out' means to understand or solve something by thinking.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b2-012',
    prompt: 'The bridge ____ in 1890 and is still in use today.',
    options: ['built', 'was built', 'was build', 'is built'],
    correctIndex: 1,
    explanation:
      'Past passive: was/were + past participle. The bridge received the action: was built.',
    topic: 'grammar',
  },
];
