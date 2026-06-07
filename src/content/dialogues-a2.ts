/**
 * A2 (elementary) role-play dialogues.
 *
 * Everyday social exchanges, a little longer than A1. Listen, then shadow both
 * speakers so you practise the question and the natural reply.
 */
import type { Dialogue } from '../types';

export const a2Dialogues: Dialogue[] = [
  {
    id: 'a2-dl-001',
    situation: 'Talking about the weekend',
    turns: [
      { speaker: 'A', text: 'What are you up to this weekend?' },
      { speaker: 'B', text: 'Not much. How about you?' },
      { speaker: 'A', text: "I'm thinking of going hiking." },
      { speaker: 'B', text: 'Sounds fun!' },
    ],
    note: `"What are you up to?" is casual for "what are your plans". Bounce back "How about you?"`,
    audio: 'a2-dl-001.ogg',
  },
  {
    id: 'a2-dl-002',
    situation: 'At a restaurant',
    turns: [
      { speaker: 'A', text: 'Could I see the menu, please?' },
      { speaker: 'B', text: 'Of course. Here you are.' },
      { speaker: 'A', text: 'Thanks. What do you recommend?' },
    ],
    note: `Ask for a tip: "What do you recommend?" gets you the best dish.`,
    audio: 'a2-dl-002.ogg',
  },
  {
    id: 'a2-dl-003',
    situation: 'Inviting a friend over',
    turns: [
      { speaker: 'A', text: 'Do you want to come over tonight?' },
      { speaker: 'B', text: "I'd love to, but I'm busy." },
      { speaker: 'A', text: 'No worries, maybe tomorrow.' },
    ],
    note: `Decline softly with "I'd love to, but..." to keep it warm.`,
    audio: 'a2-dl-003.ogg',
  },
  {
    id: 'a2-dl-004',
    situation: 'Asking a coworker for help',
    turns: [
      { speaker: 'A', text: 'Could you help me with this?' },
      { speaker: 'B', text: "Sure, what's up?" },
      { speaker: 'A', text: "I can't open this file." },
    ],
    note: `"What's up?" here means "what do you need?" Offer help, then explain.`,
    audio: 'a2-dl-004.ogg',
  },
  {
    id: 'a2-dl-005',
    situation: 'Monday small talk',
    turns: [
      { speaker: 'A', text: 'How was your weekend?' },
      { speaker: 'B', text: 'It was great, thanks. We went to the beach.' },
      { speaker: 'A', text: 'Nice! The weather was perfect.' },
    ],
    note: `Answer "How was your weekend?" with a feeling plus one fact.`,
    audio: 'a2-dl-005.ogg',
  },
  {
    id: 'a2-dl-006',
    situation: 'Shopping for a gift',
    turns: [
      { speaker: 'A', text: "I'm looking for a gift for my mom." },
      { speaker: 'B', text: 'What does she like?' },
      { speaker: 'A', text: 'She loves books.' },
    ],
    note: `Help a shopper by asking "What does she like?"`,
    audio: 'a2-dl-006.ogg',
  },
  {
    id: 'a2-dl-007',
    situation: 'Asking how far something is',
    turns: [
      { speaker: 'A', text: 'Is the bank far from here?' },
      { speaker: 'B', text: "No, it's a five-minute walk." },
      { speaker: 'A', text: 'Great, thanks a lot.' },
    ],
    note: `Give distance in time: "a five-minute walk".`,
    audio: 'a2-dl-007.ogg',
  },
  {
    id: 'a2-dl-008',
    situation: 'Canceling a plan',
    turns: [
      { speaker: 'A', text: "I'm sorry, I can't make it tonight." },
      { speaker: 'B', text: "Oh, that's too bad. Everything okay?" },
      { speaker: 'A', text: 'Yeah, just tired.' },
    ],
    note: `Show care with "Everything okay?" when someone cancels.`,
    audio: 'a2-dl-008.ogg',
  },
  {
    id: 'a2-dl-009',
    situation: 'Ordering coffee',
    turns: [
      { speaker: 'A', text: "I'll have a latte, please." },
      { speaker: 'B', text: 'Anything else?' },
      { speaker: 'A', text: "No, that's all." },
    ],
    note: `"Anything else?" then "No, that's all." closes an order.`,
    audio: 'a2-dl-009.ogg',
  },
  {
    id: 'a2-dl-010',
    situation: 'Asking for a ride',
    turns: [
      { speaker: 'A', text: 'Could you give me a ride?' },
      { speaker: 'B', text: 'Sure, no problem. When?' },
      { speaker: 'A', text: 'Around eight?' },
    ],
    note: `Agree to a favor and ask the detail: "Sure, no problem. When?"`,
    audio: 'a2-dl-010.ogg',
  },
  {
    id: 'a2-dl-011',
    situation: 'Giving a compliment',
    turns: [
      { speaker: 'A', text: 'I like your jacket!' },
      { speaker: 'B', text: 'Oh, thank you! I got it on sale.' },
      { speaker: 'A', text: 'Nice find.' },
    ],
    note: `Take a compliment with "Thank you!" plus a little detail.`,
    audio: 'a2-dl-011.ogg',
  },
  {
    id: 'a2-dl-012',
    situation: 'Apologizing for forgetting',
    turns: [
      { speaker: 'A', text: 'Sorry I forgot to call you back.' },
      { speaker: 'B', text: "It's okay, don't worry about it." },
      { speaker: 'A', text: 'Let me make it up to you.' },
    ],
    note: `Offer to fix things: "Let me make it up to you."`,
    audio: 'a2-dl-012.ogg',
  },
  {
    id: 'a2-dl-013',
    situation: 'Setting a meeting time',
    turns: [
      { speaker: 'A', text: 'What time should we meet?' },
      { speaker: 'B', text: 'How about seven?' },
      { speaker: 'A', text: 'Seven works for me.' },
    ],
    note: `Suggest a time with "How about seven?" and confirm "works for me".`,
    audio: 'a2-dl-013.ogg',
  },
  {
    id: 'a2-dl-014',
    situation: 'Noticing a friend is tired',
    turns: [
      { speaker: 'A', text: 'You look tired. Are you okay?' },
      { speaker: 'B', text: "I didn't sleep well." },
      { speaker: 'A', text: 'Take it easy today.' },
    ],
    note: `Notice and care: "You look tired. Are you okay?"`,
    audio: 'a2-dl-014.ogg',
  },
  {
    id: 'a2-dl-015',
    situation: 'Setting up a talk at work',
    turns: [
      { speaker: 'A', text: 'Can we talk after lunch?' },
      { speaker: 'B', text: 'Sure, is everything alright?' },
      { speaker: 'A', text: "Yeah, it's nothing serious." },
    ],
    note: `"Is everything alright?" checks in before a serious talk.`,
    audio: 'a2-dl-015.ogg',
  },
  {
    id: 'a2-dl-016',
    situation: 'A wrong order',
    turns: [
      { speaker: 'A', text: "Excuse me, this isn't what I ordered." },
      { speaker: 'B', text: "Oh, I'm so sorry. I'll fix it." },
      { speaker: 'A', text: 'Thank you.' },
    ],
    note: `Politely flag a problem: "Excuse me, this isn't what I ordered."`,
    audio: 'a2-dl-016.ogg',
  },
  {
    id: 'a2-dl-017',
    situation: 'Inviting to a barbecue',
    turns: [
      { speaker: 'A', text: "We're having a barbecue on Saturday." },
      { speaker: 'B', text: 'That sounds great! Can I bring anything?' },
      { speaker: 'A', text: 'Just yourself!' },
    ],
    note: `Offer to help at a party: "Can I bring anything?"`,
    audio: 'a2-dl-017.ogg',
  },
  {
    id: 'a2-dl-018',
    situation: 'Asking an opinion while shopping',
    turns: [
      { speaker: 'A', text: 'What do you think of this one?' },
      { speaker: 'B', text: 'I like it, but the blue one is nicer.' },
      { speaker: 'A', text: 'Good point.' },
    ],
    note: `Soften a different opinion: "I like it, but the blue one is nicer."`,
    audio: 'a2-dl-018.ogg',
  },
  {
    id: 'a2-dl-019',
    situation: 'Taking a phone message',
    turns: [
      { speaker: 'A', text: 'Can I take a message?' },
      { speaker: 'B', text: 'Yes, please tell him Alex called.' },
      { speaker: 'A', text: "Sure, I'll let him know." },
    ],
    note: `Take a message: "Can I take a message?" then "I'll let him know."`,
    audio: 'a2-dl-019.ogg',
  },
  {
    id: 'a2-dl-020',
    situation: 'Leaving after a visit',
    turns: [
      { speaker: 'A', text: 'Thanks for coming!' },
      { speaker: 'B', text: 'Thanks for having me. It was fun.' },
      { speaker: 'A', text: "Let's do it again soon." },
    ],
    note: `End a visit with "Thanks for having me." and "Let's do it again soon."`,
    audio: 'a2-dl-020.ogg',
  },
  {
    id: 'a2-dl-021',
    situation: 'Making weekend plans',
    turns: [
      { speaker: 'A', text: 'Are you free this weekend?' },
      { speaker: 'B', text: "I think so. What's up?" },
      { speaker: 'A', text: 'Do you want to see a film?' },
    ],
    note: `Open plans with "Are you free this weekend?"`,
    audio: 'a2-dl-021.ogg',
  },
  {
    id: 'a2-dl-022',
    situation: 'Checking in at a hotel',
    turns: [
      { speaker: 'A', text: 'I have a booking under Lee.' },
      { speaker: 'B', text: 'Let me check. Yes, room 12.' },
      { speaker: 'A', text: 'Great, thank you.' },
    ],
    note: `Check in with "I have a booking under ..." plus your name.`,
    audio: 'a2-dl-022.ogg',
  },
  {
    id: 'a2-dl-023',
    situation: 'Returning an item',
    turns: [
      { speaker: 'A', text: "I'd like to return this, please." },
      { speaker: 'B', text: 'Sure, do you have the receipt?' },
      { speaker: 'A', text: 'Yes, here it is.' },
    ],
    note: `"I'd like to return this." Keep the receipt ready.`,
    audio: 'a2-dl-023.ogg',
  },
  {
    id: 'a2-dl-024',
    situation: 'Talking about the weekend',
    turns: [
      { speaker: 'A', text: 'How was your weekend?' },
      { speaker: 'B', text: 'Pretty good, I went hiking.' },
      { speaker: 'A', text: 'Nice, that sounds fun.' },
    ],
    note: `React with "That sounds fun." to keep the chat going.`,
    audio: 'a2-dl-024.ogg',
  },
  {
    id: 'a2-dl-025',
    situation: 'Asking a small favour',
    turns: [
      { speaker: 'A', text: 'Could you give me a hand?' },
      { speaker: 'B', text: 'Sure, what do you need?' },
      { speaker: 'A', text: 'Just hold this for a second.' },
    ],
    note: `"Could you give me a hand?" is a friendly way to ask for help.`,
    audio: 'a2-dl-025.ogg',
  },
  {
    id: 'a2-dl-026',
    situation: 'Arriving late',
    turns: [
      { speaker: 'A', text: "Sorry I'm late, the bus was delayed." },
      { speaker: 'B', text: 'No worries, we just started.' },
      { speaker: 'A', text: 'Phew, thanks.' },
    ],
    note: `Explain briefly: "the bus was delayed." Then move on.`,
    audio: 'a2-dl-026.ogg',
  },
];
