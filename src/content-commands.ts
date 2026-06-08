import type { Bot } from 'grammy';
import { poolForLevel, randomOf } from './lib/select';
import type { Level } from './types';
import { ALL_QUESTIONS } from './content/index';
import { ALL_GRAMMAR } from './content/grammar';
import { ALL_PHRASES } from './content/phrases';
import { ALL_DIALOGUES } from './content/dialogues';
import { ALL_SHADOWING } from './content/shadowing';
import { ALL_MONOLOGUES } from './content/monologues';
import { ALL_PROMPTS } from './content/prompts';
import { ALL_PRONUNCIATION } from './content/pronunciation';
import { ALL_VOCABULARY } from './content/vocabulary';
import { ALL_IDIOMS } from './content/idioms';
import { ALL_STORIES } from './content/stories';
import { ALL_TALKS } from './content/talks';
import {
  postDialogue,
  postGrammar,
  postIdiom,
  postMonologue,
  postPhrase,
  postPrompt,
  postPronunciation,
  postQuizPoll,
  postStory,
  postTalk,
  postVocabulary,
  postVoice,
} from './lib/post';

/** Send a random item of one content type to a chat, optionally filtered by a CEFR level in `arg`. */
type SendRandom = (bot: Bot, chatId: number | string, arg: string) => Promise<number | null>;

/**
 * One on-demand content command. This registry is the SINGLE SOURCE OF TRUTH for
 * the "send a random X" commands: it drives the DM command handlers, the /listen
 * rotation, the /help list, and Telegram's command menu, so the four can never
 * drift apart. Adding a type, renaming a command, or reordering the menu is a
 * one-line change here.
 *
 * /grammar is included (so it appears in /listen, /help, and the menu) but marks
 * `customHandler`, because its real handler also does topic search; bot.ts
 * registers that one itself and only uses `send` here for the random fallback.
 */
export type ContentCommand = {
  /** Primary command name, without the slash. */
  command: string;
  /** Extra command names that do the same thing (e.g. the old /pron alias). */
  aliases?: string[];
  /** Emoji shown in /help. */
  emoji: string;
  /** Short label in /help, shown after the emoji and before the command. */
  help: string;
  /** Optional hint appended after the command in /help (e.g. grammar's topic tip). */
  helpNote?: string;
  /** Description shown in Telegram's command menu (setMyCommands). */
  menu: string;
  /** Include in /listen, the "any audio clip" command. True for every voice type, false for the text-only quiz. */
  inListen: boolean;
  /** When true, bot.ts registers the handler itself (grammar's topic search). */
  customHandler?: boolean;
  /** Post a random item (used by the command handler and by /listen). */
  send: SendRandom;
};

/**
 * Pair a content bank with its poster into a "send a random one" function. The
 * generic ties the bank's item type to the poster's argument, so a mismatched
 * pair (say, stories with the talk poster) is a compile error, not a runtime bug.
 */
function pickFor<T extends { level: Level }>(
  all: readonly T[],
  post: (bot: Bot, item: T, opts: { chatId: number | string }) => Promise<number | null>,
): SendRandom {
  return (bot, chatId, arg) => post(bot, randomOf(poolForLevel(all, arg)), { chatId });
}

// Ordered most-used first. This one order drives BOTH /help and the content
// section of the command menu, so they always agree.
export const CONTENT_COMMANDS: readonly ContentCommand[] = [
  {
    command: 'quiz',
    emoji: '📝',
    help: 'Quiz',
    menu: 'A random quiz (add a level: /quiz a2)',
    inListen: false,
    send: pickFor(ALL_QUESTIONS, postQuizPoll),
  },
  {
    command: 'grammar',
    emoji: '📘',
    help: 'Grammar',
    helpNote: '(or a topic: /grammar present perfect)',
    menu: 'A grammar point; add a topic or level: /grammar b1',
    inListen: true,
    customHandler: true,
    send: pickFor(ALL_GRAMMAR, postGrammar),
  },
  {
    command: 'story',
    emoji: '📚',
    help: 'Short story',
    menu: 'A short story to listen to and retell (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_STORIES, postStory),
  },
  {
    command: 'vocab',
    emoji: '📖',
    help: 'Vocabulary word',
    menu: 'A word to learn, with examples (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_VOCABULARY, postVocabulary),
  },
  {
    command: 'phrase',
    emoji: '🗣️',
    help: 'Native phrase',
    menu: 'A "say it like a native" phrase (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_PHRASES, postPhrase),
  },
  {
    command: 'idiom',
    emoji: '💡',
    help: 'Idiom',
    menu: 'An idiom to sound native (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_IDIOMS, postIdiom),
  },
  {
    command: 'dialogue',
    emoji: '🎭',
    help: 'Role-play dialogue',
    menu: 'A role-play dialogue (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_DIALOGUES, postDialogue),
  },
  {
    command: 'shadow',
    emoji: '🔁',
    help: 'Shadowing clip',
    menu: 'A shadowing clip (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_SHADOWING, postVoice),
  },
  {
    command: 'talk',
    emoji: '🧠',
    help: 'Useful talk',
    menu: 'A useful talk on focus, health, or habits (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_TALKS, postTalk),
  },
  {
    command: 'monologue',
    emoji: '🎙️',
    help: 'Monologue to retell',
    menu: 'A passage to retell (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_MONOLOGUES, postMonologue),
  },
  {
    command: 'prompt',
    emoji: '🎤',
    help: 'Question to answer',
    menu: 'A question to answer out loud (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_PROMPTS, postPrompt),
  },
  {
    command: 'pronounce',
    aliases: ['pron'],
    emoji: '🔊',
    help: 'Pronunciation drill',
    menu: 'A pronunciation drill (audio; add a level)',
    inListen: true,
    send: pickFor(ALL_PRONUNCIATION, postPronunciation),
  },
];

/** The grammar entry, used by bot.ts for the random fallback of its custom /grammar handler. */
export const GRAMMAR_COMMAND = CONTENT_COMMANDS.find((c) => c.command === 'grammar')!;
