/**
 * A1 (beginner) "say it like a native" phrases.
 *
 * Ready-made chunks for everyday moments. Fluent speakers talk in whole phrases,
 * not word by word, so memorizing a few high-frequency ones makes a beginner
 * sound natural fast. Each phrase has when to use it and a short example. Text
 * only, no audio.
 */
import type { NativePhrase } from '../types';

export const a1Phrases: NativePhrase[] = [
  {
    id: 'a1-ph-001',
    phrase: 'Can I have ..., please?',
    situation: 'Asking for something in a shop or café',
    example: 'Can I have a coffee, please?',
    fn: 'requests',
  },
  {
    id: 'a1-ph-002',
    phrase: "I'd like ...",
    situation: "Ordering politely (softer than 'I want')",
    example: "I'd like a small pizza, please.",
    fn: 'requests',
  },
  {
    id: 'a1-ph-003',
    phrase: 'Nice to meet you.',
    situation: 'Meeting someone for the first time',
    example: "Hi, I'm Sam. Nice to meet you!",
    fn: 'small-talk',
  },
  {
    id: 'a1-ph-004',
    phrase: "How's it going?",
    situation: 'A casual way to say hello',
    example: "Hey! How's it going?",
    fn: 'small-talk',
  },
  {
    id: 'a1-ph-005',
    phrase: 'I think so.',
    situation: 'Saying yes when you are fairly sure',
    example: 'Is the shop open? I think so.',
    fn: 'agreeing',
  },
  {
    id: 'a1-ph-006',
    phrase: 'Me too.',
    situation: 'Showing you feel the same way',
    example: "I'm hungry. Me too!",
    fn: 'agreeing',
  },
  {
    id: 'a1-ph-007',
    phrase: "I'm not sure.",
    situation: 'Saying you do not know yet',
    example: "I'm not sure. Let me check.",
    fn: 'clarifying',
  },
  {
    id: 'a1-ph-008',
    phrase: "Sorry, I don't understand.",
    situation: 'Asking for help when something is unclear',
    example: "Sorry, I don't understand. Can you say it again?",
    fn: 'clarifying',
  },
  {
    id: 'a1-ph-009',
    phrase: 'No problem.',
    situation: 'A friendly reply to thanks or a small request',
    example: 'Thanks for waiting! No problem.',
    fn: 'reacting',
  },
  {
    id: 'a1-ph-010',
    phrase: 'See you later!',
    situation: 'A casual goodbye',
    example: 'Okay, see you later!',
    fn: 'small-talk',
  },
  {
    id: 'a1-ph-011',
    phrase: 'Thank you so much.',
    situation: 'Thanking someone warmly',
    example: 'Thank you so much for your help!',
    fn: 'reacting',
  },
  {
    id: 'a1-ph-012',
    phrase: 'Excuse me.',
    situation: 'Getting attention politely',
    example: 'Excuse me, is this seat free?',
    fn: 'requests',
  },
  {
    id: 'a1-ph-013',
    phrase: 'How much is it?',
    situation: 'Asking a price',
    example: "It's nice. How much is it?",
    fn: 'requests',
  },
  {
    id: 'a1-ph-014',
    phrase: "I don't know.",
    situation: 'Saying you do not know',
    example: "Where is he? I don't know.",
    fn: 'clarifying',
  },
  {
    id: 'a1-ph-015',
    phrase: 'Can you help me?',
    situation: 'Asking for help',
    example: 'Can you help me, please?',
    fn: 'requests',
  },
  {
    id: 'a1-ph-016',
    phrase: 'Of course!',
    situation: 'Saying yes warmly',
    example: 'Can I join you? Of course!',
    fn: 'agreeing',
  },
  {
    id: 'a1-ph-017',
    phrase: "Let's go.",
    situation: 'Suggesting you leave or start',
    example: "Are you ready? Let's go.",
    fn: 'transitions',
  },
  {
    id: 'a1-ph-018',
    phrase: "I'm sorry.",
    situation: 'Apologizing',
    example: "I'm sorry, that was my mistake.",
    fn: 'softening',
  },
  {
    id: 'a1-ph-019',
    phrase: "What's this?",
    situation: 'Asking about something',
    example: "What's this? It looks interesting.",
    fn: 'clarifying',
  },
  {
    id: 'a1-ph-020',
    phrase: 'See you soon!',
    situation: 'A warm goodbye',
    example: 'Bye! See you soon!',
    fn: 'small-talk',
  },
];
