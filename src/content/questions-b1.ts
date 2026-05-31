/**
 * B1 (intermediate) English quiz questions.
 *
 * This is where many learners plateau, so the focus shifts to the things that
 * make English sound natural: collocations (make a decision, do homework),
 * common phrasal verbs, confusing word pairs, and dependent prepositions.
 *
 * Answer indices are 0-based. Keep explanations under 200 characters so they
 * fit Telegram's quiz explanation limit.
 */
import type { QuizQuestion } from '../types';

export const b1Questions: QuizQuestion[] = [
  {
    id: 'b1-001',
    prompt: 'We need to ____ a decision by Friday.',
    options: ['do', 'make', 'take', 'have'],
    correctIndex: 1,
    explanation: "In English you 'make a decision', not 'do' one. A handy rule: create = make.",
    topic: 'collocations',
  },
  {
    id: 'b1-002',
    prompt: 'We had to ____ the meeting because the manager was ill.',
    options: ['put on', 'put off', 'put up', 'put down'],
    correctIndex: 1,
    explanation: "'Put off' means to postpone (move to a later time). 'Put on' means to wear.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b1-003',
    prompt: 'There are ____ chairs than we need for the guests.',
    options: ['less', 'fewer', 'least', 'little'],
    correctIndex: 1,
    explanation:
      "Use 'fewer' for countable nouns (chairs) and 'less' for uncountable nouns (water).",
    topic: 'confusing-pairs',
  },
  {
    id: 'b1-004',
    prompt: "She's really good ____ playing the piano.",
    options: ['in', 'on', 'at', 'with'],
    correctIndex: 2,
    explanation: "We're 'good at' an activity or skill: good at maths, good at cooking.",
    topic: 'prepositions',
  },
  {
    id: 'b1-005',
    prompt: 'The medicine had no ____ on his headache at all.',
    options: ['affect', 'effort', 'effect', 'afford'],
    correctIndex: 2,
    explanation: "'Effect' is the noun (the result). 'Affect' is the verb (to influence).",
    topic: 'vocabulary',
  },
  {
    id: 'b1-006',
    prompt: 'I need to ____ my homework before dinner.',
    options: ['make', 'do', 'take', 'have'],
    correctIndex: 1,
    explanation:
      "You 'do homework' (and do the dishes, do exercise). 'Make' is for creating things.",
    topic: 'collocations',
  },
  {
    id: 'b1-007',
    prompt: "I'm trying to ____ smoking this year.",
    options: ['give in', 'give up', 'give out', 'give away'],
    correctIndex: 1,
    explanation: "'Give up' means to stop doing something. 'Give in' means to surrender.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b1-008',
    prompt: "They're bringing ____ dog to the park.",
    options: ['there', 'their', "they're", 'thier'],
    correctIndex: 1,
    explanation: "'Their' shows possession. 'There' is a place; 'they're' means 'they are'.",
    topic: 'confusing-pairs',
  },
  {
    id: 'b1-009',
    prompt: 'Whether we go out tomorrow depends ____ the weather.',
    options: ['of', 'on', 'from', 'to'],
    correctIndex: 1,
    explanation: "Something 'depends on' another thing, never 'depends of' or 'depends from'.",
    topic: 'prepositions',
  },
  {
    id: 'b1-010',
    prompt: 'Please ____ attention to the safety instructions.',
    options: ['give', 'make', 'pay', 'do'],
    correctIndex: 2,
    explanation: "The set phrase is 'pay attention'. It's an idiom, no money is involved!",
    topic: 'collocations',
  },
  {
    id: 'b1-011',
    prompt: 'We ____ petrol on the motorway and had to walk.',
    options: ['ran into', 'ran over', 'ran out of', 'ran up'],
    correctIndex: 2,
    explanation: "'Run out of' means to have none left. 'Run into' means to meet by chance.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'b1-012',
    prompt: 'Prices have ____ sharply over the last year.',
    options: ['raised', 'risen', 'arose', 'aroused'],
    correctIndex: 1,
    explanation:
      "'Rise' is intransitive (prices rise by themselves). 'Raise' needs an object (raise prices).",
    topic: 'vocabulary',
  },
];
