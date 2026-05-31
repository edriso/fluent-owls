/**
 * A2 (elementary) English quiz questions.
 *
 * One step up from A1: the past simple, comparatives, countable/uncountable
 * nouns, "going to", more everyday vocabulary, and the first common phrasal
 * verbs (turn off, get up, look after).
 *
 * Answer indices are 0-based. Keep explanations under 200 characters so they
 * fit Telegram's quiz explanation limit.
 */
import type { QuizQuestion } from '../types';

export const a2Questions: QuizQuestion[] = [
  {
    id: 'a2-001',
    prompt: 'Please ____ the lights when you leave the room.',
    options: ['turn off', 'turn up', 'turn into', 'turn over'],
    correctIndex: 0,
    explanation:
      "'Turn off' means to stop a machine or light. 'Turn up' means to increase the volume.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'a2-002',
    prompt: 'Yesterday I ____ to the cinema with my friends.',
    options: ['go', 'went', 'gone', 'going'],
    correctIndex: 1,
    explanation:
      "'Yesterday' signals the past simple. The past of 'go' is the irregular form 'went'.",
    topic: 'grammar',
  },
  {
    id: 'a2-003',
    prompt: 'The film was really ____. I almost fell asleep.',
    options: ['exciting', 'boring', 'funny', 'loud'],
    correctIndex: 1,
    explanation: "If something makes you want to sleep, it's boring. 'Exciting' is the opposite.",
    topic: 'vocabulary',
  },
  {
    id: 'a2-004',
    prompt: 'What time do you usually ____ in the morning?',
    options: ['get up', 'get over', 'get off', 'get on'],
    correctIndex: 0,
    explanation:
      "'Get up' means to leave your bed. 'Get on' means to board a bus, train, or plane.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'a2-005',
    prompt: 'She is taller ____ her brother.',
    options: ['then', 'that', 'than', 'as'],
    correctIndex: 2,
    explanation: "We use 'than' to compare two things: taller than. ('Then' is about time.)",
    topic: 'grammar',
  },
  {
    id: 'a2-006',
    prompt: 'She is ____ home today because she feels ill.',
    options: ['in', 'at', 'on', 'to'],
    correctIndex: 1,
    explanation: "'At home' is a fixed phrase. We don't say 'in home' or 'on home'.",
    topic: 'prepositions',
  },
  {
    id: 'a2-007',
    prompt: 'Could you ____ me the salt, please?',
    options: ['take', 'pass', 'carry', 'bring'],
    correctIndex: 1,
    explanation: "At the table we ask someone to 'pass' something to us: pass the salt.",
    topic: 'vocabulary',
  },
  {
    id: 'a2-008',
    prompt: 'There are too ____ people in this small room.',
    options: ['much', 'many', 'lot', 'more'],
    correctIndex: 1,
    explanation:
      "Use 'many' with countable nouns (people) and 'much' with uncountable nouns (water).",
    topic: 'grammar',
  },
  {
    id: 'a2-009',
    prompt: 'Can you ____ the baby while I cook dinner?',
    options: ['look for', 'look after', 'look up', 'look out'],
    correctIndex: 1,
    explanation: "'Look after' means to take care of someone. 'Look for' means to search.",
    topic: 'phrasal-verbs',
  },
  {
    id: 'a2-010',
    prompt: 'We have a meeting ____ Monday morning.',
    options: ['in', 'on', 'at', 'of'],
    correctIndex: 1,
    explanation: "We use 'on' with days and dates: on Monday, on 5 May.",
    topic: 'prepositions',
  },
  {
    id: 'a2-011',
    prompt: "It's raining hard. Don't forget your ____.",
    options: ['umbrella', 'sunglasses', 'towel', 'ticket'],
    correctIndex: 0,
    explanation: 'An umbrella keeps you dry in the rain. Sunglasses are for sunny weather.',
    topic: 'vocabulary',
  },
  {
    id: 'a2-012',
    prompt: "He's going to ____ a doctor when he grows up.",
    options: ['is', 'be', 'being', 'been'],
    correctIndex: 1,
    explanation: "After 'going to' we use the base verb: going to be a doctor.",
    topic: 'grammar',
  },
];
