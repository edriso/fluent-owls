/**
 * B2 (upper-intermediate) role-play dialogues.
 *
 * Confident exchanges for real discussions: negotiating, pushing back,
 * feedback, managing expectations, and reassuring. Shadow both sides.
 */
import type { Dialogue } from '../types';

export const b2Dialogues: Dialogue[] = [
  {
    id: 'b2-dl-001',
    situation: 'Negotiating a price',
    turns: [
      { speaker: 'A', text: 'Could we meet in the middle on the price?' },
      { speaker: 'B', text: "I'm open to that. What did you have in mind?" },
      { speaker: 'A', text: 'How about we split the difference?' },
    ],
    note: `Negotiate with "Could we meet in the middle?" and "split the difference".`,
    audio: 'b2-dl-001.ogg',
  },
  {
    id: 'b2-dl-002',
    situation: 'Pushing back on a plan',
    turns: [
      { speaker: 'A', text: 'I think we should launch now.' },
      { speaker: 'B', text: "I get where you're coming from, but it feels rushed." },
      { speaker: 'A', text: "That's a fair point." },
    ],
    note: `Push back diplomatically: "I get where you're coming from, but..."`,
    audio: 'b2-dl-002.ogg',
  },
  {
    id: 'b2-dl-003',
    situation: 'Giving honest feedback',
    turns: [
      { speaker: 'A', text: 'Can I give you some honest feedback?' },
      { speaker: 'B', text: "Please do, I'd appreciate it." },
      { speaker: 'A', text: 'The intro is strong, but the ending drags a bit.' },
    ],
    note: `Ask first: "Can I give you some honest feedback?"`,
    audio: 'b2-dl-003.ogg',
  },
  {
    id: 'b2-dl-004',
    situation: 'Managing expectations',
    turns: [
      { speaker: 'A', text: 'Will it be ready today?' },
      { speaker: 'B', text: "I'll do my best, but I can't promise anything." },
      { speaker: 'A', text: 'Understood, just keep me posted.' },
    ],
    note: `Manage expectations: "I'll do my best, but I can't promise anything."`,
    audio: 'b2-dl-004.ogg',
  },
  {
    id: 'b2-dl-005',
    situation: 'Reassuring a colleague',
    turns: [
      { speaker: 'A', text: "I'm worried I messed up the presentation." },
      { speaker: 'B', text: "Don't be so hard on yourself. It went fine." },
      { speaker: 'A', text: 'Thanks, I needed to hear that.' },
    ],
    note: `Reassure with "Don't be so hard on yourself."`,
    audio: 'b2-dl-005.ogg',
  },
  {
    id: 'b2-dl-006',
    situation: 'Telling an anecdote',
    turns: [
      { speaker: 'A', text: "You won't believe what happened to me." },
      { speaker: 'B', text: 'Oh no, what now?' },
      { speaker: 'A', text: 'Long story short, I locked myself out again.' },
    ],
    note: `Open a story with "You won't believe what happened." then "Long story short..."`,
    audio: 'b2-dl-006.ogg',
  },
  {
    id: 'b2-dl-007',
    situation: 'A budget discussion',
    turns: [
      { speaker: 'A', text: 'We should cut the budget.' },
      { speaker: 'B', text: "I'm not so sure that's the answer." },
      { speaker: 'A', text: "Fair, let's look at the numbers." },
    ],
    note: `Disagree softly: "I'm not so sure that's the answer."`,
    audio: 'b2-dl-007.ogg',
  },
  {
    id: 'b2-dl-008',
    situation: 'Clearing up a misunderstanding',
    turns: [
      { speaker: 'A', text: "So you're saying we should wait?" },
      { speaker: 'B', text: "Not exactly. I'm saying we should test first." },
      { speaker: 'A', text: 'Ah, that makes more sense.' },
    ],
    note: `Correct a misread: "Not exactly. I'm saying..."`,
    audio: 'b2-dl-008.ogg',
  },
  {
    id: 'b2-dl-009',
    situation: 'Declining a favor',
    turns: [
      { speaker: 'A', text: 'Can you cover my shift?' },
      { speaker: 'B', text: "I'd love to help, but I'm swamped this week." },
      { speaker: 'A', text: "No worries, I'll ask someone else." },
    ],
    note: `Decline with a reason: "I'd love to help, but I'm swamped."`,
    audio: 'b2-dl-009.ogg',
  },
  {
    id: 'b2-dl-010',
    situation: 'Reaching a compromise',
    turns: [
      { speaker: 'A', text: 'I really think red is better.' },
      { speaker: 'B', text: "Let's go with red for now and review it later." },
      { speaker: 'A', text: 'Deal.' },
    ],
    note: `Compromise: "Let's go with red for now and review it later."`,
    audio: 'b2-dl-010.ogg',
  },
  {
    id: 'b2-dl-011',
    situation: 'Behind schedule',
    turns: [
      { speaker: 'A', text: "We're behind schedule." },
      { speaker: 'B', text: 'What if we bring in some extra help?' },
      { speaker: 'A', text: 'That might just work.' },
    ],
    note: `Offer a fix as a question: "What if we bring in extra help?"`,
    audio: 'b2-dl-011.ogg',
  },
  {
    id: 'b2-dl-012',
    situation: 'Softening criticism',
    turns: [
      { speaker: 'A', text: 'The design feels a bit cluttered.' },
      { speaker: 'B', text: "Yeah, I see what you mean. I'll simplify it." },
      { speaker: 'A', text: 'Even small changes would help.' },
    ],
    note: `Accept criticism well: "Yeah, I see what you mean. I'll simplify it."`,
    audio: 'b2-dl-012.ogg',
  },
  {
    id: 'b2-dl-013',
    situation: 'Setting a boundary',
    turns: [
      { speaker: 'A', text: 'Can you stay late again tonight?' },
      { speaker: 'B', text: "I'd rather not, I have plans." },
      { speaker: 'A', text: "No problem, we'll manage." },
    ],
    note: `Set a boundary kindly: "I'd rather not, I have plans."`,
    audio: 'b2-dl-013.ogg',
  },
  {
    id: 'b2-dl-014',
    situation: 'Double-checking a deadline',
    turns: [
      { speaker: 'A', text: "Correct me if I'm wrong, but this is due Monday?" },
      { speaker: 'B', text: "That's right, first thing." },
      { speaker: 'A', text: "Great, I'm on it." },
    ],
    note: `Double-check: "Correct me if I'm wrong, but this is due Monday?"`,
    audio: 'b2-dl-014.ogg',
  },
  {
    id: 'b2-dl-015',
    situation: 'Expressing doubt',
    turns: [
      { speaker: 'A', text: 'This plan looks perfect.' },
      { speaker: 'B', text: "I'm not entirely convinced, to be honest." },
      { speaker: 'A', text: "What's bothering you about it?" },
    ],
    note: `Voice doubt politely: "I'm not entirely convinced, to be honest."`,
    audio: 'b2-dl-015.ogg',
  },
  {
    id: 'b2-dl-016',
    situation: 'Encouraging a big decision',
    turns: [
      { speaker: 'A', text: "I'm thinking of changing careers." },
      { speaker: 'B', text: "That's a big step, but go for it." },
      { speaker: 'A', text: 'You really think so?' },
    ],
    note: `Encourage a leap: "That's a big step, but go for it."`,
    audio: 'b2-dl-016.ogg',
  },
  {
    id: 'b2-dl-017',
    situation: 'A proper apology',
    turns: [
      { speaker: 'A', text: 'I owe you an apology for yesterday.' },
      { speaker: 'B', text: "I appreciate that. It's water under the bridge." },
      { speaker: 'A', text: 'Thanks for understanding.' },
    ],
    note: `Accept an apology: "It's water under the bridge."`,
    audio: 'b2-dl-017.ogg',
  },
  {
    id: 'b2-dl-018',
    situation: 'Turning the conversation around',
    turns: [
      { speaker: 'A', text: "Anyway, that's enough about me." },
      { speaker: 'B', text: 'No, I want to hear more!' },
      { speaker: 'A', text: 'Maybe later. Tell me about you.' },
    ],
    note: `Redirect attention: "Anyway, that's enough about me."`,
    audio: 'b2-dl-018.ogg',
  },
  {
    id: 'b2-dl-019',
    situation: 'Hedging about an outcome',
    turns: [
      { speaker: 'A', text: 'Will the deal go through?' },
      { speaker: 'B', text: "It's hard to say at this point." },
      { speaker: 'A', text: 'Fingers crossed, then.' },
    ],
    note: `Hedge honestly: "It's hard to say at this point."`,
    audio: 'b2-dl-019.ogg',
  },
  {
    id: 'b2-dl-020',
    situation: 'Wrapping up a meeting',
    turns: [
      { speaker: 'A', text: "I think we've covered everything." },
      { speaker: 'B', text: "Agreed. Let's circle back next week." },
      { speaker: 'A', text: 'Sounds like a plan.' },
    ],
    note: `Wrap up: "Let's circle back next week."`,
    audio: 'b2-dl-020.ogg',
  },
  {
    id: 'b2-dl-021',
    situation: 'Negotiating a deadline',
    turns: [
      { speaker: 'A', text: 'Could we push the deadline back a bit?' },
      { speaker: 'B', text: 'How much time were you thinking?' },
      { speaker: 'A', text: 'A couple of days would help.' },
    ],
    note: `"push the deadline back" means move it to a later date.`,
    audio: 'b2-dl-021.ogg',
  },
  {
    id: 'b2-dl-022',
    situation: 'Giving feedback',
    turns: [
      { speaker: 'A', text: "Overall it's strong, but the intro drags." },
      { speaker: 'B', text: "Fair point, I'll tighten it up." },
      { speaker: 'A', text: 'Perfect, that should do it.' },
    ],
    note: `"I'll tighten it up" means make it shorter and sharper.`,
    audio: 'b2-dl-022.ogg',
  },
  {
    id: 'b2-dl-023',
    situation: 'Small talk at an event',
    turns: [
      { speaker: 'A', text: 'So, how do you know the host?' },
      { speaker: 'B', text: 'We used to work together. You?' },
      { speaker: 'A', text: 'Old university friends.' },
    ],
    note: `"How do you know the host?" is a classic event opener.`,
    audio: 'b2-dl-023.ogg',
  },
  {
    id: 'b2-dl-024',
    situation: 'Handling a complaint',
    turns: [
      { speaker: 'A', text: "I'm afraid my order arrived damaged." },
      { speaker: 'B', text: "I'm so sorry, we'll replace it right away." },
      { speaker: 'A', text: 'I appreciate that, thank you.' },
    ],
    note: `"I'm afraid ..." softens bad news politely.`,
    audio: 'b2-dl-024.ogg',
  },
  {
    id: 'b2-dl-025',
    situation: 'Weighing two options',
    turns: [
      { speaker: 'A', text: 'Should we drive or take the train?' },
      { speaker: 'B', text: "The train's less hassle, to be honest." },
      { speaker: 'A', text: "Good shout, let's do that." },
    ],
    note: `"Good shout" is informal for "good idea".`,
    audio: 'b2-dl-025.ogg',
  },
  {
    id: 'b2-dl-026',
    situation: 'Declining an invitation',
    turns: [
      { speaker: 'A', text: 'Can you join us on Friday?' },
      { speaker: 'B', text: "I'd love to, but I'm tied up that day." },
      { speaker: 'A', text: 'No problem, next time.' },
    ],
    note: `"I'm tied up" means too busy or already committed.`,
    audio: 'b2-dl-026.ogg',
  },
  {
    id: 'b2-dl-027',
    situation: 'Delegating a task',
    turns: [
      { speaker: 'A', text: 'Could you take the lead on the report?' },
      { speaker: 'B', text: 'Happy to. When do you need it by?' },
      { speaker: 'A', text: 'End of next week would be ideal.' },
    ],
    note: `"take the lead on" means be the main person responsible.`,
    audio: 'b2-dl-027.ogg',
  },
  {
    id: 'b2-dl-028',
    situation: 'Pushing back on a deadline',
    turns: [
      { speaker: 'A', text: 'Can you finish this by tonight?' },
      { speaker: 'B', text: "Honestly, that's not realistic, but tomorrow morning is." },
      { speaker: 'A', text: 'Okay, tomorrow morning works.' },
    ],
    note: `Offer an alternative: "that's not realistic, but ... is."`,
    audio: 'b2-dl-028.ogg',
  },
  {
    id: 'b2-dl-029',
    situation: 'Networking about careers',
    turns: [
      { speaker: 'A', text: 'What got you into this field?' },
      { speaker: 'B', text: 'A summer internship, almost by accident.' },
      { speaker: 'A', text: 'Funny how those things work out.' },
    ],
    note: `"What got you into ...?" asks how someone started.`,
    audio: 'b2-dl-029.ogg',
  },
  {
    id: 'b2-dl-030',
    situation: 'Resolving a double-booking',
    turns: [
      { speaker: 'A', text: 'It seems we booked the room twice.' },
      { speaker: 'B', text: "Let me check; you can have it, we'll move." },
      { speaker: 'A', text: "That's very kind, thank you." },
    ],
    note: `"It seems ..." raises a problem gently, without blame.`,
    audio: 'b2-dl-030.ogg',
  },
  {
    id: 'b2-dl-031',
    situation: 'Explaining a process',
    turns: [
      { speaker: 'A', text: 'How do I submit the form?' },
      { speaker: 'B', text: 'Upload it, then hit approve at the bottom.' },
      { speaker: 'A', text: 'Ah, I missed that button.' },
    ],
    note: `Give steps clearly: "Upload it, then hit approve."`,
    audio: 'b2-dl-031.ogg',
  },
  {
    id: 'b2-dl-032',
    situation: 'Softening bad news',
    turns: [
      { speaker: 'A', text: "I'm afraid the client said no." },
      { speaker: 'B', text: "That's disappointing, but not the end." },
      { speaker: 'A', text: "Agreed, let's see what we learn from it." },
    ],
    note: `"That's disappointing, but ..." keeps a setback in perspective.`,
    audio: 'b2-dl-032.ogg',
  },
];
