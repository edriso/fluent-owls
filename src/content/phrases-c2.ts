/**
 * C2 (mastery) "say it like a native" phrases.
 *
 * Subtle, high-register moves: emphasizing, conceding while holding ground,
 * refocusing an argument, and hinting. These are the phrases that make a
 * speaker sound articulate and in command of the conversation.
 */
import type { NativePhrase } from '../types';

export const c2Phrases: NativePhrase[] = [
  {
    id: 'c2-ph-001',
    phrase: 'If anything, ...',
    situation: 'Strengthening a point rather than softening it',
    example: 'If anything, the delay helped us prepare.',
    fn: 'opinion',
  },
  {
    id: 'c2-ph-002',
    phrase: "I wouldn't go so far as to say ...",
    situation: 'Disagreeing with careful nuance',
    example: "I wouldn't go so far as to say it failed.",
    fn: 'disagreeing',
  },
  {
    id: 'c2-ph-003',
    phrase: 'Be that as it may, ...',
    situation: 'Conceding a point yet holding your position',
    example: 'Be that as it may, the deadline still stands.',
    fn: 'disagreeing',
  },
  {
    id: 'c2-ph-004',
    phrase: "Let's not lose sight of ...",
    situation: 'Refocusing on what really matters',
    example: "Let's not lose sight of why we started this.",
    fn: 'clarifying',
  },
  {
    id: 'c2-ph-005',
    phrase: "I'll grant you that, but ...",
    situation: 'Conceding a point before countering it',
    example: "I'll grant you that, but it's the exception.",
    fn: 'disagreeing',
  },
  {
    id: 'c2-ph-006',
    phrase: 'It goes without saying that ...',
    situation: 'Stating the obvious for emphasis',
    example: 'It goes without saying that quality comes first.',
    fn: 'opinion',
  },
  {
    id: 'c2-ph-007',
    phrase: 'At the end of the day, ...',
    situation: 'Cutting to what ultimately matters',
    example: 'At the end of the day, results are what count.',
    fn: 'opinion',
  },
  {
    id: 'c2-ph-008',
    phrase: 'Now, in fairness, ...',
    situation: 'Pausing to acknowledge the other side',
    example: 'Now, in fairness, they had very little time.',
    fn: 'reacting',
  },
  {
    id: 'c2-ph-009',
    phrase: 'Reading between the lines, ...',
    situation: 'Inferring the meaning that was not said',
    example: "Reading between the lines, I think they're stalling.",
    fn: 'clarifying',
  },
  {
    id: 'c2-ph-010',
    phrase: 'Suffice it to say, ...',
    situation: 'Hinting at a lot without full detail',
    example: 'Suffice it to say, the meeting did not go well.',
    fn: 'storytelling',
  },
  {
    id: 'c2-ph-011',
    phrase: 'All things considered, ...',
    situation: 'Weighing everything before concluding',
    example: 'All things considered, it went well.',
    fn: 'opinion',
  },
  {
    id: 'c2-ph-012',
    phrase: "That's a double-edged sword.",
    situation: 'Noting the pros and cons together',
    example: 'More freedom is a double-edged sword.',
    fn: 'opinion',
  },
  {
    id: 'c2-ph-013',
    phrase: "Let's not beat around the bush.",
    situation: 'Asking to be direct',
    example: "Let's not beat around the bush: are we hiring or not?",
    fn: 'transitions',
  },
  {
    id: 'c2-ph-014',
    phrase: 'I stand corrected.',
    situation: 'Gracefully accepting you were wrong',
    example: "You're right, I stand corrected.",
    fn: 'agreeing',
  },
  {
    id: 'c2-ph-015',
    phrase: 'For all intents and purposes, ...',
    situation: 'Saying effectively, in practice',
    example: 'For all intents and purposes, the project is done.',
    fn: 'clarifying',
  },
  {
    id: 'c2-ph-016',
    phrase: "That's the crux of it.",
    situation: 'Naming the central issue',
    example: 'Cost is the crux of it, really.',
    fn: 'clarifying',
  },
  {
    id: 'c2-ph-017',
    phrase: "I'll take that with a grain of salt.",
    situation: 'Treating a claim skeptically',
    example: "Their forecast? I'll take that with a grain of salt.",
    fn: 'reacting',
  },
  {
    id: 'c2-ph-018',
    phrase: "Let's give it the benefit of the doubt.",
    situation: 'Choosing a generous reading',
    example: "It's new, so let's give it the benefit of the doubt.",
    fn: 'softening',
  },
  {
    id: 'c2-ph-019',
    phrase: 'When push comes to shove, ...',
    situation: 'At the decisive moment',
    example: "When push comes to shove, they'll deliver.",
    fn: 'opinion',
  },
  {
    id: 'c2-ph-020',
    phrase: 'That goes a long way.',
    situation: 'Noting something has a big effect',
    example: 'A simple thank you goes a long way.',
    fn: 'reacting',
  },
];
