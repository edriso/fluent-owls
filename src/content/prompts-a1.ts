/**
 * A1 (beginner) question-prompt drills.
 *
 * Hear a simple question, pause the clip, answer out loud, then hear a model
 * answer and compare. This trains speaking on demand: the question removes "what
 * do I say?" so you can focus on HOW you say it.
 */
import type { Prompt } from '../types';

export const a1Prompts: Prompt[] = [
  {
    id: 'a1-pr-001',
    topic: 'Introductions',
    question: "What's your name?",
    answer: 'My name is Sam. Nice to meet you.',
    note: `Answer with "My name is..." then add "Nice to meet you."`,
    audio: 'a1-pr-001.ogg',
  },
  {
    id: 'a1-pr-002',
    topic: 'Where you live',
    question: 'Where do you live?',
    answer: 'I live in London.',
    note: `Use "I live in" plus your city.`,
    audio: 'a1-pr-002.ogg',
  },
  {
    id: 'a1-pr-003',
    topic: 'Jobs',
    question: 'What do you do?',
    answer: "I'm a teacher.",
    note: `"What do you do?" asks about your job. Answer "I'm a..." plus the job.`,
    audio: 'a1-pr-003.ogg',
  },
  {
    id: 'a1-pr-004',
    topic: 'Daily life',
    question: 'What time do you get up?',
    answer: 'I get up at seven.',
    note: `Answer with "I get up at" plus the time.`,
    audio: 'a1-pr-004.ogg',
  },
  {
    id: 'a1-pr-005',
    topic: 'Food',
    question: "What's your favorite food?",
    answer: 'My favorite food is pizza.',
    note: `Echo the question: "My favorite food is..."`,
    audio: 'a1-pr-005.ogg',
  },
  {
    id: 'a1-pr-006',
    topic: 'Family',
    question: 'Do you have any brothers or sisters?',
    answer: 'Yes, I have one sister.',
    note: `Start "Yes, I have..." or "No, I don't."`,
    audio: 'a1-pr-006.ogg',
  },
  {
    id: 'a1-pr-007',
    topic: 'Free time',
    question: 'What do you do in your free time?',
    answer: 'I like reading and walking.',
    note: `Use "I like" plus -ing verbs: reading, walking.`,
    audio: 'a1-pr-007.ogg',
  },
  {
    id: 'a1-pr-008',
    topic: 'Weather',
    question: "What's the weather like today?",
    answer: "It's sunny and warm.",
    note: `Answer with "It's" plus the weather words.`,
    audio: 'a1-pr-008.ogg',
  },
  {
    id: 'a1-pr-009',
    topic: 'The weekend',
    question: 'What do you do on weekends?',
    answer: 'I meet my friends and relax.',
    note: `Present simple for habits: "I meet", "I relax".`,
    audio: 'a1-pr-009.ogg',
  },
  {
    id: 'a1-pr-010',
    topic: 'Countries',
    question: 'Where are you from?',
    answer: "I'm from Spain.",
    note: `Answer "I'm from" plus your country.`,
    audio: 'a1-pr-010.ogg',
  },
  {
    id: 'a1-pr-011',
    topic: 'Languages',
    question: 'Do you speak English?',
    answer: "Yes, a little. I'm learning.",
    note: `It is fine to say "a little". Then add "I'm learning."`,
    audio: 'a1-pr-011.ogg',
  },
  {
    id: 'a1-pr-012',
    topic: 'Feelings',
    question: 'How are you today?',
    answer: "I'm good, thank you. And you?",
    note: `Answer, then bounce it back: "And you?"`,
    audio: 'a1-pr-012.ogg',
  },
];
