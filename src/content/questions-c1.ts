/**
 * C1 (advanced) English quiz questions.
 *
 * At C1 the goal is range and nuance: less common idioms, precise vocabulary,
 * advanced collocations, multi-meaning phrasal verbs, advanced grammar
 * (inversion, mixed conditionals), and confusing pairs that trip up even
 * fluent speakers (discrete/discreet, refrain/restrain, prohibit/inhibit).
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
    options: ['noise', 'crowd', 'music', 'sound'],
    correctIndex: 2,
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
    options: ['repelling', 'expelling', 'compelling', 'dispelling'],
    correctIndex: 2,
    explanation:
      "'Compelling' means powerfully convincing. The other words share the root but differ.",
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
    options: ['fence', 'queue', 'rope', 'gun'],
    correctIndex: 3,
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
      "'Misleading' means giving a false impression. The other options all mean complete.",
    topic: 'vocabulary',
  },
  {
    id: 'c1-010',
    prompt: 'Passengers are kindly asked to ____ from smoking inside the station.',
    options: ['restrain', 'refrain', 'retain', 'refresh'],
    correctIndex: 1,
    explanation:
      "'Refrain from' means to hold yourself back. 'Restrain' means to hold back by force.",
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
  {
    id: 'c1-013',
    prompt: 'He passed the final exam by the skin of his ____.',
    options: ['teeth', 'nose', 'hair', 'neck'],
    correctIndex: 0,
    explanation: "'By the skin of your teeth' means only just, by the narrowest margin.",
    topic: 'idioms',
  },
  {
    id: 'c1-014',
    prompt: 'The storm ____ severe damage on the coastal towns.',
    options: ['made', 'did', 'inflicted', 'gave'],
    correctIndex: 2,
    explanation: "'Inflict damage on' something is the natural collocation for causing harm.",
    topic: 'collocations',
  },
  {
    id: 'c1-015',
    prompt: 'His ____ remarks offended half the people in the room.',
    options: ['tactful', 'tactless', 'polite', 'gentle'],
    correctIndex: 1,
    explanation:
      "'Tactless' means saying things without care for others' feelings. 'Tactful' is the opposite.",
    topic: 'vocabulary',
  },
  {
    id: 'c1-016',
    prompt: 'She showed great ____ in handling the delicate situation.',
    options: ['discreet', 'discrete', 'discretion', 'discreetly'],
    correctIndex: 2,
    explanation:
      "'Discretion' (noun) is the quality of being careful and tactful. 'Discreet' is the adjective.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c1-017',
    prompt: 'The negotiations ____ because neither side would compromise.',
    options: ['broke down', 'broke up', 'broke into', 'broke out'],
    correctIndex: 0,
    explanation: "'Break down' here means to fail or collapse (talks, machines, systems).",
    topic: 'phrasal-verbs',
  },
  {
    id: 'c1-018',
    prompt: 'After the scandal he kept a ____ profile for months.',
    options: ['small', 'low', 'short', 'light'],
    correctIndex: 1,
    explanation: "'Keep a low profile' means to avoid attention.",
    topic: 'idioms',
  },
  {
    id: 'c1-019',
    prompt: 'The new study ____ light on a long-forgotten history.',
    options: ['threw', 'put', 'shed', 'gave'],
    correctIndex: 2,
    explanation: "'Shed light on' something means to make it clearer or easier to understand.",
    topic: 'collocations',
  },
  {
    id: 'c1-020',
    prompt: 'Rarely ____ such dedication in a young student.',
    options: ['I have seen', 'have I seen', 'I saw', 'did I saw'],
    correctIndex: 1,
    explanation: "After a negative adverb like 'rarely' at the start, we invert: have I seen.",
    topic: 'grammar',
  },
  {
    id: 'c1-021',
    prompt: 'The instructions were admirably ____ and easy to follow.',
    options: ['ambiguous', 'concise', 'vague', 'obscure'],
    correctIndex: 1,
    explanation: "'Concise' means clear and brief. The other three all mean unclear.",
    topic: 'vocabulary',
  },
  {
    id: 'c1-022',
    prompt: 'The company runs its two brands as completely ____ businesses.',
    options: ['discreet', 'discrete', 'discreetly', 'discretion'],
    correctIndex: 1,
    explanation: "'Discrete' means separate and distinct. Its look-alike 'discreet' means tactful.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c1-023',
    prompt: "I can't quite ____ my finger on what is bothering me.",
    options: ['lay', 'set', 'put', 'press'],
    correctIndex: 2,
    explanation: "'Put your finger on' something means to identify exactly what it is.",
    topic: 'idioms',
  },
  {
    id: 'c1-024',
    prompt: 'Winning the award was a ____ blessing; now everyone expects more.',
    options: ['double', 'half', 'mixed', 'full'],
    correctIndex: 2,
    explanation: "A 'mixed blessing' is something with both good and bad sides.",
    topic: 'idioms',
  },
  {
    id: 'c1-025',
    prompt: 'Her sudden change of plan ____ suspicion among her colleagues.',
    options: ['rose', 'raised', 'lifted', 'arose'],
    correctIndex: 1,
    explanation: "'Raise suspicion' is the collocation. 'Raise' takes an object; 'rise' does not.",
    topic: 'collocations',
  },
  {
    id: 'c1-026',
    prompt: 'He offered only a ____ apology that satisfied no one.',
    options: ['sincere', 'half-hearted', 'genuine', 'heartfelt'],
    correctIndex: 1,
    explanation:
      "'Half-hearted' means done without real effort or conviction. The others mean sincere.",
    topic: 'vocabulary',
  },
  {
    id: 'c1-027',
    prompt: 'Had I known about the traffic, I ____ a different route.',
    options: ['will take', 'would take', 'would have taken', 'had taken'],
    correctIndex: 2,
    explanation:
      "Inverted third conditional: 'Had I known' replaces 'if', then 'would have' + participle.",
    topic: 'grammar',
  },
  {
    id: 'c1-028',
    prompt: 'Smoking is strictly ____ inside the building.',
    options: ['inhibited', 'prohibited', 'exhibited', 'inhabited'],
    correctIndex: 1,
    explanation: "'Prohibited' means forbidden. 'Inhibit' means to slow or restrain a process.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c1-029',
    prompt: "Let's not ____ over the problem and just hope it goes away.",
    options: ['glance', 'glide', 'gloss', 'glow'],
    correctIndex: 2,
    explanation: "'Gloss over' means to deal with something quickly to hide its difficulties.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'c1-030',
    prompt: 'The tricky question caught the candidate completely off ____.',
    options: ['side', 'hand', 'guard', 'beat'],
    correctIndex: 2,
    explanation: "'Catch someone off guard' means to surprise them when they are not prepared.",
    topic: 'idioms',
  },
];
