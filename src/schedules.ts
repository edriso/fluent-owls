import { config } from './config';
import type { Level } from './types';

/** A single scheduled posting slot. */
export type ScheduleDef = {
  /** Stable name, used in logs and by /admin and send-test to target a slot. */
  name: string;
  /** Cron expression (evaluated in the configured timezone). */
  cron: string;
  /** The band of CEFR levels this slot draws a question from. */
  levels: Level[];
};

/**
 * The daily posting plan. Three bite-sized posts a day, climbing through the
 * CEFR bands so every level gets aired and learners of all stages get something
 * each day:
 *   morning  08:00  beginner warm-up   (A1, A2)
 *   midday   13:00  intermediate       (B1, B2)
 *   evening  19:00  advanced challenge  (C1, C2)
 *
 * Why three and not five: pacing. A quick warm-up, a lunchtime stretch, and an
 * evening challenge is a healthy daily dose. More than that turns a learning
 * channel into noise. Times are interpreted in the timezone from config.
 */
export const schedules: readonly ScheduleDef[] = [
  { name: 'morning', cron: config.morningCron, levels: ['a1', 'a2'] },
  { name: 'midday', cron: config.middayCron, levels: ['b1', 'b2'] },
  { name: 'evening', cron: config.eveningCron, levels: ['c1', 'c2'] },
];
