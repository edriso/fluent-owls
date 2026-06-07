/**
 * A2 (elementary) question-prompt drills. Slightly fuller answers, with reasons.
 * Hear the question, pause, answer out loud, then compare with the model.
 */
import type { Prompt } from '../types';

export const a2Prompts: Prompt[] = [
  {
    id: 'a2-pr-001',
    topic: 'Plans',
    question: 'What are you doing this weekend?',
    answer: "I'm going to visit my family.",
    note: `Use "going to" for plans: "I'm going to..."`,
    audio: 'a2-pr-001.ogg',
  },
  {
    id: 'a2-pr-002',
    topic: 'The past',
    question: 'What did you do yesterday?',
    answer: 'I worked, and then I watched a movie.',
    note: `Past simple: "worked", "watched". Link two actions with "and then".`,
    audio: 'a2-pr-002.ogg',
  },
  {
    id: 'a2-pr-003',
    topic: 'Preferences',
    question: 'Do you prefer tea or coffee?',
    answer: 'I prefer coffee, especially in the morning.',
    note: `Use "I prefer..." then add a detail with "especially".`,
    audio: 'a2-pr-003.ogg',
  },
  {
    id: 'a2-pr-004',
    topic: 'Travel',
    question: 'Have you ever been abroad?',
    answer: 'Yes, I went to Italy last year.',
    note: `Answer "Yes" then give the past simple detail: "I went to..."`,
    audio: 'a2-pr-004.ogg',
  },
  {
    id: 'a2-pr-005',
    topic: 'Routine',
    question: 'How do you get to work?',
    answer: 'I usually take the bus.',
    note: `"usually" softens a habit. "take the bus / train / car".`,
    audio: 'a2-pr-005.ogg',
  },
  {
    id: 'a2-pr-006',
    topic: 'Music',
    question: 'What kind of music do you like?',
    answer: 'I like pop, and a bit of jazz too.',
    note: `Name a type, then add another with "and a bit of".`,
    audio: 'a2-pr-006.ogg',
  },
  {
    id: 'a2-pr-007',
    topic: 'Shopping',
    question: 'How often do you go shopping?',
    answer: 'About once a week, usually on Saturday.',
    note: `Frequency: "once a week", "twice a month".`,
    audio: 'a2-pr-007.ogg',
  },
  {
    id: 'a2-pr-008',
    topic: 'Health',
    question: 'How do you stay healthy?',
    answer: 'I try to walk every day and eat well.',
    note: `"I try to..." is a natural, humble way to answer.`,
    audio: 'a2-pr-008.ogg',
  },
  {
    id: 'a2-pr-009',
    topic: 'Seasons',
    question: "What's your favorite season?",
    answer: "I love spring, because it's not too hot.",
    note: `Give a reason with "because".`,
    audio: 'a2-pr-009.ogg',
  },
  {
    id: 'a2-pr-010',
    topic: 'Opinions',
    question: 'What do you think of this city?',
    answer: 'I really like it. It is friendly and lively.',
    note: `Give an opinion, then two adjectives to support it.`,
    audio: 'a2-pr-010.ogg',
  },
  {
    id: 'a2-pr-011',
    topic: 'The future',
    question: 'What are your plans for next year?',
    answer: "I'm hoping to find a better job.",
    note: `"I'm hoping to..." is softer than "I will".`,
    audio: 'a2-pr-011.ogg',
  },
  {
    id: 'a2-pr-012',
    topic: 'Memories',
    question: "What's your earliest memory?",
    answer: "I remember playing in my grandmother's garden.",
    note: `"I remember" plus an -ing verb: "I remember playing..."`,
    audio: 'a2-pr-012.ogg',
  },
];
