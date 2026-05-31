/**
 * Core domain types for the Fluent Owls quiz bot.
 *
 * The content fields are the source of truth and live in
 * src/content/questions-*.ts, one file per CEFR level. Each question is sent
 * to the channel as a single native Telegram quiz poll: the sentence (with a
 * blank) is the poll question, the answer choices are the poll options, and a
 * short explanation is revealed after the reader votes.
 *
 * Constraints (validated by scripts/audit-questions.ts and the unit tests):
 *  - `options` has 2 to 10 entries, each unique and <= 100 chars
 *  - `correctIndex` points at one of those options
 *  - the rendered poll question (header + prompt) is <= 300 chars
 *  - `explanation` is <= 200 chars (Telegram quiz poll limit)
 */

/**
 * CEFR levels, from beginner (A1) to mastery (C2).
 *
 * We use the international CEFR scale instead of "easy/medium/hard" because it
 * is the standard learners already recognize, and it lets people see exactly
 * where they are on their English journey. Each posting slot draws from a band
 * of levels (see schedules.ts).
 *
 * See: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
 */
export type Level = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

/** All levels in order, beginner first. The single source of truth for "every level". */
export const LEVELS: readonly Level[] = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

/**
 * The English skill a question trains.
 *
 * These are the areas where learners gain the most. Collocations, phrasal
 * verbs, and idioms in particular are what make someone sound natural rather
 * than merely correct. The topic is shown in the question header.
 */
export type Topic =
  | 'vocabulary'
  | 'collocations'
  | 'phrasal-verbs'
  | 'idioms'
  | 'confusing-pairs'
  | 'prepositions'
  | 'grammar';

/**
 * A single multiple-choice quiz question, as written by an author.
 *
 * Most questions use the contextual fill-in-the-blank format: a natural
 * sentence with the target word blanked out using "____" (four underscores).
 * This "cloze in context" style is a proven, enjoyable way to build vocabulary
 * because the surrounding sentence shows how the word is actually used.
 */
export type QuizQuestion = {
  /** Stable, unique id. Starts with the level, e.g. "b1-007". */
  id: string;
  /** The sentence or question shown above the options. */
  prompt: string;
  /** Between 2 and 10 answer choices. */
  options: string[];
  /** Index into `options` of the correct answer (0-based). */
  correctIndex: number;
  /**
   * Short explanation shown after the reader votes. Good explanations teach the
   * rule or meaning, so even a wrong guess leaves the learner smarter.
   */
  explanation: string;
  /** The skill this question trains. Drives the header badge. */
  topic: Topic;
};

/**
 * A question paired with the CEFR level it was loaded from.
 *
 * Authors write plain {@link QuizQuestion} objects in each level's content
 * file. The content registry (content/index.ts) tags every question with its
 * level so the rest of the app can show a level badge and pick from level bands.
 */
export type LeveledQuestion = QuizQuestion & {
  /** The CEFR level this question belongs to. */
  level: Level;
};
