/**
 * C2 (mastery) role-play dialogues.
 *
 * High-register exchanges: persuasion, nuanced disagreement, vivid storytelling,
 * and high-stakes moments. The skill is carrying weight and grace at once.
 * Shadow both sides to absorb the timing of a truly fluent speaker.
 */
import type { Dialogue } from '../types';

export const c2Dialogues: Dialogue[] = [
  {
    id: 'c2-dl-001',
    situation: 'Winning someone over',
    turns: [
      { speaker: 'A', text: "I'm still on the fence." },
      { speaker: 'B', text: 'If anything, the risks of doing nothing are greater.' },
      { speaker: 'A', text: "When you put it that way, I'm convinced." },
    ],
    note: `Persuade: "If anything, the risks of doing nothing are greater."`,
    audio: 'c2-dl-001.ogg',
  },
  {
    id: 'c2-dl-002',
    situation: 'Softening a harsh judgment',
    turns: [
      { speaker: 'A', text: 'It was a complete failure.' },
      { speaker: 'B', text: "I wouldn't go so far as to say that." },
      { speaker: 'A', text: "Perhaps I'm being too harsh." },
    ],
    note: `Disagree with nuance: "I wouldn't go so far as to say that."`,
    audio: 'c2-dl-002.ogg',
  },
  {
    id: 'c2-dl-003',
    situation: 'Holding your ground',
    turns: [
      { speaker: 'A', text: 'The deadline has to move.' },
      { speaker: 'B', text: "Be that as it may, the client won't budge." },
      { speaker: 'A', text: "Then we'll have to find another way." },
    ],
    note: `Hold your ground: "Be that as it may, the client won't budge."`,
    audio: 'c2-dl-003.ogg',
  },
  {
    id: 'c2-dl-004',
    situation: 'Telling a vivid story',
    turns: [
      { speaker: 'A', text: 'How did the pitch go?' },
      { speaker: 'B', text: 'Out of nowhere, the projector died mid-sentence.' },
      { speaker: 'A', text: "You're kidding. What did you do?" },
    ],
    note: `Make a story vivid: "Out of nowhere, the projector died."`,
    audio: 'c2-dl-004.ogg',
  },
  {
    id: 'c2-dl-005',
    situation: 'Conceding then countering',
    turns: [
      { speaker: 'A', text: 'Our prices are too high.' },
      { speaker: 'B', text: "I'll grant you that, but our quality is unmatched." },
      { speaker: 'A', text: "That's a fair distinction." },
    ],
    note: `Concede then counter: "I'll grant you that, but our quality is unmatched."`,
    audio: 'c2-dl-005.ogg',
  },
  {
    id: 'c2-dl-006',
    situation: 'Reading the subtext',
    turns: [
      { speaker: 'A', text: "They said they'd think about it." },
      { speaker: 'B', text: "Reading between the lines, I'd say it's a no." },
      { speaker: 'A', text: "Sadly, I think you're right." },
    ],
    note: `Read subtext: "Reading between the lines, I'd say it's a no."`,
    audio: 'c2-dl-006.ogg',
  },
  {
    id: 'c2-dl-007',
    situation: 'A persuasive close',
    turns: [
      { speaker: 'A', text: 'Why should we choose you?' },
      { speaker: 'B', text: 'At the end of the day, results speak for themselves.' },
      { speaker: 'A', text: 'Hard to argue with that.' },
    ],
    note: `Close with weight: "At the end of the day, results speak for themselves."`,
    audio: 'c2-dl-007.ogg',
  },
  {
    id: 'c2-dl-008',
    situation: 'Firm but diplomatic',
    turns: [
      { speaker: 'A', text: 'Can we cut a few corners here?' },
      { speaker: 'B', text: "With all due respect, that's a slippery slope." },
      { speaker: 'A', text: 'Point taken.' },
    ],
    note: `Be firm but polite: "With all due respect, that's a slippery slope."`,
    audio: 'c2-dl-008.ogg',
  },
  {
    id: 'c2-dl-009',
    situation: 'Reframing the stakes',
    turns: [
      { speaker: 'A', text: "It's just a small mistake." },
      { speaker: 'B', text: 'In this context, even a small slip speaks volumes.' },
      { speaker: 'A', text: "You're right to flag it." },
    ],
    note: `Reframe the stakes: "Even a small slip speaks volumes."`,
    audio: 'c2-dl-009.ogg',
  },
  {
    id: 'c2-dl-010',
    situation: 'Staying calm under pressure',
    turns: [
      { speaker: 'A', text: 'Everything is falling apart!' },
      { speaker: 'B', text: "Let's not throw the baby out with the bathwater." },
      { speaker: 'A', text: "Okay, let's stay level-headed." },
    ],
    note: `Stay calm: "Let's not throw the baby out with the bathwater."`,
    audio: 'c2-dl-010.ogg',
  },
  {
    id: 'c2-dl-011',
    situation: 'Understating pride',
    turns: [
      { speaker: 'A', text: 'You must be thrilled.' },
      { speaker: 'B', text: "It's no small thing, I'll admit." },
      { speaker: 'A', text: "You've earned it." },
    ],
    note: `Understate pride: "It's no small thing, I'll admit."`,
    audio: 'c2-dl-011.ogg',
  },
  {
    id: 'c2-dl-012',
    situation: 'Flagging a risk to a boss',
    turns: [
      { speaker: 'A', text: 'I want it done my way.' },
      { speaker: 'B', text: "I hear you, but I'd be remiss not to flag the risk." },
      { speaker: 'A', text: 'Noted. Proceed, but document it.' },
    ],
    note: `Flag a risk upward: "I'd be remiss not to flag the risk."`,
    audio: 'c2-dl-012.ogg',
  },
  {
    id: 'c2-dl-013',
    situation: 'Protecting what works',
    turns: [
      { speaker: 'A', text: 'We could pivot the whole strategy.' },
      { speaker: 'B', text: "Let's not lose sight of what's working." },
      { speaker: 'A', text: 'Agreed, no need to reinvent the wheel.' },
    ],
    note: `Protect what works: "Let's not lose sight of what's working."`,
    audio: 'c2-dl-013.ogg',
  },
  {
    id: 'c2-dl-014',
    situation: 'Flipping the framing',
    turns: [
      { speaker: 'A', text: 'It feels risky to expand now.' },
      { speaker: 'B', text: 'On the contrary, hesitating could cost us the lead.' },
      { speaker: 'A', text: 'That reframes it nicely.' },
    ],
    note: `Flip the framing: "On the contrary, hesitating could cost us the lead."`,
    audio: 'c2-dl-014.ogg',
  },
  {
    id: 'c2-dl-015',
    situation: 'Winning graciously',
    turns: [
      { speaker: 'A', text: 'You were right all along.' },
      { speaker: 'B', text: "Let's just say we got there in the end." },
      { speaker: 'A', text: 'Gracious as ever.' },
    ],
    note: `Win graciously: "Let's just say we got there in the end."`,
    audio: 'c2-dl-015.ogg',
  },
  {
    id: 'c2-dl-016',
    situation: 'High praise',
    turns: [
      { speaker: 'A', text: 'Was the report any good?' },
      { speaker: 'B', text: "It's a feather in her cap, frankly." },
      { speaker: 'A', text: 'High praise, coming from you.' },
    ],
    note: `Praise highly: "It's a feather in her cap."`,
    audio: 'c2-dl-016.ogg',
  },
  {
    id: 'c2-dl-017',
    situation: 'Declining at a high level',
    turns: [
      { speaker: 'A', text: 'Would you join the board?' },
      { speaker: 'B', text: "I'm honored, but I'd be spreading myself too thin." },
      { speaker: 'A', text: 'Understood. The door stays open.' },
    ],
    note: `Decline gracefully: "I'd be spreading myself too thin."`,
    audio: 'c2-dl-017.ogg',
  },
  {
    id: 'c2-dl-018',
    situation: 'Hedging like an expert',
    turns: [
      { speaker: 'A', text: 'Will it work?' },
      { speaker: 'B', text: "In theory, yes, though I'd hedge my bets." },
      { speaker: 'A', text: 'Cautious optimism, then.' },
    ],
    note: `Hedge like an expert: "In theory, yes, though I'd hedge my bets."`,
    audio: 'c2-dl-018.ogg',
  },
  {
    id: 'c2-dl-019',
    situation: 'Closing an argument',
    turns: [
      { speaker: 'A', text: "So we're decided?" },
      { speaker: 'B', text: 'Suffice it to say, the case makes itself.' },
      { speaker: 'A', text: "Then let's proceed." },
    ],
    note: `Close an argument: "Suffice it to say, the case makes itself."`,
    audio: 'c2-dl-019.ogg',
  },
  {
    id: 'c2-dl-020',
    situation: 'Reflecting with wisdom',
    turns: [
      { speaker: 'A', text: 'Any regrets?' },
      { speaker: 'B', text: "If anything, I'd have trusted my instincts sooner." },
      { speaker: 'A', text: 'A lesson worth its weight.' },
    ],
    note: `Reflect with wisdom: "I'd have trusted my instincts sooner."`,
    audio: 'c2-dl-020.ogg',
  },
];
