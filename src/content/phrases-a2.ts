/**
 * A2 (elementary) "say it like a native" phrases.
 *
 * Everyday social chunks: inviting, suggesting, accepting, and declining
 * gently. Each one is a whole phrase to reuse as is.
 */
import type { NativePhrase } from '../types';

export const a2Phrases: NativePhrase[] = [
  {
    id: 'a2-ph-001',
    phrase: 'Do you want to ...?',
    situation: 'Inviting someone to do something',
    example: 'Do you want to grab a coffee?',
    fn: 'requests',
  },
  {
    id: 'a2-ph-002',
    phrase: "Why don't we ...?",
    situation: 'Suggesting an idea to do together',
    example: "Why don't we meet at six?",
    fn: 'requests',
  },
  {
    id: 'a2-ph-003',
    phrase: "I'd love to.",
    situation: 'Accepting an invitation warmly',
    example: "A movie tonight? I'd love to.",
    fn: 'agreeing',
  },
  {
    id: 'a2-ph-004',
    phrase: 'Maybe next time.',
    situation: 'Saying no to a plan gently',
    example: "I can't today, but maybe next time.",
    fn: 'softening',
  },
  {
    id: 'a2-ph-005',
    phrase: 'That sounds great.',
    situation: 'Showing you like an idea',
    example: 'Pizza tonight? That sounds great.',
    fn: 'reacting',
  },
  {
    id: 'a2-ph-006',
    phrase: 'What do you think?',
    situation: "Asking for the other person's view",
    example: 'I like the blue one. What do you think?',
    fn: 'opinion',
  },
  {
    id: 'a2-ph-007',
    phrase: 'To be honest, ...',
    situation: 'Introducing your real opinion',
    example: 'To be honest, I prefer the other plan.',
    fn: 'opinion',
  },
  {
    id: 'a2-ph-008',
    phrase: "I'm afraid I can't.",
    situation: 'Declining politely',
    example: "I'm afraid I can't make it on Friday.",
    fn: 'softening',
  },
  {
    id: 'a2-ph-009',
    phrase: 'Could you help me?',
    situation: 'Asking for help politely',
    example: 'Could you help me with this bag?',
    fn: 'requests',
  },
  {
    id: 'a2-ph-010',
    phrase: 'Never mind.',
    situation: "Saying 'forget it, it is okay' kindly",
    example: "Never mind, I'll do it later.",
    fn: 'reacting',
  },
  {
    id: 'a2-ph-011',
    phrase: 'Sounds good to me.',
    situation: 'Accepting a plan casually',
    example: 'Dinner at seven? Sounds good to me.',
    fn: 'agreeing',
  },
  {
    id: 'a2-ph-012',
    phrase: "I'm good, thanks.",
    situation: 'Replying that you are fine',
    example: "How are you? I'm good, thanks.",
    fn: 'small-talk',
  },
  {
    id: 'a2-ph-013',
    phrase: 'Can I ask you something?',
    situation: 'Starting a question politely',
    example: "Can I ask you something? It's quick.",
    fn: 'clarifying',
  },
  {
    id: 'a2-ph-014',
    phrase: 'Let me check.',
    situation: 'Saying you will look',
    example: 'Is it open? Let me check.',
    fn: 'clarifying',
  },
  {
    id: 'a2-ph-015',
    phrase: 'No worries.',
    situation: 'Saying it is fine',
    example: "Sorry I'm late! No worries.",
    fn: 'reacting',
  },
  {
    id: 'a2-ph-016',
    phrase: "I'd rather not.",
    situation: 'Declining gently',
    example: "Want to walk? I'd rather not, it's cold.",
    fn: 'softening',
  },
  {
    id: 'a2-ph-017',
    phrase: 'What about you?',
    situation: 'Turning a question back',
    example: 'I had a great day. What about you?',
    fn: 'small-talk',
  },
  {
    id: 'a2-ph-018',
    phrase: "That's too bad.",
    situation: 'Showing sympathy',
    example: "The trip was canceled. That's too bad.",
    fn: 'reacting',
  },
  {
    id: 'a2-ph-019',
    phrase: 'Give me a second.',
    situation: 'Asking for a moment',
    example: "Give me a second, I'm almost ready.",
    fn: 'clarifying',
  },
  {
    id: 'a2-ph-020',
    phrase: 'Take care!',
    situation: 'A friendly goodbye',
    example: 'Bye for now. Take care!',
    fn: 'small-talk',
  },
];
