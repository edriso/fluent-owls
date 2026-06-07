/**
 * A1 (beginner) role-play dialogues.
 *
 * Very short, high-frequency exchanges for everyday survival situations. The
 * learner listens, then shadows BOTH speakers out loud, so they practise asking
 * AND answering. Two voices in the audio make it feel like a real conversation.
 */
import type { Dialogue } from '../types';

export const a1Dialogues: Dialogue[] = [
  {
    id: 'a1-dl-001',
    situation: 'Ordering at a café',
    turns: [
      { speaker: 'A', text: 'Hi, can I get a coffee?' },
      { speaker: 'B', text: 'Sure. Small or large?' },
      { speaker: 'A', text: 'Small, please.' },
    ],
    note: `"Small or large?" is the classic choice question. Answer with just the word: "Small, please."`,
    audio: 'a1-dl-001.ogg',
  },
  {
    id: 'a1-dl-002',
    situation: 'Saying hello',
    turns: [
      { speaker: 'A', text: 'Hi! How are you?' },
      { speaker: 'B', text: "I'm good, thanks. And you?" },
      { speaker: 'A', text: "I'm great!" },
    ],
    note: `Bounce it back with "And you?" to keep a greeting going naturally.`,
    audio: 'a1-dl-002.ogg',
  },
  {
    id: 'a1-dl-003',
    situation: 'Buying something',
    turns: [
      { speaker: 'A', text: 'How much is this?' },
      { speaker: 'B', text: "It's ten dollars." },
      { speaker: 'A', text: "Okay, I'll take it." },
    ],
    note: `"I'll take it" is what natives say to buy something, not "I want to buy it".`,
    audio: 'a1-dl-003.ogg',
  },
  {
    id: 'a1-dl-004',
    situation: 'Asking for directions',
    turns: [
      { speaker: 'A', text: "Excuse me, where's the station?" },
      { speaker: 'B', text: "It's over there, on the left." },
      { speaker: 'A', text: 'Thank you!' },
    ],
    note: `Give directions with "over there" plus a side: "on the left".`,
    audio: 'a1-dl-004.ogg',
  },
  {
    id: 'a1-dl-005',
    situation: 'Ordering food',
    turns: [
      { speaker: 'A', text: 'Are you ready to order?' },
      { speaker: 'B', text: 'Yes, the chicken, please.' },
      { speaker: 'A', text: 'Good choice.' },
    ],
    note: `Order with just "the" plus the food: "the chicken, please."`,
    audio: 'a1-dl-005.ogg',
  },
  {
    id: 'a1-dl-006',
    situation: 'Meeting someone new',
    turns: [
      { speaker: 'A', text: "Hi, I'm Sam." },
      { speaker: 'B', text: "Nice to meet you, Sam. I'm Alex." },
      { speaker: 'A', text: 'Nice to meet you too.' },
    ],
    note: `Echo the greeting back: "Nice to meet you too."`,
    audio: 'a1-dl-006.ogg',
  },
  {
    id: 'a1-dl-007',
    situation: 'Answering the phone',
    turns: [
      { speaker: 'A', text: 'Hello?' },
      { speaker: 'B', text: 'Hi, is Sam there?' },
      { speaker: 'A', text: 'Speaking!' },
    ],
    note: `On the phone, answer "Speaking!" when someone asks for you by name.`,
    audio: 'a1-dl-007.ogg',
  },
  {
    id: 'a1-dl-008',
    situation: 'Making a lunch plan',
    turns: [
      { speaker: 'A', text: 'Do you want to get lunch?' },
      { speaker: 'B', text: 'Sure! What time?' },
      { speaker: 'A', text: 'At noon?' },
    ],
    note: `Move a plan forward with "Sure! What time?"`,
    audio: 'a1-dl-008.ogg',
  },
  {
    id: 'a1-dl-009',
    situation: 'Asking for help',
    turns: [
      { speaker: 'A', text: 'Can you help me?' },
      { speaker: 'B', text: 'Of course. What do you need?' },
      { speaker: 'A', text: 'Where is the exit?' },
    ],
    note: `Offer help with "Of course. What do you need?"`,
    audio: 'a1-dl-009.ogg',
  },
  {
    id: 'a1-dl-010',
    situation: 'Saying goodbye',
    turns: [
      { speaker: 'A', text: 'I have to go now.' },
      { speaker: 'B', text: 'Okay, see you later!' },
      { speaker: 'A', text: 'Bye! Take care.' },
    ],
    note: `Close warmly: "See you later!" then "Bye! Take care."`,
    audio: 'a1-dl-010.ogg',
  },
  {
    id: 'a1-dl-011',
    situation: 'Small talk about the weather',
    turns: [
      { speaker: 'A', text: "It's a nice day!" },
      { speaker: 'B', text: 'Yes, it is. Very sunny.' },
      { speaker: 'A', text: 'Perfect for a walk.' },
    ],
    note: `Agree with "Yes, it is." then add one small detail.`,
    audio: 'a1-dl-011.ogg',
  },
  {
    id: 'a1-dl-012',
    situation: 'Shopping for clothes',
    turns: [
      { speaker: 'A', text: 'Do you have this in blue?' },
      { speaker: 'B', text: 'Let me check. Yes, we do.' },
      { speaker: 'A', text: 'Great, thanks!' },
    ],
    note: `"Let me check." buys you a second before you answer.`,
    audio: 'a1-dl-012.ogg',
  },
  {
    id: 'a1-dl-013',
    situation: 'Asking the time',
    turns: [
      { speaker: 'A', text: 'What time is it?' },
      { speaker: 'B', text: "It's three o'clock." },
      { speaker: 'A', text: "Oh, I'm late!" },
    ],
    note: `React with "Oh, I'm late!" to show surprise.`,
    audio: 'a1-dl-013.ogg',
  },
  {
    id: 'a1-dl-014',
    situation: 'Ordering a drink',
    turns: [
      { speaker: 'A', text: 'What would you like?' },
      { speaker: 'B', text: 'A glass of water, please.' },
      { speaker: 'A', text: 'Coming right up.' },
    ],
    note: `"Coming right up." is friendly service English for "I'll bring it now."`,
    audio: 'a1-dl-014.ogg',
  },
  {
    id: 'a1-dl-015',
    situation: 'Arriving a little late',
    turns: [
      { speaker: 'A', text: "Sorry I'm late." },
      { speaker: 'B', text: 'No problem. Come in.' },
      { speaker: 'A', text: 'Thank you.' },
    ],
    note: `Accept an apology with "No problem. Come in."`,
    audio: 'a1-dl-015.ogg',
  },
  {
    id: 'a1-dl-016',
    situation: 'Inviting a friend',
    turns: [
      { speaker: 'A', text: 'Are you free tonight?' },
      { speaker: 'B', text: 'Yes, why?' },
      { speaker: 'A', text: "Let's watch a movie." },
    ],
    note: `Hint first with "Are you free tonight?" then give the plan.`,
    audio: 'a1-dl-016.ogg',
  },
  {
    id: 'a1-dl-017',
    situation: 'Checking about food',
    turns: [
      { speaker: 'A', text: 'Is it spicy?' },
      { speaker: 'B', text: 'A little. Is that okay?' },
      { speaker: 'A', text: "Yes, that's fine." },
    ],
    note: `Check comfort with "Is that okay?" and answer "Yes, that's fine."`,
    audio: 'a1-dl-017.ogg',
  },
  {
    id: 'a1-dl-018',
    situation: 'On the bus',
    turns: [
      { speaker: 'A', text: 'Does this bus go downtown?' },
      { speaker: 'B', text: 'Yes, it does.' },
      { speaker: 'A', text: 'Great, thank you!' },
    ],
    note: `Confirm with "Yes, it does." to match "Does this bus...?"`,
    audio: 'a1-dl-018.ogg',
  },
  {
    id: 'a1-dl-019',
    situation: 'Not hearing someone',
    turns: [
      { speaker: 'A', text: 'Sorry, can you say that again?' },
      { speaker: 'B', text: 'Sure. My name is Alex.' },
      { speaker: 'A', text: 'Got it, thanks.' },
    ],
    note: `Ask politely: "Sorry, can you say that again?" then "Got it, thanks."`,
    audio: 'a1-dl-019.ogg',
  },
  {
    id: 'a1-dl-020',
    situation: 'Paying',
    turns: [
      { speaker: 'A', text: 'Can I pay by card?' },
      { speaker: 'B', text: 'Yes, of course.' },
      { speaker: 'A', text: 'Here you go.' },
    ],
    note: `Ask first: "Can I pay by card?" then hand it over: "Here you go."`,
    audio: 'a1-dl-020.ogg',
  },
  {
    id: 'a1-dl-021',
    situation: 'Asking the time',
    turns: [
      { speaker: 'A', text: 'Excuse me, what time is it?' },
      { speaker: 'B', text: "It's half past two." },
      { speaker: 'A', text: 'Thank you!' },
    ],
    note: `Ask politely: "Excuse me, what time is it?" Answer with "It's half past two."`,
    audio: 'a1-dl-021.ogg',
  },
  {
    id: 'a1-dl-022',
    situation: 'At the doctor',
    turns: [
      { speaker: 'A', text: "I don't feel well." },
      { speaker: 'B', text: "What's wrong?" },
      { speaker: 'A', text: 'I have a headache.' },
    ],
    note: `Say the problem simply: "I have a headache."`,
    audio: 'a1-dl-022.ogg',
  },
  {
    id: 'a1-dl-023',
    situation: 'Ordering food',
    turns: [
      { speaker: 'A', text: "I'd like a sandwich, please." },
      { speaker: 'B', text: 'Anything to drink?' },
      { speaker: 'A', text: 'Just water, thanks.' },
    ],
    note: `"Anything to drink?" Answer short: "Just water, thanks."`,
    audio: 'a1-dl-023.ogg',
  },
  {
    id: 'a1-dl-024',
    situation: 'Meeting someone new',
    turns: [
      { speaker: 'A', text: "Hi, I'm Sam." },
      { speaker: 'B', text: 'Nice to meet you, Sam.' },
      { speaker: 'A', text: 'Nice to meet you too.' },
    ],
    note: `Bounce it back: "Nice to meet you too."`,
    audio: 'a1-dl-024.ogg',
  },
  {
    id: 'a1-dl-025',
    situation: 'Asking for a place',
    turns: [
      { speaker: 'A', text: 'Is there a bank near here?' },
      { speaker: 'B', text: "Yes, it's over there." },
      { speaker: 'A', text: 'Great, thanks!' },
    ],
    note: `Use "Is there a ... near here?" to find a place.`,
    audio: 'a1-dl-025.ogg',
  },
  {
    id: 'a1-dl-026',
    situation: 'On the phone',
    turns: [
      { speaker: 'A', text: 'Hello, can I speak to Anna?' },
      { speaker: 'B', text: "Speaking. Who's this?" },
      { speaker: 'A', text: "It's Sam." },
    ],
    note: `On the phone, "Speaking." means you are talking to that person.`,
    audio: 'a1-dl-026.ogg',
  },
  {
    id: 'a1-dl-027',
    situation: 'Asking for directions',
    turns: [
      { speaker: 'A', text: 'Excuse me, how do I get to the park?' },
      { speaker: 'B', text: 'Go straight, then turn left.' },
      { speaker: 'A', text: 'Thank you so much.' },
    ],
    note: `"Go straight, then turn left." gives simple directions.`,
    audio: 'a1-dl-027.ogg',
  },
  {
    id: 'a1-dl-028',
    situation: 'At the supermarket',
    turns: [
      { speaker: 'A', text: 'Where is the milk?' },
      { speaker: 'B', text: "It's at the back, on the right." },
      { speaker: 'A', text: 'Great, thanks.' },
    ],
    note: `Find things with "Where is the ...?" Answer with a place.`,
    audio: 'a1-dl-028.ogg',
  },
  {
    id: 'a1-dl-029',
    situation: 'Making a friend',
    turns: [
      { speaker: 'A', text: 'Do you want to sit together?' },
      { speaker: 'B', text: "Sure, I'd like that." },
      { speaker: 'A', text: 'Great!' },
    ],
    note: `"Do you want to ...?" is a simple way to invite someone.`,
    audio: 'a1-dl-029.ogg',
  },
  {
    id: 'a1-dl-030',
    situation: 'Buying ice cream',
    turns: [
      { speaker: 'A', text: 'Can I have one scoop, please?' },
      { speaker: 'B', text: 'Which flavor?' },
      { speaker: 'A', text: 'Chocolate, please.' },
    ],
    note: `"Which flavor?" Answer with just the word: "Chocolate, please."`,
    audio: 'a1-dl-030.ogg',
  },
  {
    id: 'a1-dl-031',
    situation: 'Asking for help in class',
    turns: [
      { speaker: 'A', text: 'Can you help me with this word?' },
      { speaker: 'B', text: 'Of course. It means big.' },
      { speaker: 'A', text: 'Oh, thank you!' },
    ],
    note: `"Can you help me with ...?" asks for help with one thing.`,
    audio: 'a1-dl-031.ogg',
  },
  {
    id: 'a1-dl-032',
    situation: 'Saying sorry',
    turns: [
      { speaker: 'A', text: 'I am sorry, that was my fault.' },
      { speaker: 'B', text: "It's okay, don't worry." },
      { speaker: 'A', text: 'Thank you for understanding.' },
    ],
    note: `Apologize with "I am sorry", then "that was my fault."`,
    audio: 'a1-dl-032.ogg',
  },
];
