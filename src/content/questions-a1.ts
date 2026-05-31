/**
 * A1 (beginner) English quiz questions.
 *
 * These target absolute beginners: everyday vocabulary, the verb "to be",
 * simple present, basic articles, plurals, and the most common prepositions.
 * Each question is a short, self-contained sentence with one blank.
 *
 * Answer indices are 0-based. Keep explanations under 200 characters so they
 * fit Telegram's quiz explanation limit.
 */
import type { QuizQuestion } from '../types';

export const a1Questions: QuizQuestion[] = [
  {
    id: 'a1-001',
    prompt: "I'm thirsty. Can I have a glass of ____, please?",
    options: ['bread', 'water', 'paper', 'wood'],
    correctIndex: 1,
    explanation:
      "You drink water when you're thirsty. Bread is food; paper and wood are not drinks.",
    topic: 'vocabulary',
  },
  {
    id: 'a1-002',
    prompt: 'She ____ a teacher.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1,
    explanation: "With he/she/it we use 'is'. Use 'am' with I, and 'are' with you/we/they.",
    topic: 'grammar',
  },
  {
    id: 'a1-003',
    prompt: 'The book is ____ the table.',
    options: ['in', 'at', 'on', 'of'],
    correctIndex: 2,
    explanation: "We use 'on' for a surface: on the table, on the wall, on the floor.",
    topic: 'prepositions',
  },
  {
    id: 'a1-004',
    prompt: 'We sleep in a ____.',
    options: ['bed', 'plate', 'door', 'spoon'],
    correctIndex: 0,
    explanation: 'You sleep in a bed. A plate holds food and a spoon is for eating.',
    topic: 'vocabulary',
  },
  {
    id: 'a1-005',
    prompt: 'There are three ____ on the table.',
    options: ['a book', 'book', 'books', 'bookes'],
    correctIndex: 2,
    explanation: 'After a number greater than one we use the plural: three books.',
    topic: 'grammar',
  },
  {
    id: 'a1-006',
    prompt: "I get up ____ 7 o'clock.",
    options: ['in', 'on', 'at', 'to'],
    correctIndex: 2,
    explanation: "We use 'at' with clock times: at 7 o'clock, at noon, at midnight.",
    topic: 'prepositions',
  },
  {
    id: 'a1-007',
    prompt: "It's cold today, so put on your ____.",
    options: ['coat', 'cup', 'lamp', 'fork'],
    correctIndex: 0,
    explanation: "A coat is warm clothing you wear when it's cold.",
    topic: 'vocabulary',
  },
  {
    id: 'a1-008',
    prompt: 'We have ____ apple and two oranges.',
    options: ['a', 'an', 'the', 'some'],
    correctIndex: 1,
    explanation:
      "Use 'an' before a vowel sound: an apple. Use 'a' before a consonant sound: a banana.",
    topic: 'grammar',
  },
  {
    id: 'a1-009',
    prompt: "Let's eat. I'm very ____.",
    options: ['tall', 'blue', 'hungry', 'open'],
    correctIndex: 2,
    explanation: 'When you want to eat, you are hungry. (When you want to drink, you are thirsty.)',
    topic: 'vocabulary',
  },
  {
    id: 'a1-010',
    prompt: 'My birthday is ____ June.',
    options: ['on', 'at', 'in', 'by'],
    correctIndex: 2,
    explanation: "We use 'in' with months and years: in June, in 2025.",
    topic: 'prepositions',
  },
  {
    id: 'a1-011',
    prompt: 'I ____ coffee every morning.',
    options: ['drinks', 'drinking', 'drink', 'drank'],
    correctIndex: 2,
    explanation: "With 'I' the present simple uses the base verb: I drink. Only he/she/it adds -s.",
    topic: 'grammar',
  },
  {
    id: 'a1-012',
    prompt: 'The ____ is yellow and gives us light during the day.',
    options: ['sun', 'moon', 'rain', 'snow'],
    correctIndex: 0,
    explanation: 'The sun shines during the day. The moon comes out at night.',
    topic: 'vocabulary',
  },
];
