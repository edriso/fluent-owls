import { LEVELS, type Level } from './types';

/**
 * What kind of post a slot makes. Each maps to its own content bank and poster:
 *  - 'quiz':   a native quiz poll        (questions-*.ts  -> postQuizPoll)
 *  - 'shadow': a shadowing voice message (shadowing-*.ts  -> postVoice)
 *  - 'phrase': a "say it like a native"  (phrases-*.ts    -> postPhrase)
 */
export type SlotKind = 'quiz' | 'shadow' | 'phrase';

/** One post in the daily batch. */
export type ScheduleDef = {
  /** Stable name, used in logs and by /admin and send-test to target a slot. */
  name: string;
  /** What kind of post this slot makes (drives which bank and poster are used). */
  kind: SlotKind;
  /** The band of CEFR levels this slot draws from. */
  levels: Level[];
  /**
   * Post without a notification sound (Telegram disable_notification). The
   * batch posts in array order and silences all but the last one, so a
   * follower gets a single daily ping yet still receives every post.
   */
  silent: boolean;
};

/**
 * The daily posting plan. Everything goes out together once a day, at
 * config.dailyCron (default 14:00 in the configured timezone), posted in this
 * order so the feed reads as a single rounded daily lesson:
 *
 *   morning  quiz    beginner warm-up   (A1, A2)        silent
 *   midday   quiz    intermediate       (B1, B2)        silent
 *   evening  quiz    advanced challenge (C1, C2)        silent
 *   phrase   phrase  "say it like a native" (all levels) silent
 *   shadow   shadow  speaking practice      (all levels) rings
 *
 * THIS IS THE EDIT POINT for the batch: change the order, the level bands, which
 * slots are silent, or add/remove a slot here.
 *
 * Why three quizzes plus a phrase plus a shadowing clip: the quizzes build the
 * words that make you correct; the phrase and the shadowing clip build the
 * rhythm and ready-made chunks that make you sound natural and well spoken. One
 * daily set covers both halves of "good English".
 *
 * Why one batch with a single ping: fewer interruptions. A follower gets one
 * notification (the last post, the shadowing clip, the only "do it now"
 * activity), opens the channel once, and finds the whole set waiting.
 *
 * The phrase and shadowing slots pool every level: a learner meets a different
 * level each day, and every post shows its level, so anyone can pick the ones
 * that fit them. Add more clips/phrases to lengthen the no-repeat cycle.
 */
export const schedules: readonly ScheduleDef[] = [
  { name: 'morning', kind: 'quiz', levels: ['a1', 'a2'], silent: true },
  { name: 'midday', kind: 'quiz', levels: ['b1', 'b2'], silent: true },
  { name: 'evening', kind: 'quiz', levels: ['c1', 'c2'], silent: true },
  { name: 'phrase', kind: 'phrase', levels: [...LEVELS], silent: true },
  { name: 'shadow', kind: 'shadow', levels: [...LEVELS], silent: false },
];
