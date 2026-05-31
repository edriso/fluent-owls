/**
 * B2 (upper-intermediate) English quiz questions.
 *
 * Now we add colour and precision: common idioms, stronger collocations,
 * trickier phrasal verbs, the conditionals and "wish", the passive, and the
 * confusing pairs that even confident speakers slip on (affect/effect,
 * disinterested/uninterested).
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
    options: ['drop', 'fall', 'lower down', 'cut'],
    correctIndex: 3,
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
  {
    id: 'b2-013',
    prompt: 'He let the ____ out of the bag and ruined the surprise.',
    options: ['dog', 'cat', 'bird', 'fish'],
    correctIndex: 1,
    explanation: "'Let the cat out of the bag' means to reveal a secret, often by accident.",
    topic: 'idioms',
  },
  {
    id: 'b2-014',
    prompt: 'She ____ a fortune running her own business.',
    options: ['did', 'won', 'made', 'gained'],
    correctIndex: 2,
    explanation:
      "You 'make a fortune' (earn a lot of money). 'Make money' follows the same pattern.",
    topic: 'collocations',
  },
  {
    id: 'b2-015',
    prompt: "Don't let one bad result ____ you off your goal.",
    options: ['put', 'take', 'turn', 'set'],
    correctIndex: 0,
    explanation: "'Put someone off' means to discourage them. The object goes inside: put you off.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b2-016',
    prompt: "It's high time we ____ home.",
    options: ['go', 'went', 'going', 'have gone'],
    correctIndex: 1,
    explanation:
      "'It's high time' is followed by the past simple to mean 'we should already be going'.",
    topic: 'grammar',
  },
  {
    id: 'b2-017',
    prompt: 'Please ____ from using your phone during the film.',
    options: ['restrain', 'refrain', 'retain', 'remain'],
    correctIndex: 1,
    explanation:
      "'Refrain from' means to hold yourself back. 'Restrain' means to hold back by force.",
    topic: 'confusing-pairs',
  },
  {
    id: 'b2-018',
    prompt: "I can't decide now, so let me ____ on it.",
    options: ['sleep', 'sit', 'lie', 'stand'],
    correctIndex: 0,
    explanation: "'Sleep on it' means to take time (usually overnight) before deciding.",
    topic: 'idioms',
  },
  {
    id: 'b2-019',
    prompt: 'The manager turned a ____ eye to the small errors.',
    options: ['blind', 'deaf', 'dead', 'closed'],
    correctIndex: 0,
    explanation: "'Turn a blind eye' means to deliberately ignore something you know is wrong.",
    topic: 'idioms',
  },
  {
    id: 'b2-020',
    prompt: 'The factory ____ thousands of cars every month.',
    options: ['turns up', 'turns in', 'turns out', 'turns over'],
    correctIndex: 2,
    explanation: "'Turn out' can mean to produce. It also means 'to happen in the end'.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b2-021',
    prompt: 'Not only ____ late, but he also forgot the tickets.',
    options: ['he was', 'was he', 'he is', 'was him'],
    correctIndex: 1,
    explanation:
      "After 'Not only' at the start of a sentence we invert: was he. This adds emphasis.",
    topic: 'grammar',
  },
  {
    id: 'b2-022',
    prompt: 'The instructions were so ____ that nobody could follow them.',
    options: ['clear', 'confusing', 'simple', 'obvious'],
    correctIndex: 1,
    explanation:
      "'Confusing' means hard to understand, the opposite of clear, simple, and obvious.",
    topic: 'vocabulary',
  },
  {
    id: 'b2-023',
    prompt: 'The medicine had a positive ____ on her recovery.',
    options: ['affect', 'effect', 'effort', 'affection'],
    correctIndex: 1,
    explanation: "Here we need the noun 'effect' (the result): a positive effect on her recovery.",
    topic: 'confusing-pairs',
  },
  {
    id: 'b2-024',
    prompt: "We'll cross that ____ when we come to it.",
    options: ['road', 'bridge', 'river', 'line'],
    correctIndex: 1,
    explanation:
      "'Cross that bridge when we come to it' means to deal with a problem only when it arrives.",
    topic: 'idioms',
  },
  {
    id: 'b2-025',
    prompt: 'His surprise announcement ____ a lot of interest.',
    options: ['made', 'did', 'took', 'generated'],
    correctIndex: 3,
    explanation: "'Generate interest' is a natural collocation meaning to create or arouse it.",
    topic: 'collocations',
  },
  {
    id: 'b2-026',
    prompt: 'He has decided to ____ painting in his spare time.',
    options: ['take up', 'take in', 'take off', 'take over'],
    correctIndex: 0,
    explanation: "'Take up' means to start a new hobby. 'Take over' means to gain control.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b2-027',
    prompt: 'The report needs ____ before the Monday deadline.',
    options: ['finishing', 'to finishing', 'finish', 'to finished'],
    correctIndex: 0,
    explanation: "'Need' + -ing has a passive meaning: 'needs finishing' = needs to be finished.",
    topic: 'grammar',
  },
  {
    id: 'b2-028',
    prompt: 'She is used to ____ up early after years of farm work.',
    options: ['get', 'getting', 'got', 'gets'],
    correctIndex: 1,
    explanation: "'Be used to' (meaning accustomed to) is followed by a noun or the -ing form.",
    topic: 'grammar',
  },
  {
    id: 'b2-029',
    prompt: 'Learning the new system was a piece of ____ for her.',
    options: ['cake', 'pie', 'bread', 'luck'],
    correctIndex: 0,
    explanation: "'A piece of cake' is an idiom meaning something very easy to do.",
    topic: 'idioms',
  },
  {
    id: 'b2-030',
    prompt: 'They finally ____ an agreement after hours of talks.',
    options: ['reached', 'made', 'got', 'took'],
    correctIndex: 0,
    explanation: "You 'reach an agreement' (also 'come to an agreement') after negotiating.",
    topic: 'collocations',
  },
];
