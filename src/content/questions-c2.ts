/**
 * C2 (mastery) English quiz questions.
 *
 * The finishing polish: sophisticated vocabulary, precise idioms, advanced
 * collocations, and the notorious confusing pairs (flout/flaunt, elicit/illicit,
 * principle/principal) that distinguish a near-native from a native speaker.
 *
 * Answer indices are 0-based. Keep explanations under 200 characters so they
 * fit Telegram's quiz explanation limit.
 */
import type { QuizQuestion } from '../types';

export const c2Questions: QuizQuestion[] = [
  {
    id: 'c2-001',
    prompt: "The CEO's sudden resignation really threw a ____ in the works.",
    options: ['wheel', 'spanner', 'stone', 'rope'],
    correctIndex: 1,
    explanation: "'Throw a spanner in the works' (US: wrench) means to disrupt a plan or process.",
    topic: 'idioms',
  },
  {
    id: 'c2-002',
    prompt: 'His ____ speech won over even the most sceptical members of the crowd.',
    options: ['garrulous', 'eloquent', 'verbose', 'taciturn'],
    correctIndex: 1,
    explanation:
      "'Eloquent' means fluent and persuasive. 'Garrulous' and 'verbose' mean wordy; 'taciturn' means silent.",
    topic: 'vocabulary',
  },
  {
    id: 'c2-003',
    prompt: "The teacher's vague question failed to ____ any response from the class.",
    options: ['illicit', 'elicit', 'solicit', 'explicit'],
    correctIndex: 1,
    explanation:
      "'Elicit' (verb) means to draw out a response. 'Illicit' is an adjective meaning illegal.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c2-004',
    prompt: "Once you've signed the contract, there's no going back, the die is ____.",
    options: ['thrown', 'cast', 'set', 'rolled'],
    correctIndex: 1,
    explanation: "'The die is cast' means a decision has been made that cannot be undone.",
    topic: 'idioms',
  },
  {
    id: 'c2-005',
    prompt: 'He openly ____ the rules whenever it suited him, daring anyone to object.',
    options: ['flaunted', 'flouted', 'flounted', 'floundered'],
    correctIndex: 1,
    explanation:
      "'Flout' means to openly disregard a rule. Don't confuse it with 'flaunt' (to show off).",
    topic: 'confusing-pairs',
  },
  {
    id: 'c2-006',
    prompt: 'The findings ____ serious questions about the safety of the drug.',
    options: ['rise', 'raise', 'arise', 'lift'],
    correctIndex: 1,
    explanation: "You 'raise questions' (transitive). Questions themselves 'arise' (intransitive).",
    topic: 'collocations',
  },
  {
    id: 'c2-007',
    prompt: 'She loves to ____ her wealth, arriving at every event in a new sports car.',
    options: ['flout', 'flaunt', 'flounder', 'flank'],
    correctIndex: 1,
    explanation:
      "'Flaunt' means to show off. Its tricky twin 'flout' means to openly break a rule.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c2-008',
    prompt: 'He took her glowing review with a pinch of ____, knowing she was his friend.',
    options: ['sugar', 'salt', 'pepper', 'spice'],
    correctIndex: 1,
    explanation: "'Take it with a pinch of salt' means not to accept something as completely true.",
    topic: 'idioms',
  },
  {
    id: 'c2-009',
    prompt: 'The lecture was so ____ that half the audience quietly dozed off.',
    options: ['riveting', 'soporific', 'gripping', 'engaging'],
    correctIndex: 1,
    explanation: "'Soporific' means tending to cause sleep. The other three all mean fascinating.",
    topic: 'vocabulary',
  },
  {
    id: 'c2-010',
    prompt: "The relentless drought ____ havoc on the region's harvest.",
    options: ['made', 'wreaked', 'did', 'caused'],
    correctIndex: 1,
    explanation: "The fixed collocation is 'wreak havoc', to cause great damage or chaos.",
    topic: 'collocations',
  },
  {
    id: 'c2-011',
    prompt: 'She resigned on ____, for her it was purely a matter of ethics.',
    options: ['principal', 'principle', 'principled', 'principals'],
    correctIndex: 1,
    explanation: "'Principle' (noun) is a moral rule. 'Principal' means main, or a head teacher.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c2-012',
    prompt: 'His sharp eye and ____ for detail made him a superb editor.',
    options: ['penchant', 'aversion', 'indifference', 'reluctance'],
    correctIndex: 0,
    explanation:
      "A 'penchant for' something is a strong liking. The other options all suggest dislike or avoidance.",
    topic: 'vocabulary',
  },
];
