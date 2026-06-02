# Fluent Owls 🦉

A tiny Telegram bot that posts three short English quizzes a day to a channel, so people can level up their English a little every day. Each quiz is a fill-in-the-blank sentence with four options and an instant explanation, sent as a native Telegram quiz poll.

The whole project is junior friendly on purpose. The questions are short, the English is plain, and the code is small and well documented.

## Why this format

The questions use contextual fill-in-the-blank (a "cloze" sentence). This is one of the most effective and enjoyable ways to build a language:

- The sentence around the blank teaches how a word is really used, not just its dictionary meaning.
- A quiz poll gives instant, anonymous feedback. Nobody can see who voted what.
- It scales. The same simple shape works for vocabulary, collocations, phrasal verbs, idioms, prepositions, confusing pairs, and grammar.

## What it focuses on

Questions are organized by the international **CEFR** scale (A1 to C2) instead of "easy/hard", so learners always know where they stand. Each level mixes the skills that matter most at that stage. The biggest gains for intermediate and advanced learners come from collocations, phrasal verbs, and idioms, the things that make you sound natural rather than merely correct, so those get heavy weight from B1 upward.

## The daily batch

All three quizzes post together once a day, in order (easy to hard), so a
follower gets a single notification but still receives every question. Only
the last post makes a sound; the first two are sent silently.

| Order | Slot    | Levels | Notification |
| ----- | ------- | ------ | ------------ |
| 1     | Morning | A1, A2 | silent       |
| 2     | Midday  | B1, B2 | silent       |
| 3     | Evening | C1, C2 | rings        |

The batch time is `DAILY_CRON` (default `0 14 * * *`, i.e. 14:00), run in the
timezone set by `TZ_NAME` (default UTC).

## Tech stack

| Part     | Choice                                     |
| -------- | ------------------------------------------ |
| Bot      | TypeScript, Grammy, node-cron v4, Node 20+ |
| Kernel   | `telegram-broadcast-kit` (shared plumbing) |
| Storage  | none, no database                          |
| Content  | TypeScript files in `src/content/`         |
| Packager | pnpm                                       |
| Tests    | Vitest, no network                         |

There is no database. All the questions live in source files. To add or change a question, you edit a file and redeploy.

The shared plumbing (logger, `.env` loader, the cron `Scheduler`, the `/health`
server, and the quiz-poll sender) comes from **`telegram-broadcast-kit`**, a
small kernel shared across this family of channel bots. It is pinned by git tag
in `package.json` and bumped automatically by Renovate (the only dependency
Renovate proposes here). Everything fluent-owls-specific (the question banks,
the daily batch, the level/topic formatting) stays in this repo.

## Quick start

```bash
pnpm install
cp .env.example .env        # then fill in BOT_TOKEN and CHANNEL_CHAT_ID
pnpm test                   # run the unit tests
pnpm audit-questions        # sanity-check the question banks
pnpm dev                    # run the bot locally
```

You need a bot from `@BotFather` and a channel where the bot is an admin with the "Post messages" permission.

## Picking is deterministic

The bot picks today's question with `dayOfYearIn(today, TZ) % poolSize` for each band. That means:

- The same calendar day always picks the same question, even if the process restarts.
- Each band advances independently across the year.
- Add more questions and the cycle lengthens automatically. No config needed.

## Adding a question

See [`docs/QUESTIONS.md`](docs/QUESTIONS.md). The short version: append an object to the right `src/content/questions-<level>.ts` file, then run `pnpm audit-questions` and `pnpm test`. If both pass, redeploy.

## Scripts

| Command                   | What it does                                                  |
| ------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                | Start the bot locally with hot reload                         |
| `pnpm start`              | Run the compiled bot (after `pnpm build`)                     |
| `pnpm build`              | Compile TypeScript to `dist/`                                 |
| `pnpm test`               | Run unit tests (no network)                                   |
| `pnpm typecheck`          | TypeScript with no emit                                       |
| `pnpm audit-questions`    | Validate the question banks                                   |
| `pnpm send-test [slot]`   | Post one slot to the channel now (morning/midday/evening/all) |
| `pnpm post-welcome [id?]` | Post the welcome message, or edit it in place by id           |
| `pnpm format`             | Prettier across the repo                                      |

## Why no database

A daily question channel does not need accounts, saved votes, or a leaderboard. Telegram already tallies the anonymous quiz poll and reveals the answer on the spot. Staying stateless means fewer moving parts, no migrations, and no privacy footprint.

## License

MIT.
