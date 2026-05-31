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
  {
    id: 'c2-013',
    prompt: 'The defence lawyer could not refute the ____ evidence against her client.',
    options: ['damning', 'damping', 'dawning', 'dimming'],
    correctIndex: 0,
    explanation:
      "'Damning' evidence strongly proves guilt or fault. The look-alikes are unrelated.",
    topic: 'vocabulary',
  },
  {
    id: 'c2-014',
    prompt: 'After months of struggle, we can finally see ____ at the end of the tunnel.',
    options: ['light', 'hope', 'sun', 'fire'],
    correctIndex: 0,
    explanation: "'Light at the end of the tunnel' is the sign that a hard time is nearly over.",
    topic: 'idioms',
  },
  {
    id: 'c2-015',
    prompt: 'Her ____ wit made even the dullest meeting a pleasure.',
    options: ['acerbic', 'dull', 'blunt', 'vague'],
    correctIndex: 0,
    explanation:
      "'Acerbic' wit is sharp and clever (sometimes cutting). The others are the opposite.",
    topic: 'vocabulary',
  },
  {
    id: 'c2-016',
    prompt: 'His years of patient research finally ____ dividends.',
    options: ['paid', 'gave', 'made', 'did'],
    correctIndex: 0,
    explanation:
      "'Pay dividends' is an idiom meaning to bring benefits later, thanks to earlier effort.",
    topic: 'collocations',
  },
  {
    id: 'c2-017',
    prompt: 'The two sides eventually reached an ____ agreement and shook hands.',
    options: ['amicable', 'amenable', 'ample', 'amorous'],
    correctIndex: 0,
    explanation:
      "An 'amicable' agreement is a friendly, good-natured one. The others mean different things.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c2-018',
    prompt: "The lawyer's clever reply took the wind out of her opponent's ____.",
    options: ['sails', 'wings', 'feathers', 'wheels'],
    correctIndex: 0,
    explanation:
      "'Take the wind out of someone's sails' means to weaken their confidence or advantage.",
    topic: 'idioms',
  },
  {
    id: 'c2-019',
    prompt: "The ancient diary's faded handwriting was almost ____.",
    options: ['legible', 'illegible', 'eligible', 'ineligible'],
    correctIndex: 1,
    explanation: "'Illegible' means impossible to read. 'Eligible' means qualified or allowed.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c2-020',
    prompt: 'Seldom ____ such a gifted group of young musicians in one place.',
    options: ['we see', 'do we see', 'we saw', 'did we saw'],
    correctIndex: 1,
    explanation: "After 'seldom' at the start, we invert with the auxiliary: do we see.",
    topic: 'grammar',
  },
  {
    id: 'c2-021',
    prompt: "The audit ____ bare the company's deep financial problems.",
    options: ['laid', 'made', 'did', 'set'],
    correctIndex: 0,
    explanation:
      "'Lay bare' means to reveal or expose something hidden. The past of 'lay' is 'laid'.",
    topic: 'collocations',
  },
  {
    id: 'c2-022',
    prompt: 'She was ____ to the committee as its youngest ever chairperson.',
    options: ['appointed', 'anointed', 'pointed', 'annotated'],
    correctIndex: 0,
    explanation:
      "'Appoint' means to officially give someone a job or role. The others are unrelated.",
    topic: 'vocabulary',
  },
  {
    id: 'c2-023',
    prompt: 'He has a finger in every ____, involved in half the businesses in town.',
    options: ['pie', 'cake', 'plate', 'dish'],
    correctIndex: 0,
    explanation: "'A finger in every pie' means being involved in many activities at once.",
    topic: 'idioms',
  },
  {
    id: 'c2-024',
    prompt: 'His ____ kindness amazed those who only knew his stern reputation.',
    options: ['uncharacteristic', 'characteristic', 'typical', 'habitual'],
    correctIndex: 0,
    explanation:
      "'Uncharacteristic' means not typical of someone. The other three mean the opposite.",
    topic: 'vocabulary',
  },
  {
    id: 'c2-025',
    prompt: "Don't count your ____ before they hatch.",
    options: ['chickens', 'eggs', 'birds', 'profits'],
    correctIndex: 0,
    explanation: 'This idiom warns against assuming success before it actually happens.',
    topic: 'idioms',
  },
  {
    id: 'c2-026',
    prompt: 'Years of careful pruning finally made the old orchard ____ fruit again.',
    options: ['bear', 'carry', 'hold', 'make'],
    correctIndex: 0,
    explanation: "'Bear fruit' means to produce good results. It works literally and figuratively.",
    topic: 'collocations',
  },
  {
    id: 'c2-027',
    prompt: 'His speech was a tired ____ of clichés and empty promises.',
    options: ['litany', 'melody', 'harmony', 'symphony'],
    correctIndex: 0,
    explanation:
      "A 'litany of' something is a long, tedious list of it (complaints, clichés, excuses).",
    topic: 'vocabulary',
  },
  {
    id: 'c2-028',
    prompt: 'The two explanations are not mutually ____; both could be true.',
    options: ['exclusive', 'inclusive', 'conclusive', 'reclusive'],
    correctIndex: 0,
    explanation: "'Mutually exclusive' means two things cannot both be true at once.",
    topic: 'confusing-pairs',
  },
  {
    id: 'c2-029',
    prompt: 'With the project finished, the whole team was at a ____ end.',
    options: ['loose', 'dead', 'far', 'tight'],
    correctIndex: 0,
    explanation: "'At a loose end' means having nothing in particular to do.",
    topic: 'idioms',
  },
  {
    id: 'c2-030',
    prompt: 'Were it not ____ your support, the project would have collapsed.',
    options: ['for', 'of', 'to', 'with'],
    correctIndex: 0,
    explanation: "'Were it not for' is a formal way to say 'if it had not been for'.",
    topic: 'grammar',
  },
];
