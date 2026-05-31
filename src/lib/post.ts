import type { Bot, Context } from 'grammy';
import { config } from '../config';
import type { LeveledQuestion } from '../types';
import { buildPrompt, clampExplanation, toPollOptions } from './format';
import { logger } from './logger';

/**
 * Post one question as a native Telegram quiz poll. Quiz polls reveal the
 * correct option and a short explanation after the reader votes, which is
 * exactly the "learn by doing" loop we want. Polls are anonymous, so nobody
 * (not even the bot) can see who voted what.
 *
 * Returns the message_id on success, or null on failure. Never throws: the
 * caller logs and moves on, and the next scheduled fire takes over.
 */
export async function postQuizPoll(
  bot: Bot<Context>,
  question: LeveledQuestion,
): Promise<number | null> {
  try {
    const message = await bot.api.sendPoll(
      config.channelChatId,
      buildPrompt(question),
      toPollOptions(question.options),
      {
        type: 'quiz',
        // correct_option_ids is the Bot API 9.x replacement for the old
        // singular correct_option_id field. A single-element array keeps the
        // standard quiz behaviour: one correct answer, revealed on vote.
        correct_option_ids: [question.correctIndex],
        explanation: clampExplanation(question.explanation),
        is_anonymous: true,
      },
    );
    logger.info('Posted quiz poll', {
      id: question.id,
      level: question.level,
      topic: question.topic,
      messageId: message.message_id,
    });
    return message.message_id;
  } catch (err) {
    logger.error('Failed to post quiz poll', { id: question.id, error: String(err) });
    return null;
  }
}

/**
 * Plain message poster used by /start replies and the welcome script. Kept
 * separate from poll posting so callers do not inherit quiz semantics.
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
