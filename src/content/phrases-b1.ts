/**
 * B1 (intermediate) "say it like a native" phrases.
 *
 * The chunks that make conversation flow: disagreeing gently, giving advice,
 * telling a story, and making polite requests. These move a learner from
 * "correct" to "natural".
 */
import type { NativePhrase } from '../types';

export const b1Phrases: NativePhrase[] = [
  {
    id: 'b1-ph-001',
    phrase: 'I see your point, but ...',
    situation: 'Disagreeing while respecting their view',
    example: "I see your point, but I think it's too expensive.",
    fn: 'disagreeing',
  },
  {
    id: 'b1-ph-002',
    phrase: 'It depends.',
    situation: 'Saying the answer is not fixed',
    example: 'Will you come? It depends on the time.',
    fn: 'clarifying',
  },
  {
    id: 'b1-ph-003',
    phrase: "If I were you, I'd ...",
    situation: 'Giving advice gently',
    example: "If I were you, I'd take the earlier train.",
    fn: 'opinion',
  },
  {
    id: 'b1-ph-004',
    phrase: 'Long story short, ...',
    situation: 'Skipping to the point of a story',
    example: 'Long story short, we missed the bus.',
    fn: 'storytelling',
  },
  {
    id: 'b1-ph-005',
    phrase: 'By the way, ...',
    situation: 'Adding something or changing topic lightly',
    example: 'By the way, did you call the office?',
    fn: 'transitions',
  },
  {
    id: 'b1-ph-006',
    phrase: 'I was wondering if ...',
    situation: 'Making a polite request',
    example: 'I was wondering if you could send the file.',
    fn: 'requests',
  },
  {
    id: 'b1-ph-007',
    phrase: 'That makes sense.',
    situation: 'Showing you understand and agree',
    example: 'Ah, that makes sense. Thanks for explaining.',
    fn: 'agreeing',
  },
  {
    id: 'b1-ph-008',
    phrase: "I'm not really into ...",
    situation: 'Saying you do not enjoy something',
    example: "I'm not really into horror movies.",
    fn: 'opinion',
  },
  {
    id: 'b1-ph-009',
    phrase: 'Sorry to bother you, but ...',
    situation: 'Interrupting someone politely',
    example: 'Sorry to bother you, but do you have a minute?',
    fn: 'softening',
  },
  {
    id: 'b1-ph-010',
    phrase: 'Let me get back to you.',
    situation: 'Saying you will answer later',
    example: 'Good question. Let me get back to you on that.',
    fn: 'clarifying',
  },
  {
    id: 'b1-ph-011',
    phrase: 'As far as I know, ...',
    situation: 'Sharing what you believe is true',
    example: 'As far as I know, the office is closed Monday.',
    fn: 'clarifying',
  },
  {
    id: 'b1-ph-012',
    phrase: "I'm in two minds about it.",
    situation: 'Saying you cannot decide',
    example: "I'm in two minds about the new plan.",
    fn: 'opinion',
  },
  {
    id: 'b1-ph-013',
    phrase: 'Fingers crossed.',
    situation: 'Hoping for good luck',
    example: 'The interview is tomorrow. Fingers crossed.',
    fn: 'reacting',
  },
  {
    id: 'b1-ph-014',
    phrase: "It's up to you.",
    situation: 'Letting them decide',
    example: "Pizza or sushi? It's up to you.",
    fn: 'clarifying',
  },
  {
    id: 'b1-ph-015',
    phrase: "I'll let you know.",
    situation: 'Promising to update them',
    example: "Once I decide, I'll let you know.",
    fn: 'clarifying',
  },
  {
    id: 'b1-ph-016',
    phrase: 'Do you mind if ...?',
    situation: 'Asking permission politely',
    example: 'Do you mind if I open the window?',
    fn: 'requests',
  },
  {
    id: 'b1-ph-017',
    phrase: "That's a relief.",
    situation: 'Showing you feel relieved',
    example: "The test was negative. That's a relief.",
    fn: 'reacting',
  },
  {
    id: 'b1-ph-018',
    phrase: 'Could be better, could be worse.',
    situation: "A casual 'so-so' reply",
    example: 'How is work? Could be better, could be worse.',
    fn: 'small-talk',
  },
  {
    id: 'b1-ph-019',
    phrase: "Let's split the difference.",
    situation: 'Suggesting a compromise',
    example: "You say 40, I say 60. Let's split the difference.",
    fn: 'transitions',
  },
  {
    id: 'b1-ph-020',
    phrase: 'I owe you one.',
    situation: 'Thanking someone for a favor',
    example: 'You saved me there. I owe you one.',
    fn: 'reacting',
  },
];
