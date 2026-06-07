import { ltrIsolate } from 'telegram-broadcast-kit';
import type {
  Level,
  LeveledDialogue,
  LeveledGrammarRule,
  LeveledMonologue,
  LeveledNativePhrase,
  LeveledPrompt,
  LeveledPronunciationDrill,
  LeveledQuestion,
  LeveledShadowingClip,
  PhraseFunction,
  PronunciationFocus,
  ShadowingFocus,
  Topic,
} from '../types';
import { EXPLANATION_MAX_CHARS, MAX_OPTIONS, MIN_OPTIONS, OPTION_MAX_CHARS } from './limits';

/**
 * Emoji and label for each CEFR level. The traffic-light progression
 * (green, amber, red) gives a quick visual sense of how hard today's question
 * is meant to feel.
 */
const LEVEL_BADGE: Record<Level, string> = {
  a1: '🟢 A1',
  a2: '🟢 A2',
  b1: '🟡 B1',
  b2: '🟡 B2',
  c1: '🔴 C1',
  c2: '🔴 C2',
};

/** Human-friendly label for each topic, shown in the question header. */
const TOPIC_LABEL: Record<Topic, string> = {
  vocabulary: 'Vocabulary',
  collocations: 'Collocations',
  'phrasal-verbs': 'Phrasal Verbs',
  idioms: 'Idioms',
  'confusing-pairs': 'Confusing Pairs',
  prepositions: 'Prepositions',
  grammar: 'Grammar',
};

/**
 * Build the poll question text: a small "level / topic" header followed by the
 * prompt. The header gives learners instant context for what they are
 * practising and how hard it should feel.
 */
export function buildPrompt(question: LeveledQuestion): string {
  const badge = LEVEL_BADGE[question.level] ?? question.level.toUpperCase();
  const topic = TOPIC_LABEL[question.topic] ?? question.topic;
  return `${badge} · ${topic}\n\n${question.prompt}`;
}

/**
 * Convert our string options into the shape Grammy's sendPoll expects, while
 * validating count and length against Telegram's limits. Throws on bad input
 * so a mistake is caught in development, not silently sent to the channel.
 */
export function toPollOptions(options: string[]): { text: string }[] {
  if (options.length < MIN_OPTIONS) {
    throw new Error(`A poll needs at least ${MIN_OPTIONS} options, got ${options.length}.`);
  }
  if (options.length > MAX_OPTIONS) {
    throw new Error(`A poll allows at most ${MAX_OPTIONS} options, got ${options.length}.`);
  }
  for (const opt of options) {
    if (opt.length > OPTION_MAX_CHARS) {
      throw new Error(`Option exceeds ${OPTION_MAX_CHARS} chars: "${opt}".`);
    }
  }
  return options.map((text) => ({ text }));
}

/**
 * Clamp an explanation to Telegram's maximum length, preserving as much as
 * possible. Returns undefined for empty or whitespace-only input.
 */
export function clampExplanation(explanation: string | undefined): string | undefined {
  if (!explanation) return undefined;
  const trimmed = explanation.trim();
  if (trimmed.length === 0) return undefined;
  if (trimmed.length <= EXPLANATION_MAX_CHARS) return trimmed;
  return trimmed.slice(0, EXPLANATION_MAX_CHARS - 1) + '…';
}

/**
 * What to copy when shadowing each focus, phrased to drop into the "say it WITH
 * the speaker, copying the ___" instruction. Keeps the on-screen tip concrete.
 */
const FOCUS_PHRASE: Record<ShadowingFocus, string> = {
  linking: 'the way the words link together',
  stress: 'the rhythm and the stressed words',
  intonation: 'the melody, the rise and fall',
  reduction: 'the relaxed, reduced sounds',
  pacing: 'the pauses and the pacing',
};

/** Human-friendly label for each conversational function, shown on a phrase post. */
const FUNCTION_LABEL: Record<PhraseFunction, string> = {
  opinion: 'Giving an opinion',
  agreeing: 'Agreeing',
  disagreeing: 'Disagreeing politely',
  'small-talk': 'Small talk',
  softening: 'Softening',
  clarifying: 'Clarifying',
  reacting: 'Reacting',
  storytelling: 'Storytelling',
  transitions: 'Steering the conversation',
  requests: 'Making a request',
};

/**
 * Build the caption shown under a shadowing voice message: a header with the
 * level, the real-situation context, the line to copy in quotes, then the
 * listen-and-repeat instruction and a concrete tip.
 *
 * The whole caption is wrapped in a left-to-right bidi isolate (like the quiz
 * poll, see post.ts) so a leading emoji never flips to the wrong side for a
 * reader on an RTL-locale client. Stays plain text (no parse_mode) for the same
 * safety reason the kernel's poster does.
 */
export function buildShadowingCaption(clip: LeveledShadowingClip): string {
  const badge = LEVEL_BADGE[clip.level] ?? clip.level.toUpperCase();
  const caption = [
    `🎧 Shadow this  ·  ${badge}`,
    `💬 ${clip.context}`,
    '',
    `"${clip.text}"`,
    '',
    `▶️ Listen 2-3 times, then say it WITH the speaker, copying ${FOCUS_PHRASE[clip.focus]}.`,
    `🎯 ${clip.note}`,
  ].join('\n');
  return ltrIsolate(caption);
}

/** Human-friendly label for each pronunciation focus, shown on a drill post. */
const PRON_FOCUS_LABEL: Record<PronunciationFocus, string> = {
  'minimal-pair': 'Minimal pair',
  'connected-speech': 'Connected speech',
  'word-stress': 'Word stress',
  'weak-forms': 'Weak forms',
};

/**
 * Build the caption for a pronunciation drill voice message: a header with the
 * focus and level, the target and a plain explanation, the items the audio reads
 * aloud, then a listen-and-repeat instruction and a tip. Plain text in an LTR
 * isolate, like the other voice captions.
 */
export function buildPronunciationCaption(drill: LeveledPronunciationDrill): string {
  const badge = LEVEL_BADGE[drill.level] ?? drill.level.toUpperCase();
  const focus = PRON_FOCUS_LABEL[drill.focus] ?? drill.focus;
  const items = drill.items.map((i) => `• ${i}`);
  const caption = [
    `🔊 Pronunciation  ·  ${focus}  ·  ${badge}`,
    drill.title,
    '',
    drill.explanation,
    '',
    'Repeat after the speaker:',
    ...items,
    '',
    `🎯 ${drill.note}`,
  ].join('\n');
  return ltrIsolate(caption);
}

/** Escape the five characters that matter for Telegram's HTML parse mode. */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Build the caption for a role-play dialogue voice message: a header with the
 * level and situation, the exchange with "A:" / "B:" labels, then the
 * shadow-both-roles instruction and a tip. Like the shadowing caption, it is
 * plain text wrapped in a left-to-right isolate so a leading emoji never mirrors
 * on an RTL-locale client.
 */
export function buildDialogueCaption(dialogue: LeveledDialogue): string {
  const badge = LEVEL_BADGE[dialogue.level] ?? dialogue.level.toUpperCase();
  const lines = dialogue.turns.map((t) => `${t.speaker}: ${t.text}`);
  const caption = [
    `🎭 Role-play  ·  ${badge}`,
    `💬 ${dialogue.situation}`,
    '',
    ...lines,
    '',
    '▶️ Listen, then shadow BOTH roles out loud. Copy the rhythm and the natural replies.',
    `🎯 ${dialogue.note}`,
  ].join('\n');
  return ltrIsolate(caption);
}

/**
 * Build the caption for a grammar voice message: the rule, a plain explanation,
 * the example sentences (which the audio reads aloud), and a tip. Plain text in
 * an LTR isolate, like the other captions.
 */
export function buildGrammarCaption(rule: LeveledGrammarRule): string {
  const badge = LEVEL_BADGE[rule.level] ?? rule.level.toUpperCase();
  const examples = rule.examples.map((e) => `• ${e}`);
  const caption = [
    `📘 Grammar  ·  ${badge}`,
    rule.rule,
    '',
    rule.explanation,
    '',
    'Examples:',
    ...examples,
    '',
    `🎯 ${rule.note}`,
  ].join('\n');
  return ltrIsolate(caption);
}

/**
 * Build the caption for a monologue voice message: a header with the level and
 * topic, the passage in quotes, then the listen-and-retell instruction and a
 * tip. Plain text in an LTR isolate.
 */
export function buildMonologueCaption(monologue: LeveledMonologue): string {
  const badge = LEVEL_BADGE[monologue.level] ?? monologue.level.toUpperCase();
  const caption = [
    `🎙️ Listen & retell  ·  ${badge}`,
    `💬 ${monologue.topic}`,
    '',
    `"${monologue.text}"`,
    '',
    '▶️ Listen, then say it again in your own words. Aim for smooth, clear flow.',
    `🎯 ${monologue.note}`,
  ].join('\n');
  return ltrIsolate(caption);
}

/**
 * Build the caption for a question-prompt voice message: the question, then the
 * model answer, with the listen-pause-answer-compare instruction and a tip. In
 * the audio, a long silence sits between the question and the answer so the
 * learner can speak. Plain text in an LTR isolate.
 */
export function buildPromptCaption(prompt: LeveledPrompt): string {
  const badge = LEVEL_BADGE[prompt.level] ?? prompt.level.toUpperCase();
  const caption = [
    `🎤 Answer the question  ·  ${badge}`,
    `💬 ${prompt.topic}`,
    '',
    `❓ "${prompt.question}"`,
    `✅ Model answer: "${prompt.answer}"`,
    '',
    '▶️ Hear the question, pause the clip, answer out loud, then play on and compare with the model.',
    `🎯 ${prompt.note}`,
  ].join('\n');
  return ltrIsolate(caption);
}

/**
 * Build the HTML message for a "say it like a native" phrase: a header with the
 * level and the conversational function, the phrase itself in bold, when to use
 * it, and a worked example. Posted with parse_mode HTML (see post.ts), so the
 * dynamic fields are HTML-escaped here.
 */
export function buildPhraseMessage(phrase: LeveledNativePhrase): string {
  const badge = LEVEL_BADGE[phrase.level] ?? phrase.level.toUpperCase();
  const fn = FUNCTION_LABEL[phrase.fn] ?? phrase.fn;
  return [
    `🗣️ <b>Say it like a native</b>  ·  ${badge}`,
    `<i>${fn}</i>`,
    '',
    `💬 <b>"${escapeHtml(phrase.phrase)}"</b>`,
    `<b>When:</b> ${escapeHtml(phrase.situation)}`,
    `<b>Example:</b> ${escapeHtml(phrase.example)}`,
  ].join('\n');
}
