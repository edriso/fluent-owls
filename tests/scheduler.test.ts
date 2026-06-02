import { describe, expect, it, vi } from 'vitest';
import type { Bot } from 'grammy';
import { findSlot, runDailyBatch, runOnce } from '../src/scheduler';
import { schedules } from '../src/schedules';

/**
 * A minimal fake bot: only the one method the poster touches (api.sendPoll).
 * No network, no token. We record every call so we can assert the batch posts
 * in order and silences all but the last question.
 */
type SentPoll = { question: string; silent: boolean };

function fakeBot(): { bot: Bot; sent: SentPoll[] } {
  const sent: SentPoll[] = [];
  const api = {
    sendPoll: vi.fn(
      async (
        _chatId: string,
        question: string,
        _options: unknown,
        extra: { disable_notification?: boolean },
      ) => {
        sent.push({ question, silent: extra.disable_notification ?? false });
        return { message_id: sent.length };
      },
    ),
  };
  return { bot: { api } as unknown as Bot, sent };
}

describe('findSlot', () => {
  it('returns a known slot and undefined for an unknown one', () => {
    expect(findSlot('midday')?.name).toBe('midday');
    expect(findSlot('nope')).toBeUndefined();
  });
});

describe('runOnce', () => {
  it('posts one poll and honours the slot silent flag', async () => {
    const { bot, sent } = fakeBot();
    const evening = findSlot('evening')!;
    await runOnce(evening, bot);
    expect(sent).toHaveLength(1);
    // evening is the audible slot
    expect(sent[0]?.silent).toBe(false);
  });

  it('posts silently for a silent slot', async () => {
    const { bot, sent } = fakeBot();
    await runOnce(findSlot('morning')!, bot);
    expect(sent[0]?.silent).toBe(true);
  });
});

describe('runDailyBatch', () => {
  it('posts every slot in order, with only the last one audible', async () => {
    const { bot, sent } = fakeBot();
    await runDailyBatch(bot);
    expect(sent).toHaveLength(schedules.length);
    // All but the last are silent; the last rings.
    const silentFlags = sent.map((s) => s.silent);
    expect(silentFlags.slice(0, -1).every((s) => s === true)).toBe(true);
    expect(silentFlags[silentFlags.length - 1]).toBe(false);
  });

  it('never throws even when every send fails', async () => {
    // postQuizPoll swallows its own send errors (returns null) and the batch
    // wraps each slot in its own try/catch, so a total Telegram outage must
    // resolve cleanly rather than crash the cron tick. Nothing lands, but the
    // process survives to try again on the next fire.
    const { bot, sent } = fakeBot();
    // Force every send to reject, simulating a total Telegram outage.
    (
      bot.api.sendPoll as unknown as {
        mockImplementation: (fn: () => Promise<never>) => void;
      }
    ).mockImplementation(async () => {
      throw new Error('telegram down');
    });
    await expect(runDailyBatch(bot)).resolves.toBeUndefined();
    expect(sent).toHaveLength(0);
  });
});
