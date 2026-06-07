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

/**
 * Limits for the speaking exercises (shadowing clips and "say it like a native"
 * phrases). Shared by scripts/audit-speaking.ts and the test suite so they
 * cannot drift apart.
 *
 * Telegram caps a media caption (the text under a voice message) at 1024 chars.
 * We keep the shadowing transcript well under that on purpose: a good shadowing
 * clip is one short, repeatable sentence or two (roughly 8 to 20 seconds), not
 * a paragraph. Short clips are the whole point, so they stay easy to copy.
 *
 * See: https://core.telegram.org/bots/api#sendvoice
 */

/** Telegram's hard limit on a media caption (the text under a voice message). */
export const CAPTION_MAX_CHARS = 1024;
/** Maximum length of a shadowing transcript (the line to listen to and repeat). */
export const TRANSCRIPT_MAX_CHARS = 240;
/** Maximum length of a shadowing clip's real-situation context label. */
export const CONTEXT_MAX_CHARS = 70;
/** Maximum length of a shadowing clip's "how to say it" tip. */
export const NOTE_MAX_CHARS = 160;

/** Maximum length of a native phrase chunk itself. */
export const PHRASE_MAX_CHARS = 120;
/** Maximum length of a native phrase's "when to use it" line. */
export const SITUATION_MAX_CHARS = 120;
/** Maximum length of a native phrase's worked example sentence. */
export const EXAMPLE_MAX_CHARS = 200;

/** Fewest turns in a role-play dialogue (a real exchange needs at least two). */
export const DIALOGUE_MIN_TURNS = 2;
/** Most turns in a role-play dialogue (keep it short and shadowable). */
export const DIALOGUE_MAX_TURNS = 4;
/** Maximum length of a single dialogue line. */
export const DIALOGUE_TURN_MAX_CHARS = 120;
