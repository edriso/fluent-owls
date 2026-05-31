/**
 * Single source of truth for Telegram quiz poll limits. Imported by the audit
 * script and the test suite so they cannot drift apart.
 *
 * Unlike SQL Ninjas (where long SQL lives in a separate message and the poll
 * only shows "A/B/C/D"), Fluent Owls puts the real answer words straight into
 * the poll options. Answer words are short, so the 100-char-per-option Telegram
 * limit is comfortable and we enforce it directly.
 *
 * See: https://core.telegram.org/bots/api#sendpoll
 */

/** Minimum number of answer options Telegram accepts for a poll. */
export const MIN_OPTIONS = 2;
/** Maximum number of answer options Telegram accepts for a poll. */
export const MAX_OPTIONS = 10;
/** Maximum length of a single answer option (Telegram poll limit). */
export const OPTION_MAX_CHARS = 100;
/** Maximum length of the poll question, including our "level / topic" header. */
export const QUESTION_MAX_CHARS = 300;
/** Maximum length of the post-answer explanation (Telegram quiz poll limit). */
export const EXPLANATION_MAX_CHARS = 200;
