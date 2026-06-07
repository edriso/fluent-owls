/**
 * B2 (upper-intermediate) "say it like a native" phrases.
 *
 * Confident moves for discussions and work: balanced points, acknowledging then
 * disagreeing, hedging an opinion, and steering a conversation.
 */
import type { NativePhrase } from '../types';

export const b2Phrases: NativePhrase[] = [
  {
    id: 'b2-ph-001',
    phrase: 'To be fair, ...',
    situation: 'Adding a balanced or sympathetic point',
    example: 'To be fair, they did warn us in advance.',
    fn: 'opinion',
  },
  {
    id: 'b2-ph-002',
    phrase: "I get where you're coming from, but ...",
    situation: 'Acknowledging their view, then disagreeing',
    example: "I get where you're coming from, but the budget won't allow it.",
    fn: 'disagreeing',
  },
  {
    id: 'b2-ph-003',
    phrase: "I'd rather not, if that's okay.",
    situation: 'Declining firmly but politely',
    example: "I'd rather not share that, if that's okay.",
    fn: 'softening',
  },
  {
    id: 'b2-ph-004',
    phrase: "It's worth ...-ing.",
    situation: 'Recommending an action',
    example: "It's worth checking the reviews first.",
    fn: 'opinion',
  },
  {
    id: 'b2-ph-005',
    phrase: 'Now that you mention it, ...',
    situation: 'Realizing something as they speak',
    example: 'Now that you mention it, I did hear about that.',
    fn: 'reacting',
  },
  {
    id: 'b2-ph-006',
    phrase: "Let's touch base later.",
    situation: 'Agreeing to talk again soon (work)',
    example: "Let's touch base later this week about the plan.",
    fn: 'transitions',
  },
  {
    id: 'b2-ph-007',
    phrase: "Correct me if I'm wrong, but ...",
    situation: 'Checking your understanding politely',
    example: "Correct me if I'm wrong, but this is due Monday?",
    fn: 'clarifying',
  },
  {
    id: 'b2-ph-008',
    phrase: "I'm leaning toward ...",
    situation: 'Stating a tentative preference',
    example: "I'm leaning toward the second option.",
    fn: 'opinion',
  },
  {
    id: 'b2-ph-009',
    phrase: "That's a fair point.",
    situation: 'Conceding ground in a discussion',
    example: "That's a fair point, I hadn't considered the cost.",
    fn: 'agreeing',
  },
  {
    id: 'b2-ph-010',
    phrase: 'Anyway, where was I?',
    situation: 'Returning to your story after a tangent',
    example: 'Anyway, where was I? Right, the meeting.',
    fn: 'storytelling',
  },
  {
    id: 'b2-ph-011',
    phrase: 'On second thought, ...',
    situation: 'Changing your mind',
    example: "On second thought, let's wait until Friday.",
    fn: 'opinion',
  },
  {
    id: 'b2-ph-012',
    phrase: "Let's play it safe.",
    situation: 'Choosing the cautious option',
    example: "The weather looks bad. Let's play it safe.",
    fn: 'transitions',
  },
  {
    id: 'b2-ph-013',
    phrase: "I'll take a rain check.",
    situation: 'Declining now but suggesting later',
    example: "I can't tonight, but I'll take a rain check.",
    fn: 'softening',
  },
  {
    id: 'b2-ph-014',
    phrase: "That's beside the point.",
    situation: 'Saying it is not relevant',
    example: "Sure it's cheap, but that's beside the point.",
    fn: 'clarifying',
  },
  {
    id: 'b2-ph-015',
    phrase: "Let's get this straight.",
    situation: 'Confirming the facts firmly',
    example: "Let's get this straight: it's due Monday?",
    fn: 'clarifying',
  },
  {
    id: 'b2-ph-016',
    phrase: "I'm all ears.",
    situation: 'Showing you are listening',
    example: "You have an idea? I'm all ears.",
    fn: 'reacting',
  },
  {
    id: 'b2-ph-017',
    phrase: "It's a fine line.",
    situation: 'Noting a subtle difference',
    example: "It's a fine line between confident and rude.",
    fn: 'opinion',
  },
  {
    id: 'b2-ph-018',
    phrase: "Let's not make a big deal of it.",
    situation: 'Downplaying something',
    example: "It was a small mistake. Let's not make a big deal of it.",
    fn: 'softening',
  },
  {
    id: 'b2-ph-019',
    phrase: 'Whatever works for you.',
    situation: 'Being flexible',
    example: 'Morning or afternoon? Whatever works for you.',
    fn: 'agreeing',
  },
  {
    id: 'b2-ph-020',
    phrase: 'Point taken.',
    situation: 'Accepting a correction',
    example: "Point taken, I'll be more careful.",
    fn: 'agreeing',
  },
];
