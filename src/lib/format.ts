import type { Level, LeveledQuestion, Topic } from '../types';
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
