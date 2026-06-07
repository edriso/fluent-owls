/**
 * B1 (intermediate) role-play dialogues.
 *
 * Real conversations: work requests, opinions, problems, plans, and catching up.
 * Listen, then shadow both speakers to practise natural give-and-take.
 */
import type { Dialogue } from '../types';

export const b1Dialogues: Dialogue[] = [
  {
    id: 'b1-dl-001',
    situation: 'A request at work',
    turns: [
      { speaker: 'A', text: 'Would you mind sending me the report?' },
      { speaker: 'B', text: "Not at all. I'll do it now." },
      { speaker: 'A', text: 'Thanks, I appreciate it.' },
    ],
    note: `Accept a request warmly: "Not at all. I'll do it now."`,
    audio: 'b1-dl-001.ogg',
  },
  {
    id: 'b1-dl-002',
    situation: 'After a meeting',
    turns: [
      { speaker: 'A', text: 'What did you think of the meeting?' },
      { speaker: 'B', text: 'Honestly, it ran a bit long.' },
      { speaker: 'A', text: 'Yeah, I felt the same.' },
    ],
    note: `Give a soft opinion: "Honestly, it ran a bit long." then agree: "I felt the same."`,
    audio: 'b1-dl-002.ogg',
  },
  {
    id: 'b1-dl-003',
    situation: 'A tech problem',
    turns: [
      { speaker: 'A', text: 'My laptop keeps crashing.' },
      { speaker: 'B', text: 'Have you tried restarting it?' },
      { speaker: 'A', text: "Good idea, I'll try that." },
    ],
    note: `Give advice as a question: "Have you tried restarting it?"`,
    audio: 'b1-dl-003.ogg',
  },
  {
    id: 'b1-dl-004',
    situation: 'Suggesting dinner',
    turns: [
      { speaker: 'A', text: 'We should grab dinner sometime.' },
      { speaker: 'B', text: 'Definitely! How about Friday?' },
      { speaker: 'A', text: 'Friday works for me.' },
    ],
    note: `Float a plan with "We should..." then pin it down: "How about Friday?"`,
    audio: 'b1-dl-004.ogg',
  },
  {
    id: 'b1-dl-005',
    situation: 'Catching up',
    turns: [
      { speaker: 'A', text: "It's been ages! How have you been?" },
      { speaker: 'B', text: 'Pretty good, just busy with work. You?' },
      { speaker: 'A', text: "Same here, can't complain." },
    ],
    note: `Reconnect with "It's been ages!" and reply "can't complain".`,
    audio: 'b1-dl-005.ogg',
  },
  {
    id: 'b1-dl-006',
    situation: 'A gentle disagreement',
    turns: [
      { speaker: 'A', text: 'I think we should wait.' },
      { speaker: 'B', text: "I see your point, but we're running out of time." },
      { speaker: 'A', text: 'Fair enough.' },
    ],
    note: `Disagree gently: "I see your point, but..." then accept: "Fair enough."`,
    audio: 'b1-dl-006.ogg',
  },
  {
    id: 'b1-dl-007',
    situation: 'Asking to leave early',
    turns: [
      { speaker: 'A', text: 'Could I leave early today?' },
      { speaker: 'B', text: 'Sure, is everything okay?' },
      { speaker: 'A', text: "Yeah, just a doctor's appointment." },
    ],
    note: `Ask permission: "Could I leave early today?" and give a short reason.`,
    audio: 'b1-dl-007.ogg',
  },
  {
    id: 'b1-dl-008',
    situation: 'No reservation',
    turns: [
      { speaker: 'A', text: 'Do you have a table for two?' },
      { speaker: 'B', text: 'Do you have a reservation?' },
      { speaker: 'A', text: "No, we don't. Is that a problem?" },
    ],
    note: `Handle "no reservation" smoothly: "Is that a problem?"`,
    audio: 'b1-dl-008.ogg',
  },
  {
    id: 'b1-dl-009',
    situation: 'Getting something explained',
    turns: [
      { speaker: 'A', text: 'Could you walk me through this?' },
      { speaker: 'B', text: 'Of course. Where should I start?' },
      { speaker: 'A', text: "From the beginning, if you don't mind." },
    ],
    note: `Ask for a full explanation: "Could you walk me through this?"`,
    audio: 'b1-dl-009.ogg',
  },
  {
    id: 'b1-dl-010',
    situation: 'Arriving late to a meeting',
    turns: [
      { speaker: 'A', text: "Sorry I'm late, the traffic was terrible." },
      { speaker: 'B', text: 'No worries, we just started.' },
      { speaker: 'A', text: "Phew, glad I didn't miss anything." },
    ],
    note: `Reassure a latecomer: "No worries, we just started."`,
    audio: 'b1-dl-010.ogg',
  },
  {
    id: 'b1-dl-011',
    situation: 'Moving a meeting',
    turns: [
      { speaker: 'A', text: 'Can we push the meeting to three?' },
      { speaker: 'B', text: 'Let me check. Yes, that works.' },
      { speaker: 'A', text: 'Perfect, thanks for being flexible.' },
    ],
    note: `Ask to move a meeting: "Can we push the meeting to three?"`,
    audio: 'b1-dl-011.ogg',
  },
  {
    id: 'b1-dl-012',
    situation: 'Recommending a movie',
    turns: [
      { speaker: 'A', text: 'Have you seen any good movies lately?' },
      { speaker: 'B', text: "Yeah, I'd really recommend the new one." },
      { speaker: 'A', text: "Oh nice, I'll check it out." },
    ],
    note: `Recommend with "I'd really recommend..." and react "I'll check it out."`,
    audio: 'b1-dl-012.ogg',
  },
  {
    id: 'b1-dl-013',
    situation: 'A mistake on the bill',
    turns: [
      { speaker: 'A', text: "I think there's a mistake on my bill." },
      { speaker: 'B', text: "Let me take a look. You're right, sorry." },
      { speaker: 'A', text: 'No problem, thanks for sorting it.' },
    ],
    note: `Flag an error politely: "I think there's a mistake on my bill."`,
    audio: 'b1-dl-013.ogg',
  },
  {
    id: 'b1-dl-014',
    situation: 'Before an interview',
    turns: [
      { speaker: 'A', text: "I'm nervous about the interview." },
      { speaker: 'B', text: "You'll do great. Just be yourself." },
      { speaker: 'A', text: 'Thanks, that helps.' },
    ],
    note: `Encourage with "You'll do great. Just be yourself."`,
    audio: 'b1-dl-014.ogg',
  },
  {
    id: 'b1-dl-015',
    situation: 'Offering to help',
    turns: [
      { speaker: 'A', text: 'Do you need a hand with those bags?' },
      { speaker: 'B', text: 'Oh, that would be great, thanks.' },
      { speaker: 'A', text: 'No problem at all.' },
    ],
    note: `Offer help: "Do you need a hand with those bags?"`,
    audio: 'b1-dl-015.ogg',
  },
  {
    id: 'b1-dl-016',
    situation: 'A tight deadline',
    turns: [
      { speaker: 'A', text: 'Could you do it by Friday?' },
      { speaker: 'B', text: "Friday's tight, but I'll try." },
      { speaker: 'A', text: 'I really appreciate that.' },
    ],
    note: `Push gently and stay honest: "Friday's tight, but I'll try."`,
    audio: 'b1-dl-016.ogg',
  },
  {
    id: 'b1-dl-017',
    situation: 'Planning to reconnect',
    turns: [
      { speaker: 'A', text: 'We should catch up properly soon.' },
      { speaker: 'B', text: "Definitely. Let's grab a coffee next week." },
      { speaker: 'A', text: "Sounds good, I'll text you." },
    ],
    note: `Turn "we should" into action: "Let's grab a coffee next week."`,
    audio: 'b1-dl-017.ogg',
  },
  {
    id: 'b1-dl-018',
    situation: 'Confirming a deadline',
    turns: [
      { speaker: 'A', text: 'So, just to confirm, you need it tomorrow?' },
      { speaker: 'B', text: 'Exactly, by the end of the day.' },
      { speaker: 'A', text: "Got it, I'll make it happen." },
    ],
    note: `Confirm with "So, just to confirm..." then "Got it, I'll make it happen."`,
    audio: 'b1-dl-018.ogg',
  },
  {
    id: 'b1-dl-019',
    situation: 'A friend had a hard day',
    turns: [
      { speaker: 'A', text: 'I had a really rough day.' },
      { speaker: 'B', text: 'Oh no, what happened?' },
      { speaker: 'A', text: "I'd rather not get into it right now." },
    ],
    note: `Decline to share, kindly: "I'd rather not get into it right now."`,
    audio: 'b1-dl-019.ogg',
  },
  {
    id: 'b1-dl-020',
    situation: 'Thanking a friend',
    turns: [
      { speaker: 'A', text: 'Thanks so much for your help today.' },
      { speaker: 'B', text: "Anytime, that's what friends are for." },
      { speaker: 'A', text: 'I owe you one.' },
    ],
    note: `"That's what friends are for." and "I owe you one." for warm thanks.`,
    audio: 'b1-dl-020.ogg',
  },
  {
    id: 'b1-dl-021',
    situation: 'Checking on a task',
    turns: [
      { speaker: 'A', text: 'Have you finished the report?' },
      { speaker: 'B', text: 'Almost, I just need to check the figures.' },
      { speaker: 'A', text: 'No rush, take your time.' },
    ],
    note: `Soften pressure with "No rush, take your time."`,
    audio: 'b1-dl-021.ogg',
  },
  {
    id: 'b1-dl-022',
    situation: 'Catching up with a friend',
    turns: [
      { speaker: 'A', text: 'Long time no see! How have you been?' },
      { speaker: 'B', text: 'Busy, but good. And you?' },
      { speaker: 'A', text: "Can't complain, really." },
    ],
    note: `"Long time no see!" and "Can't complain" are warm, natural openers.`,
    audio: 'b1-dl-022.ogg',
  },
  {
    id: 'b1-dl-023',
    situation: 'Splitting the bill',
    turns: [
      { speaker: 'A', text: "Why don't we split the bill?" },
      { speaker: 'B', text: "Good idea, that's easier." },
      { speaker: 'A', text: "Let's do that then." },
    ],
    note: `Suggest something with "Why don't we ...?"`,
    audio: 'b1-dl-023.ogg',
  },
  {
    id: 'b1-dl-024',
    situation: 'Disagreeing gently',
    turns: [
      { speaker: 'A', text: 'I think we should leave early.' },
      { speaker: 'B', text: "I'm not so sure, traffic's worse then." },
      { speaker: 'A', text: "Fair enough, let's wait." },
    ],
    note: `"I'm not so sure" disagrees softly, without a flat "no".`,
    audio: 'b1-dl-024.ogg',
  },
  {
    id: 'b1-dl-025',
    situation: 'Asking for advice',
    turns: [
      { speaker: 'A', text: 'What would you do in my place?' },
      { speaker: 'B', text: "Honestly, I'd talk to her directly." },
      { speaker: 'A', text: "Yeah, maybe you're right." },
    ],
    note: `"What would you do in my place?" invites real advice.`,
    audio: 'b1-dl-025.ogg',
  },
  {
    id: 'b1-dl-026',
    situation: 'Offering support',
    turns: [
      { speaker: 'A', text: 'You look stressed, is everything okay?' },
      { speaker: 'B', text: 'Just a lot on my plate right now.' },
      { speaker: 'A', text: 'Let me know if I can help.' },
    ],
    note: `"a lot on my plate" means very busy or overloaded.`,
    audio: 'b1-dl-026.ogg',
  },
  {
    id: 'b1-dl-027',
    situation: 'Rescheduling a call',
    turns: [
      { speaker: 'A', text: 'Is now a good time to talk?' },
      { speaker: 'B', text: 'Actually, can we make it in ten minutes?' },
      { speaker: 'A', text: "No problem, I'll call back then." },
    ],
    note: `"Is now a good time?" lets the other person delay politely.`,
    audio: 'b1-dl-027.ogg',
  },
  {
    id: 'b1-dl-028',
    situation: 'Picking up a discussion',
    turns: [
      { speaker: 'A', text: 'Where were we before lunch?' },
      { speaker: 'B', text: 'We were deciding on the budget.' },
      { speaker: 'A', text: "Right, let's pick that up." },
    ],
    note: `"Where were we?" restarts a paused conversation.`,
    audio: 'b1-dl-028.ogg',
  },
  {
    id: 'b1-dl-029',
    situation: 'Asking for clarification',
    turns: [
      { speaker: 'A', text: 'Sorry, could you clarify what you mean?' },
      { speaker: 'B', text: 'Sure, I mean we should start sooner.' },
      { speaker: 'A', text: 'Got it, that makes sense.' },
    ],
    note: `"Could you clarify ...?" is a polite way to ask for detail.`,
    audio: 'b1-dl-029.ogg',
  },
  {
    id: 'b1-dl-030',
    situation: 'Encouraging a friend',
    turns: [
      { speaker: 'A', text: "I'm not sure I can do this." },
      { speaker: 'B', text: "You've handled worse than this before." },
      { speaker: 'A', text: 'True. Thanks, I needed that.' },
    ],
    note: `"You've handled worse before." is a warm way to reassure.`,
    audio: 'b1-dl-030.ogg',
  },
  {
    id: 'b1-dl-031',
    situation: 'Planning a trip',
    turns: [
      { speaker: 'A', text: 'Should we book the flights now?' },
      { speaker: 'B', text: 'Let me know if prices drop a bit.' },
      { speaker: 'A', text: "Good thinking, let's keep an eye on them." },
    ],
    note: `"keep an eye on" means watch something over time.`,
    audio: 'b1-dl-031.ogg',
  },
  {
    id: 'b1-dl-032',
    situation: 'Sorting out a mix-up',
    turns: [
      { speaker: 'A', text: "I think there's been a mistake with my order." },
      { speaker: 'B', text: 'Oh no, let me sort that out for you.' },
      { speaker: 'A', text: 'Thanks, I appreciate it.' },
    ],
    note: `"let me sort that out" offers to fix a problem.`,
    audio: 'b1-dl-032.ogg',
  },
];
