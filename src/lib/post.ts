import { InputFile, type Bot, type Context } from 'grammy';
import { logger, sendPoll, type ChatId } from 'telegram-broadcast-kit';
import { config } from '../config';
import { audioPathFor } from '../content/audio-path';
import type {
  LeveledDialogue,
  LeveledGrammarRule,
  LeveledMonologue,
  LeveledNativePhrase,
  LeveledIdiomEntry,
  LeveledPrompt,
  LeveledPronunciationDrill,
  LeveledQuestion,
  LeveledShadowingClip,
  LeveledStory,
  LeveledTalk,
  LeveledVocabularyEntry,
} from '../types';
import {
  buildDialogueCaption,
  buildGrammarCaption,
  buildIdiomMessage,
  buildMonologueCaption,
  buildPhraseMessage,
  buildPrompt,
  buildPromptCaption,
  buildPronunciationCaption,
  buildShadowingCaption,
  buildStoryCaption,
  buildTalkCaption,
  buildVocabularyMessage,
  clampExplanation,
  toPollOptions,
} from './format';

/**
 * Common options for every poster. `chatId` defaults to the channel; the
 * on-demand DM commands pass the requester's chat id instead, so the same
 * posters serve both the daily channel batch and a private reply.
 */
type PostOpts = { silent?: boolean; chatId?: ChatId };

/**
 * Post one question as a native Telegram quiz poll, via the shared kernel's
 * sendPoll (quiz mode). Quiz polls reveal the correct option and a short
 * explanation after the reader votes, which is exactly the "learn by doing"
 * loop we want. Polls are anonymous, so nobody (not even the bot) can see who
 * voted what.
 *
 * The kernel validates the quiz config synchronously (correctOptionId range,
 * explanation length) and THROWS on bad input — a programming error surfaced
 * loudly. A network/send failure is logged inside sendPoll and returns null.
 *
 * Returns the message_id on success, or null on a send failure.
 */
export async function postQuizPoll(
  bot: Bot<Context>,
  question: LeveledQuestion,
  opts: PostOpts = {},
): Promise<number | null> {
  // toPollOptions enforces fluent-owls' own count/length rules and throws on a
  // bad bank (caught in dev, never silently shipped); the kernel re-checks the
  // quiz-specific fields. We pass plain strings to sendPoll, which maps them to
  // InputPollOption objects itself.
  const options = toPollOptions(question.options).map((o) => o.text);
  const messageId = await sendPoll(
    bot,
    opts.chatId ?? config.channelChatId,
    {
      question: buildPrompt(question),
      options,
      type: 'quiz',
      correctOptionId: question.correctIndex,
      explanation: clampExplanation(question.explanation),
      isAnonymous: true,
      // Our content is English. Without this the kernel's RTL-by-default bidi
      // isolate (its Arabic origin) mirrors the poll for the reader, flipping a
      // leading emoji/number to the wrong side. 'ltr' pins it. Needs kit
      // v0.2.2+.
      direction: 'ltr',
    },
    {
      name: question.id,
      // Silent posts arrive without a sound/vibration (they still appear in the
      // channel). The daily batch silences all but the last question so
      // followers get a single ping a day.
      silent: opts.silent ?? false,
    },
  );
  if (messageId !== null) {
    logger.info('Posted quiz poll', {
      id: question.id,
      level: question.level,
      topic: question.topic,
      messageId,
    });
  }
  return messageId;
}

/**
 * Send one committed OGG/Opus clip as a Telegram voice message (sendVoice, not
 * sendAudio, so it gets the inline waveform player and Telegram's playback-speed
 * control, which is what a shadower wants). The audio is read from disk by file
 * name (see content/audio-path.ts). A missing file (audio not generated yet)
 * throws inside the Bot API call, which we catch and log, returning null so the
 * daily batch keeps going. Run `pnpm generate-audio` to create the files.
 */
async function sendVoiceFile(
  bot: Bot<Context>,
  audioFile: string,
  caption: string,
  opts: {
    silent?: boolean;
    chatId?: ChatId;
    parseMode?: 'HTML';
    logName: string;
    logFields: Record<string, unknown>;
  },
): Promise<number | null> {
  try {
    const message = await bot.api.sendVoice(
      opts.chatId ?? config.channelChatId,
      new InputFile(audioPathFor(audioFile)),
      {
        caption,
        parse_mode: opts.parseMode,
        disable_notification: opts.silent ?? false,
      },
    );
    logger.info(`Posted ${opts.logName}`, { ...opts.logFields, messageId: message.message_id });
    return message.message_id;
  } catch (err) {
    logger.error(`Failed to post ${opts.logName} (is the audio generated?)`, {
      ...opts.logFields,
      audio: audioFile,
      error: String(err),
    });
    return null;
  }
}

/** Post one shadowing clip as a voice message (transcript + listen-and-repeat tip). */
export async function postVoice(
  bot: Bot<Context>,
  clip: LeveledShadowingClip,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, clip.audio, buildShadowingCaption(clip), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'shadowing voice',
    logFields: { id: clip.id, level: clip.level, focus: clip.focus },
  });
}

/** Post one role-play dialogue as a two-voice voice message (the exchange + tip). */
export async function postDialogue(
  bot: Bot<Context>,
  dialogue: LeveledDialogue,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, dialogue.audio, buildDialogueCaption(dialogue), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'role-play dialogue',
    logFields: { id: dialogue.id, level: dialogue.level, turns: dialogue.turns.length },
  });
}

/** Post one grammar rule as a voice message (rule + examples read aloud + tip). */
export async function postGrammar(
  bot: Bot<Context>,
  rule: LeveledGrammarRule,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, rule.audio, buildGrammarCaption(rule), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'grammar',
    logFields: { id: rule.id, level: rule.level },
  });
}

/** Post one monologue as a voice message (the passage + listen-and-retell tip). */
export async function postMonologue(
  bot: Bot<Context>,
  monologue: LeveledMonologue,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, monologue.audio, buildMonologueCaption(monologue), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'monologue',
    logFields: { id: monologue.id, level: monologue.level },
  });
}

/** Post one question-prompt as a voice message (question, pause, model answer). */
export async function postPrompt(
  bot: Bot<Context>,
  prompt: LeveledPrompt,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, prompt.audio, buildPromptCaption(prompt), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'question prompt',
    logFields: { id: prompt.id, level: prompt.level },
  });
}

/** Post one useful talk as a voice message (the talk narrated, with the text in the caption). */
export async function postTalk(
  bot: Bot<Context>,
  talk: LeveledTalk,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, talk.audio, buildTalkCaption(talk), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'useful talk',
    logFields: { id: talk.id, level: talk.level },
  });
}

/** Post one story as a voice message (the story narrated, with the text in the caption). */
export async function postStory(
  bot: Bot<Context>,
  story: LeveledStory,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, story.audio, buildStoryCaption(story), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'story',
    logFields: { id: story.id, level: story.level },
  });
}

/** Post one idiom as a voice message (idiom + examples read aloud, HTML caption). */
export async function postIdiom(
  bot: Bot<Context>,
  entry: LeveledIdiomEntry,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, entry.audio, buildIdiomMessage(entry), {
    silent: opts.silent,
    chatId: opts.chatId,
    parseMode: 'HTML',
    logName: 'idiom entry',
    logFields: { id: entry.id, level: entry.level },
  });
}

/** Post one vocabulary entry as a voice message (word + examples read aloud, HTML caption). */
export async function postVocabulary(
  bot: Bot<Context>,
  entry: LeveledVocabularyEntry,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, entry.audio, buildVocabularyMessage(entry), {
    silent: opts.silent,
    chatId: opts.chatId,
    parseMode: 'HTML',
    logName: 'vocabulary entry',
    logFields: { id: entry.id, level: entry.level },
  });
}

/** Post one pronunciation drill as a voice message (the items read aloud + tip). */
export async function postPronunciation(
  bot: Bot<Context>,
  drill: LeveledPronunciationDrill,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, drill.audio, buildPronunciationCaption(drill), {
    silent: opts.silent,
    chatId: opts.chatId,
    logName: 'pronunciation drill',
    logFields: { id: drill.id, level: drill.level, focus: drill.focus },
  });
}

/**
 * Post one "say it like a native" phrase as a voice message: the audio reads the
 * phrase and a worked example aloud, and the HTML caption (buildPhraseMessage,
 * already escaped) shows the chunk, when to use it, and the example. So learners
 * both read the chunk and HEAR it pronounced. The audio file name is derived from
 * the id (`<id>.ogg`), like every other voice item. Returns the message_id, or
 * null on a send failure (e.g. the audio is not generated yet).
 */
export async function postPhrase(
  bot: Bot<Context>,
  phrase: LeveledNativePhrase,
  opts: PostOpts = {},
): Promise<number | null> {
  return sendVoiceFile(bot, `${phrase.id}.ogg`, buildPhraseMessage(phrase), {
    silent: opts.silent,
    chatId: opts.chatId,
    parseMode: 'HTML',
    logName: 'native phrase',
    logFields: { id: phrase.id, level: phrase.level },
  });
}

/**
 * Plain message poster used by the welcome script and the phrase poster. Kept
 * local (not routed through the kernel's `post`) because it disables the link
 * preview and posts HTML, neither of which the kernel's plain-text-first poster
 * exposes. `silent` maps to Telegram's disable_notification.
 */
export async function postPlainMessage(
  bot: Bot<Context>,
  text: string,
  opts: { parseMode?: 'HTML'; silent?: boolean; chatId?: ChatId } = {},
): Promise<number | null> {
  try {
    const message = await bot.api.sendMessage(opts.chatId ?? config.channelChatId, text, {
      parse_mode: opts.parseMode,
      link_preview_options: { is_disabled: true },
      disable_notification: opts.silent ?? false,
    });
    return message.message_id;
  } catch (err) {
    logger.error('Failed to post plain message', { error: String(err) });
    return null;
  }
}

/** Edit a channel message in place (used to update the pinned welcome). */
export async function editChannelMessage(
  bot: Bot<Context>,
  messageId: number,
  text: string,
  opts: { parseMode?: 'HTML' } = {},
): Promise<boolean> {
  try {
    await bot.api.editMessageText(config.channelChatId, messageId, text, {
      parse_mode: opts.parseMode,
      link_preview_options: { is_disabled: true },
    });
    return true;
  } catch (err) {
    logger.warn('Failed to edit channel message', { messageId, error: String(err) });
    return false;
  }
}
