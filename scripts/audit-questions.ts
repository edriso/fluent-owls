/**
 * Question-bank sanity checker. Run with `pnpm audit-questions`.
 *
 * Catches the mistakes the runtime will not: a duplicate id, an id that does
 * not match its level, an option over Telegram's 100-char limit, a missing or
 * over-long explanation, a correctIndex pointing at nothing, a missing blank,
 * or a rendered poll question over 300 chars. Pure data check: no network, no
 * bot token needed. Exits 1 on any failure so it can be wired into CI.
 */
import { ALL_QUESTIONS } from '../src/content/index';
import { buildPrompt } from '../src/lib/format';
import {
  EXPLANATION_MAX_CHARS,
  MAX_OPTIONS,
  MIN_OPTIONS,
  OPTION_MAX_CHARS,
  QUESTION_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

type Issue = { id: string; field: string; detail: string };
const issues: Issue[] = [];
const add = (id: string, field: string, detail: string) => issues.push({ id, field, detail });

const seenIds = new Set<string>();

for (const q of ALL_QUESTIONS) {
  // id must be unique and start with its level, e.g. "b1-007".
  if (seenIds.has(q.id)) {
    add(q.id, 'id', 'duplicate id');
  }
  seenIds.add(q.id);
  if (!q.id.startsWith(`${q.level}-`)) {
    add(q.id, 'id', `must start with "${q.level}-"`);
  }

  // Options: count, uniqueness, non-empty, length.
  if (q.options.length < MIN_OPTIONS || q.options.length > MAX_OPTIONS) {
    add(q.id, 'options', `must have ${MIN_OPTIONS}-${MAX_OPTIONS}, found ${q.options.length}`);
  }
  if (new Set(q.options).size !== q.options.length) {
    add(q.id, 'options', 'contains duplicate options');
  }
  q.options.forEach((opt, i) => {
    if (opt.trim().length === 0) add(q.id, `options[${i}]`, 'empty');
    if (opt.length > OPTION_MAX_CHARS) {
      add(q.id, `options[${i}]`, `length ${opt.length} > ${OPTION_MAX_CHARS}`);
    }
  });

  // correctIndex must point at a real option.
  if (
    !Number.isInteger(q.correctIndex) ||
    q.correctIndex < 0 ||
    q.correctIndex >= q.options.length
  ) {
    add(q.id, 'correctIndex', `out of range: ${q.correctIndex}`);
  }

  // Prompt: must carry a fill-in-the-blank "____" and render within the limit.
  if (!q.prompt.includes('____')) {
    add(q.id, 'prompt', 'missing the "____" blank');
  }
  const rendered = buildPrompt(q).length;
  if (rendered > QUESTION_MAX_CHARS) {
    add(q.id, 'prompt', `rendered question ${rendered} > ${QUESTION_MAX_CHARS}`);
  }

  // Explanation: present and within the Telegram limit.
  if (q.explanation.trim().length === 0) {
    add(q.id, 'explanation', 'empty');
  }
  if (q.explanation.length > EXPLANATION_MAX_CHARS) {
    add(q.id, 'explanation', `length ${q.explanation.length} > ${EXPLANATION_MAX_CHARS}`);
  }
}

// A small per-level summary so authors can see the spread at a glance.
for (const level of LEVELS) {
  const count = ALL_QUESTIONS.filter((q) => q.level === level).length;
  console.log(`  ${level.toUpperCase()}: ${count} questions`);
}
console.log(`Total: ${ALL_QUESTIONS.length} questions`);

if (issues.length === 0) {
  console.log('OK: all questions pass the audit.');
  process.exit(0);
}

console.error(`Found ${issues.length} issue(s):`);
for (const i of issues) {
  console.error(`  [${i.id}] ${i.field}: ${i.detail}`);
}
process.exit(1);
