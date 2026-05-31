import type { Level } from './types';

/** One question in the daily batch. */
export type ScheduleDef = {
  /** Stable name, used in logs and by /admin and send-test to target a slot. */
  name: string;
  /** The band of CEFR levels this slot draws a question from. */
  levels: Level[];
  /**
   * Post without a notification sound (Telegram disable_notification). The
   * batch posts in array order and silences all but the last one, so a
   * follower gets a single daily ping yet still receives every question.
   */
  silent: boolean;
};

/**
 * The daily posting plan. All three questions go out together once a day, at
 * config.dailyCron (default 14:00 in the configured timezone), posted in this
 * order and climbing through the CEFR bands:
 *   morning  beginner warm-up    (A1, A2)   silent
 *   midday   intermediate        (B1, B2)   silent
 *   evening  advanced challenge  (C1, C2)   rings
 *
 * Why one batch instead of three times a day: fewer interruptions. A follower
 * gets one notification (the last post), opens the channel once, and finds all
 * three questions waiting, easy to hard. Why still three questions: a warm-up,
 * a stretch, and a challenge is a healthy daily dose across every level.
 */
export const schedules: readonly ScheduleDef[] = [
  { name: 'morning', levels: ['a1', 'a2'], silent: true },
  { name: 'midday', levels: ['b1', 'b2'], silent: true },
  { name: 'evening', levels: ['c1', 'c2'], silent: false },
];
