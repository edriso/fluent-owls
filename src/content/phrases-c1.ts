/**
 * C1 (advanced) "say it like a native" phrases.
 *
 * Polished, idiomatic moves for professional and serious conversation:
 * conceding, disagreeing diplomatically, praising, hedging, and steering.
 */
import type { NativePhrase } from '../types';

export const c1Phrases: NativePhrase[] = [
  {
    id: 'c1-ph-001',
    phrase: 'Fair enough.',
    situation: "Accepting someone's point or decision",
    example: "You're too busy? Fair enough, we'll reschedule.",
    fn: 'agreeing',
  },
  {
    id: 'c1-ph-002',
    phrase: 'I take your point, but ...',
    situation: 'Diplomatic disagreement',
    example: "I take your point, but I'd argue the timing is wrong.",
    fn: 'disagreeing',
  },
  {
    id: 'c1-ph-003',
    phrase: "Credit where it's due, ...",
    situation: 'Giving someone deserved praise',
    example: "Credit where it's due, the team pulled it off.",
    fn: 'reacting',
  },
  {
    id: 'c1-ph-004',
    phrase: 'Off the top of my head, ...',
    situation: 'Answering from memory, not certain',
    example: "Off the top of my head, I'd say about thirty.",
    fn: 'clarifying',
  },
  {
    id: 'c1-ph-005',
    phrase: "Let's play it by ear.",
    situation: 'Deciding as you go instead of fixing a plan',
    example: "We don't need a fixed plan; let's play it by ear.",
    fn: 'transitions',
  },
  {
    id: 'c1-ph-006',
    phrase: "I'm inclined to think ...",
    situation: 'Stating a considered view',
    example: "I'm inclined to think we should wait a quarter.",
    fn: 'opinion',
  },
  {
    id: 'c1-ph-007',
    phrase: 'With all due respect, ...',
    situation: 'Disagreeing with someone senior, politely',
    example: "With all due respect, I think we're missing the point.",
    fn: 'disagreeing',
  },
  {
    id: 'c1-ph-008',
    phrase: 'That said, ...',
    situation: 'Adding a contrasting point to your own',
    example: 'It is expensive. That said, the quality is excellent.',
    fn: 'transitions',
  },
  {
    id: 'c1-ph-009',
    phrase: 'Bear with me for a second.',
    situation: 'Asking for a moment of patience',
    example: 'Bear with me for a second while I find the file.',
    fn: 'softening',
  },
  {
    id: 'c1-ph-010',
    phrase: 'To cut a long story short, ...',
    situation: 'Summarizing a long account',
    example: 'To cut a long story short, the deal fell through.',
    fn: 'storytelling',
  },
  {
    id: 'c1-ph-011',
    phrase: "Let's not get ahead of ourselves.",
    situation: 'Slowing things down',
    example: "Let's not get ahead of ourselves, the deal isn't signed.",
    fn: 'transitions',
  },
  {
    id: 'c1-ph-012',
    phrase: 'In a nutshell, ...',
    situation: 'Summarizing briefly',
    example: "In a nutshell, it works but it's slow.",
    fn: 'storytelling',
  },
  {
    id: 'c1-ph-013',
    phrase: 'I beg to differ.',
    situation: 'Politely but firmly disagreeing',
    example: 'I beg to differ; the data says otherwise.',
    fn: 'disagreeing',
  },
  {
    id: 'c1-ph-014',
    phrase: 'By and large, ...',
    situation: 'Speaking generally',
    example: 'By and large, the feedback has been positive.',
    fn: 'opinion',
  },
  {
    id: 'c1-ph-015',
    phrase: "Let's not split hairs.",
    situation: 'Avoiding tiny distinctions',
    example: "Late or delayed, let's not split hairs.",
    fn: 'transitions',
  },
  {
    id: 'c1-ph-016',
    phrase: "That's a tall order.",
    situation: 'Noting something is hard to ask',
    example: "Done by tomorrow? That's a tall order.",
    fn: 'reacting',
  },
  {
    id: 'c1-ph-017',
    phrase: "I'll give you that.",
    situation: 'Conceding one point',
    example: "It's expensive, I'll give you that.",
    fn: 'agreeing',
  },
  {
    id: 'c1-ph-018',
    phrase: "Let's touch on that later.",
    situation: 'Postponing a topic',
    example: "Good question; let's touch on that later.",
    fn: 'transitions',
  },
  {
    id: 'c1-ph-019',
    phrase: 'It remains to be seen.',
    situation: 'Saying it is not yet clear',
    example: 'Whether it scales remains to be seen.',
    fn: 'clarifying',
  },
  {
    id: 'c1-ph-020',
    phrase: 'Needless to say, ...',
    situation: 'Stating the obvious',
    example: 'Needless to say, we were thrilled.',
    fn: 'opinion',
  },
];
