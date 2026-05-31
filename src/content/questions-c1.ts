/**
 * C1 (advanced) English quiz questions.
 *
 * At C1 the goal is range and nuance: less common idioms, precise vocabulary,
 * advanced collocations, multi-meaning phrasal verbs, and confusing pairs that
 * trip up even fluent speakers (discrete/discreet, refrain/restrain).
 *
 * Answer indices are 0-based. Keep explanations under 200 characters so they
 * fit Telegram's quiz explanation limit.
 */
import type { QuizQuestion } from '../types';

export const c1Questions: QuizQuestion[] = [
  {
    id: 'c1-001',
    prompt: 'The merger is still up in the ____; nothing has been decided.',
    options: ['sky', 'air', 'cloud', 'wind'],
    correctIndex: 1,
    explanation: "'Up in the air' is an idiom meaning uncertain or undecided.",
    topic: 'idioms',
  },
  {
    id: 'c1-002',
    prompt: 'The new evidence ____ serious doubt on his version of events.',
    options: ['made', 'cast', 'put', 'gave'],
    correctIndex: 1,
    explanation: "The collocation is 'cast doubt on' something, to make people question it.",
    topic: 'collocations',
  },
  {
    id: 'c1-003',
    prompt: 'After the scandal, the minister had to face the ____.',
    options: ['noise', 'music', 'sound', 'crowd'],
    correctIndex: 1,
    explanation: "'Face the music' means to accept the unpleasant consequences of your actions.",
    topic: 'idioms',
  },
  {
    id: 'c1-004',
    prompt: 'The two issues are quite ____ and should be discussed separately.',
    options: ['discreet', 'discrete', 'discreetly', 'discretion'],
    correctIndex: 1,
    explanation:
      "'Discrete' means separate and distinct. 'Discreet' means careful not to attract attention.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c1-005',
    prompt: 'Her argument was so ____ that no one in the room could counter it.',
    options: ['compelling', 'repelling', 'expelling', 'dispelling'],
    correctIndex: 0,
    explanation:
      "'Compelling' means powerfully convincing. The other words share the root but differ in meaning.",
    topic: 'vocabulary',
  },
  {
    id: 'c1-006',
    prompt: "We'll have to ____ on spending until the end of the month.",
    options: ['cut off', 'cut back', 'cut up', 'cut in'],
    correctIndex: 1,
    explanation: "'Cut back (on)' means to reduce. 'Cut off' means to disconnect or isolate.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'c1-007',
    prompt: "Let's not jump the ____, we don't have the final results yet.",
    options: ['fence', 'gun', 'queue', 'rope'],
    correctIndex: 1,
    explanation: "'Jump the gun' means to act too soon, before the right moment.",
    topic: 'idioms',
  },
  {
    id: 'c1-008',
    prompt: 'His controversial remarks ____ a heated debate among the members.',
    options: ['lit', 'sparked', 'burned', 'fired'],
    correctIndex: 1,
    explanation:
      "'Spark a debate' means to suddenly cause one to start, a vivid, natural collocation.",
    topic: 'collocations',
  },
  {
    id: 'c1-009',
    prompt: 'The report was ____; it quietly left out the most important facts.',
    options: ['thorough', 'comprehensive', 'misleading', 'exhaustive'],
    correctIndex: 2,
    explanation:
      "'Misleading' means giving a false impression. The other options all mean complete or detailed.",
    topic: 'vocabulary',
  },
  {
    id: 'c1-010',
    prompt: 'Passengers are kindly asked to ____ from smoking inside the station.',
    options: ['restrain', 'refrain', 'retain', 'refresh'],
    correctIndex: 1,
    explanation:
      "'Refrain from' means to hold yourself back from doing something. 'Restrain' means to hold back by force.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c1-011',
    prompt: 'The project succeeded in the end, but it was touch and ____ for a while.',
    options: ['run', 'go', 'move', 'near'],
    correctIndex: 1,
    explanation: "'Touch and go' describes a situation where the outcome is uncertain and risky.",
    topic: 'idioms',
  },
  {
    id: 'c1-012',
    prompt: 'She gave a ____ account of the trip, leaving out not a single detail.',
    options: ['brief', 'vague', 'meticulous', 'cursory'],
    correctIndex: 2,
    explanation:
      "'Meticulous' means showing great attention to detail. 'Cursory' and 'brief' mean the opposite.",
    topic: 'vocabulary',
  },
];
