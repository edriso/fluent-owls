/**
 * C1 (advanced) role-play dialogues.
 *
 * Polished, professional exchanges: running a meeting, diplomatic disagreement,
 * feedback, hedging, and decisions. Shadow both sides to absorb the calm,
 * confident delivery of a fluent professional.
 */
import type { Dialogue } from '../types';

export const c1Dialogues: Dialogue[] = [
  {
    id: 'c1-dl-001',
    situation: 'Opening a meeting',
    turns: [
      { speaker: 'A', text: 'Shall we get the ball rolling?' },
      { speaker: 'B', text: "Yes, let's dive in." },
      { speaker: 'A', text: 'Great. First item on the agenda.' },
    ],
    note: `Open with "Shall we get the ball rolling?" then "let's dive in".`,
    audio: 'c1-dl-001.ogg',
  },
  {
    id: 'c1-dl-002',
    situation: 'Diplomatic disagreement',
    turns: [
      { speaker: 'A', text: 'I think we should outsource it.' },
      { speaker: 'B', text: "I take your point, but I'd argue we lose control that way." },
      { speaker: 'A', text: "That's worth considering." },
    ],
    note: `Disagree with finesse: "I take your point, but I'd argue..."`,
    audio: 'c1-dl-002.ogg',
  },
  {
    id: 'c1-dl-003',
    situation: 'Receiving praise',
    turns: [
      { speaker: 'A', text: 'How did I do?' },
      { speaker: 'B', text: "Credit where it's due, you handled the tough questions well." },
      { speaker: 'A', text: 'Thanks, that means a lot.' },
    ],
    note: `Praise sincerely: "Credit where it's due, you handled it well."`,
    audio: 'c1-dl-003.ogg',
  },
  {
    id: 'c1-dl-004',
    situation: 'Giving a rough estimate',
    turns: [
      { speaker: 'A', text: 'Can you give me a rough figure?' },
      { speaker: 'B', text: 'Off the top of my head, somewhere around fifty.' },
      { speaker: 'A', text: "That's helpful, thanks." },
    ],
    note: `Estimate loosely: "Off the top of my head, around fifty."`,
    audio: 'c1-dl-004.ogg',
  },
  {
    id: 'c1-dl-005',
    situation: 'Deferring a decision',
    turns: [
      { speaker: 'A', text: 'Should we commit today?' },
      { speaker: 'B', text: "I'd rather not rush it. Let's sleep on it." },
      { speaker: 'A', text: "Sensible. We'll decide tomorrow." },
    ],
    note: `Defer a decision: "I'd rather not rush it. Let's sleep on it."`,
    audio: 'c1-dl-005.ogg',
  },
  {
    id: 'c1-dl-006',
    situation: 'Refocusing a discussion',
    turns: [
      { speaker: 'A', text: "We're getting into the weeds here." },
      { speaker: 'B', text: "Good point. Let's not lose sight of the goal." },
      { speaker: 'A', text: 'Exactly. Back to the big picture.' },
    ],
    note: `Refocus: "Let's not lose sight of the goal."`,
    audio: 'c1-dl-006.ogg',
  },
  {
    id: 'c1-dl-007',
    situation: 'Conceding a point',
    turns: [
      { speaker: 'A', text: 'The data clearly supports option B.' },
      { speaker: 'B', text: 'Fair enough, I stand corrected.' },
      { speaker: 'A', text: "No worries, it wasn't obvious." },
    ],
    note: `Concede gracefully: "Fair enough, I stand corrected."`,
    audio: 'c1-dl-007.ogg',
  },
  {
    id: 'c1-dl-008',
    situation: 'Softening bad news',
    turns: [
      { speaker: 'A', text: 'Did we win the contract?' },
      { speaker: 'B', text: "I'm afraid it's not the news we were hoping for." },
      { speaker: 'A', text: 'Ah. Well, thanks for letting me know.' },
    ],
    note: `Soften bad news: "It's not the news we were hoping for."`,
    audio: 'c1-dl-008.ogg',
  },
  {
    id: 'c1-dl-009',
    situation: 'Pressing for action',
    turns: [
      { speaker: 'A', text: "Let's wait until next quarter." },
      { speaker: 'B', text: "We can't afford to lose momentum now." },
      { speaker: 'A', text: 'You make a compelling case.' },
    ],
    note: `Press the point: "We can't afford to lose momentum now."`,
    audio: 'c1-dl-009.ogg',
  },
  {
    id: 'c1-dl-010',
    situation: 'Managing a tough deadline',
    turns: [
      { speaker: 'A', text: 'I need this by tomorrow.' },
      { speaker: 'B', text: 'I can do that, but something else will have to slip.' },
      { speaker: 'A', text: 'Understood. Prioritize this one.' },
    ],
    note: `Manage up: "I can do that, but something else will have to slip."`,
    audio: 'c1-dl-010.ogg',
  },
  {
    id: 'c1-dl-011',
    situation: 'Building rapport',
    turns: [
      { speaker: 'A', text: "How's the new role treating you?" },
      { speaker: 'B', text: "Steep learning curve, but I'm enjoying it." },
      { speaker: 'A', text: "That's the spirit." },
    ],
    note: `Build rapport: "How's the new role treating you?"`,
    audio: 'c1-dl-011.ogg',
  },
  {
    id: 'c1-dl-012',
    situation: 'A tactful no',
    turns: [
      { speaker: 'A', text: 'Could you lead the project?' },
      { speaker: 'B', text: "I'm flattered, but my plate is full right now." },
      { speaker: 'A', text: 'Of course. Maybe next time.' },
    ],
    note: `Say no with grace: "I'm flattered, but my plate is full."`,
    audio: 'c1-dl-012.ogg',
  },
  {
    id: 'c1-dl-013',
    situation: 'Clarifying scope',
    turns: [
      { speaker: 'A', text: "So we're handling the whole rollout?" },
      { speaker: 'B', text: 'Not quite. Just the first phase.' },
      { speaker: 'A', text: "Understood, that's more manageable." },
    ],
    note: `Narrow the scope: "Not quite. Just the first phase."`,
    audio: 'c1-dl-013.ogg',
  },
  {
    id: 'c1-dl-014',
    situation: 'Handling feedback well',
    turns: [
      { speaker: 'A', text: 'The report was a bit rushed.' },
      { speaker: 'B', text: "I hear you. I'll give it another pass." },
      { speaker: 'A', text: "It's solid overall, just polish it." },
    ],
    note: `Take feedback well: "I hear you. I'll give it another pass."`,
    audio: 'c1-dl-014.ogg',
  },
  {
    id: 'c1-dl-015',
    situation: 'Steering back on track',
    turns: [
      { speaker: 'A', text: 'We could also redesign the logo.' },
      { speaker: 'B', text: "Let's table that for now and stay focused." },
      { speaker: 'A', text: 'Agreed, one thing at a time.' },
    ],
    note: `Steer back: "Let's table that for now and stay focused."`,
    audio: 'c1-dl-015.ogg',
  },
  {
    id: 'c1-dl-016',
    situation: 'Showing support',
    turns: [
      { speaker: 'A', text: 'What do you think of the proposal?' },
      { speaker: 'B', text: "Honestly, I'm really on board with it." },
      { speaker: 'A', text: "Brilliant, let's move forward." },
    ],
    note: `Show support: "Honestly, I'm really on board with it."`,
    audio: 'c1-dl-016.ogg',
  },
  {
    id: 'c1-dl-017',
    situation: 'Weighing a risk',
    turns: [
      { speaker: 'A', text: "There's a chance it backfires." },
      { speaker: 'B', text: 'True, but the upside outweighs the risk.' },
      { speaker: 'A', text: "I'll take that bet." },
    ],
    note: `Weigh a risk: "The upside outweighs the risk."`,
    audio: 'c1-dl-017.ogg',
  },
  {
    id: 'c1-dl-018',
    situation: 'Reframing a problem',
    turns: [
      { speaker: 'A', text: 'This is a disaster.' },
      { speaker: 'B', text: "Let's call it a setback, not a disaster." },
      { speaker: 'A', text: "Fair, that's a healthier way to see it." },
    ],
    note: `Reframe a problem: "Let's call it a setback, not a disaster."`,
    audio: 'c1-dl-018.ogg',
  },
  {
    id: 'c1-dl-019',
    situation: 'Closing a meeting',
    turns: [
      { speaker: 'A', text: "I think that's everything." },
      { speaker: 'B', text: "Let's reconvene once we have the figures." },
      { speaker: 'A', text: "Perfect, I'll set it up." },
    ],
    note: `Close cleanly: "Let's reconvene once we have the figures."`,
    audio: 'c1-dl-019.ogg',
  },
  {
    id: 'c1-dl-020',
    situation: 'Reflecting on a decision',
    turns: [
      { speaker: 'A', text: 'In hindsight, we moved too fast.' },
      { speaker: 'B', text: 'Maybe, but we learned a lot.' },
      { speaker: 'A', text: 'True, lesson noted.' },
    ],
    note: `Reflect: "In hindsight, we moved too fast."`,
    audio: 'c1-dl-020.ogg',
  },
];
