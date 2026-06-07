/**
 * A tiny keyword search over the grammar bank, so a learner can ASK about a
 * grammar point ("present perfect", "conditionals") and get the matching rule
 * with its spoken examples. Pure and testable: reads the static bank, no DB.
 */
import { ALL_GRAMMAR } from '../content/grammar';
import type { LeveledGrammarRule } from '../types';

// Very common words carry no topic signal and would otherwise inflate the score
// of unrelated rules (almost every explanation contains "use", "the", "when").
// Dropping them lets the distinctive words (e.g. "passive", "conditional") win.
const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'are',
  'was',
  'were',
  'with',
  'this',
  'that',
  'these',
  'those',
  'when',
  'what',
  'how',
  'why',
  'who',
  'use',
  'used',
  'using',
  'does',
  'did',
  'can',
  'could',
  'will',
  'would',
  'should',
  'about',
  'into',
  'from',
  'not',
  'but',
  'has',
  'have',
  'had',
  'its',
  'you',
  'your',
  'they',
  'them',
  'their',
  'she',
  'her',
  'his',
  'him',
  'verb',
  'word',
  'words',
  'sentence',
  'tense',
  'form',
  'grammar',
  'english',
]);

/**
 * Find the grammar rule that best matches a free-text query, by counting how
 * many of the query's distinctive words appear in the rule, explanation, and
 * examples. Returns the best match, or null if nothing matches.
 */
export function searchGrammar(query: string): LeveledGrammarRule | null {
  const terms = (query.toLowerCase().match(/[a-z]+/g) ?? []).filter(
    (t) => t.length > 2 && !STOPWORDS.has(t),
  );
  if (terms.length === 0) return null;

  let best: LeveledGrammarRule | null = null;
  let bestScore = 0;
  for (const rule of ALL_GRAMMAR) {
    const haystack = `${rule.rule} ${rule.explanation} ${rule.examples.join(' ')}`.toLowerCase();
    let score = 0;
    for (const term of terms) if (haystack.includes(term)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }
  return bestScore > 0 ? best : null;
}
