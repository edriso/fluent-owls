import { describe, expect, it, vi } from 'vitest';
import type { Bot } from 'grammy';
import { findSlot, runDailyBatch, runOnce } from '../src/scheduler';
import { schedules } from '../src/schedules';

/**
 * A minimal fake bot covering the Bot API methods the posters touch: sendPoll
 * (quizzes) and sendVoice (every speaking item, including phrases, which are now
 * voice messages with an HTML caption). sendMessage is kept for the welcome path
 * and the failure test. No network, no token. We record every call so we can
 * assert the batch posts in order and silences all but the last post.
 */
type Sent = { kind: 'poll' | 'voice' | 'message'; silent: boolean; text: string };

function fakeBot(): { bot: Bot; sent: Sent[] } {
  const sent: Sent[] = [];
  let n = 0;
  const api = {
    sendPoll: vi.fn(
      async (
        _chatId: string,
        question: string,
        _options: unknown,
        extra: { disable_notification?: boolean },
      ) => {
        sent.push({ kind: 'poll', silent: extra.disable_notification ?? false, text: question });
        return { message_id: (n += 1) };
      },
    ),
    sendVoice: vi.fn(
      async (
        _chatId: string,
        _voice: unknown,
        extra: { caption?: string; disable_notification?: boolean },
      ) => {
        sent.push({
          kind: 'voice',
          silent: extra.disable_notification ?? false,
          text: extra.caption ?? '',
        });
        return { message_id: (n += 1) };
      },
    ),
    sendMessage: vi.fn(
      async (_chatId: string, text: string, extra: { disable_notification?: boolean }) => {
        sent.push({ kind: 'message', silent: extra?.disable_notification ?? false, text });
        return { message_id: (n += 1) };
      },
    ),
  };
  return { bot: { api } as unknown as Bot, sent };
}

describe('findSlot', () => {
  it('returns a known slot and undefined for an unknown one', () => {
    expect(findSlot('midday')?.name).toBe('midday');
    expect(findSlot('shadow')?.name).toBe('shadow');
    expect(findSlot('dialogue')?.name).toBe('dialogue');
    expect(findSlot('nope')).toBeUndefined();
  });
});

describe('runOnce', () => {
  it('posts a quiz poll for a quiz slot and honours its silent flag', async () => {
    const { bot, sent } = fakeBot();
    await runOnce(findSlot('morning')!, bot);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.kind).toBe('poll');
    expect(sent[0]?.silent).toBe(true);
  });

  it('posts a voice message for the shadow slot, audibly', async () => {
    const { bot, sent } = fakeBot();
    await runOnce(findSlot('shadow')!, bot);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.kind).toBe('voice');
    expect(sent[0]?.silent).toBe(false);
  });

  it('posts a voice message with an HTML caption for the phrase slot', async () => {
    const { bot, sent } = fakeBot();
    await runOnce(findSlot('phrase')!, bot);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.kind).toBe('voice');
    expect(sent[0]?.text).toContain('Say it like a native');
  });

  it('posts a voice message for the dialogue slot', async () => {
    const { bot, sent } = fakeBot();
    await runOnce(findSlot('dialogue')!, bot);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.kind).toBe('voice');
    expect(sent[0]?.text).toContain('Role-play');
  });

  it('posts a voice message for the grammar slot', async () => {
    const { bot, sent } = fakeBot();
    await runOnce(findSlot('grammar')!, bot);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.kind).toBe('voice');
    expect(sent[0]?.text).toContain('Grammar');
  });

  it('pins the quiz poll left-to-right so English text never mirrors on RTL clients', () => {
    // postQuizPoll passes direction:'ltr', so the kernel wraps the question in
    // a Unicode LTR isolate (U+2066 ... U+2069). Guard the first/last marks so
    // a regression to the kernel's RTL default is caught here.
    const { bot, sent } = fakeBot();
    return runOnce(findSlot('evening')!, bot).then(() => {
      const q = sent[0]!.text;
      expect(q.codePointAt(0)).toBe(0x2066);
      expect(q.codePointAt(q.length - 1)).toBe(0x2069);
    });
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

  it('posts each slot in the kind its schedule declares', async () => {
    const { bot, sent } = fakeBot();
    await runDailyBatch(bot);
    const expected = schedules.map((s) => (s.kind === 'quiz' ? 'poll' : 'voice'));
    expect(sent.map((s) => s.kind)).toEqual(expected);
  });

  it('never throws even when every send fails', async () => {
    // Each poster swallows its own send error (returns null) and the batch
    // wraps each slot in its own try/catch, so a total Telegram outage must
    // resolve cleanly rather than crash the cron tick. Nothing lands, but the
    // process survives to try again on the next fire.
    const { bot, sent } = fakeBot();
    const boom = async () => {
      throw new Error('telegram down');
    };
    (
      bot.api.sendPoll as unknown as { mockImplementation: (fn: () => Promise<never>) => void }
    ).mockImplementation(boom);
    (
      bot.api.sendVoice as unknown as { mockImplementation: (fn: () => Promise<never>) => void }
    ).mockImplementation(boom);
    (
      bot.api.sendMessage as unknown as { mockImplementation: (fn: () => Promise<never>) => void }
    ).mockImplementation(boom);
    await expect(runDailyBatch(bot)).resolves.toBeUndefined();
    expect(sent).toHaveLength(0);
  });
});
