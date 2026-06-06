import type { Bot, Context } from 'grammy';
import { logger, sendPoll } from 'telegram-broadcast-kit';
import { config } from '../config';
import type { LeveledQuestion } from '../types';
import { buildPrompt, clampExplanation, toPollOptions } from './format';

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
  opts: { silent?: boolean } = {},
): Promise<number | null> {
  // toPollOptions enforces fluent-owls' own count/length rules and throws on a
  // bad bank (caught in dev, never silently shipped); the kernel re-checks the
  // quiz-specific fields. We pass plain strings to sendPoll, which maps them to
  // InputPollOption objects itself.
  const options = toPollOptions(question.options).map((o) => o.text);
  const messageId = await sendPoll(
    bot,
    config.channelChatId,
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
 * Plain message poster used by the welcome script. Kept local (not routed
 * through the kernel's `post`) because it disables the link preview and posts
 * HTML, neither of which the kernel's plain-text-first poster exposes.
 */
export async function postPlainMessage(
  bot: Bot<Context>,
  text: string,
  opts: { parseMode?: 'HTML' } = {},
): Promise<number | null> {
  try {
    const message = await bot.api.sendMessage(config.channelChatId, text, {
      parse_mode: opts.parseMode,
      link_preview_options: { is_disabled: true },
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
