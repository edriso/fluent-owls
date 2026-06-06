# Adding and Editing Questions

Questions are plain TypeScript objects, one file per CEFR level:

```
src/content/questions-a1.ts
src/content/questions-a2.ts
src/content/questions-b1.ts
src/content/questions-b2.ts
src/content/questions-c1.ts
src/content/questions-c2.ts
```

The id prefix must match the file: a question in `questions-b1.ts` has an id like `b1-013`.

## The shape

```ts
type QuizQuestion = {
  id: string; // "b1-013", unique across all files, starts with the level
  prompt: string; // the sentence, with the target word blanked as "____"
  options: string[]; // 2 to 10 choices, each unique and <= 100 chars
  correctIndex: number; // 0-based index into options
  explanation: string; // <= 200 chars. Shown after the reader votes.
  topic: Topic; // 'vocabulary' | 'collocations' | 'phrasal-verbs'
  // | 'idioms' | 'confusing-pairs' | 'prepositions' | 'grammar'
};
```

The level is NOT written on each question. The content registry (`src/content/index.ts`) tags every question in a file with that file's level automatically. The exact numeric limits live in `src/lib/limits.ts` and are shared by the audit script and the tests, so they cannot drift.

## Authoring checklist

1. **Use a real, natural sentence.** The blank should sit in context a person would actually say or write. Good context is what teaches the word.
2. **Always include the blank.** Use exactly four underscores: `____`. The audit fails without it.
3. **Write plausible distractors.** The three wrong options should look tempting. The best distractors are the classic mistakes: `affect`/`effect`, `make`/`do`, `fewer`/`less`, the wrong preposition, a near-synonym that does not collocate.
4. **One clearly correct answer.** Avoid "both A and B work" unless the question is explicitly about that.
5. **Vary the correct position.** Do not always put the answer first. A predictable index makes a boring quiz.
6. **Teach in the explanation.** Reveal the rule or the why, not just "correct". Keep it under 200 characters. Even a wrong guess should leave the reader smarter.
7. **Match the level.** An A1 question tests survival vocabulary and the verb "to be"; a C2 question tests nuance (`flout`/`flaunt`, `soporific`, `wreak havoc`). See the spread already in each file.
8. **No em-dashes in any prose.** Use commas, colons, or separate sentences. Em-dashes read as machine-generated in a learning channel. A unit test enforces this.

## After you edit

```bash
pnpm audit-questions     # validates ids, options, indices, blanks, lengths
pnpm test                # runs the same checks plus picker and format tests
pnpm send-test midday    # optional: preview a slot in the channel
```

Both audit and test must pass before deploying.

## Picking is by day of year

The bot uses `dayOfYearIn(today, TZ) % pool.length` per band. So:

- Adding a question shifts the cycle by one for every later day. That is fine for a daily channel; readers will not notice.
- Do not try to pin a question to a specific date. Keep the banks flat and let the rotation do its job.

## How many questions is enough

The cycle length for a band equals the size of that band's pool (the levels it covers, combined). As a rule of thumb:

| Band pool size | Days until a repeat |
| -------------- | ------------------- |
| 60             | about two months    |
| 120            | about four months   |
| 180            | about six months    |

The project ships with 60 questions per level. Each daily slot pairs two levels, so a slot draws from 120 questions, roughly four months before any repeat. Add more whenever you have a good idea. There is no upper bound, and the cycle lengthens on its own. A test also guards that the correct answer is spread across positions (no single option holds more than 45% per level), so the quiz never becomes "always guess A".

## Topic ideas by level

- **A1 to A2**: everyday nouns and verbs, the verb "to be", articles, plurals, basic prepositions of place and time, the first phrasal verbs (turn off, get up, look after).
- **B1 to B2**: collocations (make a decision, do homework), common phrasal verbs, confusing pairs, dependent prepositions, conditionals, the passive, everyday idioms.
- **C1 to C2**: precise vocabulary, less common idioms, advanced collocations (cast doubt, wreak havoc), and the tricky pairs that catch even fluent speakers (discrete/discreet, elicit/illicit, principle/principal).
