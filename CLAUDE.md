# Fluent Owls: Repo Guide

## What this is

A tiny no-database Telegram bot that posts three short English quizzes each day to one channel: a beginner warm-up (A1, A2), an intermediate question (B1, B2), and an advanced challenge (C1, C2). All three post together once a day (default 14:00), in that order, and only the last one makes a notification sound, so followers get a single daily ping but still receive every question. Each post is a native Telegram quiz poll that reveals the correct answer and a short explanation after the reader votes.

The channel is read-only by design. No accounts, no leaderboards, no DMs to manage. The bot exists to deliver good content on a schedule.

## Folder layout

```
fluent-owls/
├── src/
│   ├── index.ts          Entry point (bot, scheduler, health server)
│   ├── config.ts         env loading. Required: BOT_TOKEN, CHANNEL_CHAT_ID.
│   ├── bot.ts            Grammy setup: /start, /about, /admin_morning|midday|evening.
│   ├── scheduler.ts      node-cron wiring; runOnce(slot, bot); findSlot(name).
│   ├── schedules.ts      THE EDIT POINT for the batch order, level bands, and which slots are silent.
│   ├── types.ts          Level, Topic, QuizQuestion, LeveledQuestion, LEVELS.
│   ├── health.ts         /health HTTP endpoint for platform liveness checks.
│   ├── content/
│   │   ├── questions-a1.ts ... questions-c2.ts   One bank per CEFR level.
│   │   ├── index.ts        Registry: tags each bank with its level, builds pools.
│   │   └── welcome.ts      Pinned welcome message body (HTML).
│   └── lib/
│       ├── logger.ts     Tiny structured console logger.
│       ├── limits.ts     Telegram poll limits (shared by audit + tests).
│       ├── pick.ts       Deterministic day-of-year picker (timezone aware).
│       ├── format.ts     buildPrompt, toPollOptions, clampExplanation.
│       └── post.ts       postQuizPoll, postPlainMessage, editChannelMessage.
├── scripts/
│   ├── send-test.ts      Manual dev sender (morning/midday/evening/all).
│   ├── post-welcome.ts   Post or edit-in-place the pinned welcome message.
│   └── audit-questions.ts Validate the banks (ids, options, indices, lengths).
├── tests/                Vitest unit tests, no network.
├── docs/
│   ├── DEPLOY.md         Host-agnostic deploy notes.
│   └── QUESTIONS.md      How to add a question.
├── .env.example          All env vars documented.
├── package.json
└── tsconfig.json
```

## Tech stack

| Layer    | Choice                                  |
| -------- | --------------------------------------- |
| Bot      | TypeScript, Grammy, node-cron, Node 20+ |
| Storage  | none, no database, no state file        |
| Packager | pnpm                                    |
| Tests    | Vitest, no network                      |

## Design choices

- **CEFR levels, not easy/hard.** Learners recognize A1 to C2, and it lets the channel target a band per slot. The `Level` union and the `LEVELS` array in `src/types.ts` are the single source of truth.
- **Contextual fill-in-the-blank.** Every question is a sentence with a `____` blank. The surrounding context teaches usage, which plain word lists cannot. This shape also scales across all seven topics.
- **One poll per question.** Unlike SQL Ninjas (which needs a separate context message because SQL is long), English answer words are short, so the sentence is the poll question and the words are the options. Simpler, one post, no scrolling.
- **No database, no state file.** Each band picks its question deterministically from `dayOfYearIn(date, TZ) % pool.length`. The same calendar day always returns the same question, so a restart cannot re-pick. Add questions to lengthen the cycle.
- **Quiz polls, anonymous.** Quiz polls reveal the answer and explanation on vote (the learn-by-doing loop). Anonymous means nothing to track and no privacy footprint.
- **Authors write plain questions; the registry tags the level.** `src/content/index.ts` attaches each file's level, so authors never repeat it.
- **`.env` is optional.** `src/config.ts` tries `import('dotenv')` and skips silently if absent. Required values still throw if missing.
- **No retries.** A failed Telegram call is logged; the next scheduled fire takes over. The bot is meant to run for years untouched.
- **Date math is timezone-safe.** `dayOfYearIn` uses `Intl.DateTimeFormat` with the timezone, never `Date.getDate()`, so a UTC host serving a Cairo-time channel still picks the right day.

## How to change what it posts

1. **Pick the right file.** `src/content/questions-<level>.ts`. The id prefix must match the level (`b1-`).
2. **Edit or append** a `QuizQuestion`. See `docs/QUESTIONS.md` for the checklist.
3. **Validate.** `pnpm audit-questions && pnpm test`.
4. **Preview.** `pnpm send-test midday` posts a slot to the channel now.
5. **Redeploy.**

To change WHEN the batch posts, set `DAILY_CRON`. To change WHICH levels a slot covers or WHICH slots are silent, edit `src/schedules.ts`.

## Environment variables

| Variable             | Required | Notes                                              |
| -------------------- | -------- | -------------------------------------------------- |
| `BOT_TOKEN`          | yes      | From `@BotFather`.                                 |
| `CHANNEL_CHAT_ID`    | yes      | Numeric `-100...` is best; `@channel` also works.  |
| `CHANNEL_PUBLIC_URL` | no       | Public link shown by `/start` in DMs.              |
| `ADMIN_TELEGRAM_ID`  | no       | Unlocks the `/admin_*` slot commands in DMs.       |
| `TZ_NAME`            | no       | Cron timezone. Default UTC.                        |
| `DAILY_CRON`         | no       | When the daily batch posts (default `0 14 * * *`). |
| `PORT`               | no       | `/health` server port. Default 8080.               |
| `NODE_ENV`           | no       | `production` for hosted.                           |

## Channel admin rights

The bot only needs **"Post messages"**. Quiz posts are never auto-deleted; the channel scrollback is the archive.

## Testing

`pnpm test` runs Vitest. The suite covers:

- The banks: every question has a unique level-prefixed id, 2 to 10 unique non-empty options under 100 chars, a `correctIndex` in range, a `____` blank, a rendered question under 300 chars, an explanation under 200 chars, and no em-dashes.
- `pickForDay`: deterministic, cycles the pool, throws on empty, respects the timezone.
- `buildPrompt` / `toPollOptions` / `clampExplanation`: header, validation, clamping.
- `channelUrlFrom` / `resolvePort`: link building and port defaults.

No test needs a real bot token; `vitest.config.ts` injects placeholders.

## Common gotchas

- **Channel admin rights**: the bot must be a channel admin with "Post messages" on, or `sendPoll` returns 403.
- **Numeric chat id is safest**: `-1001234567890` survives a username change; `@channel` does not.
- **`correct_option_ids`, not `correct_option_id`**: Bot API 9.x renamed this to a plural array. A single-element array keeps the quiz behaviour. See `src/lib/post.ts`.
- **Polls are always anonymous**: by design. Nobody can see who voted, including the bot.

## Style and Git

- Plain, junior-friendly English in both content and comments. Short sentences.
- **No em-dashes** anywhere. Use commas, colons, or separate sentences. A test enforces this for question content.
- Commit after each meaningful unit of work, on the `main` branch.
- Do NOT add `Co-Authored-By` lines to commit messages.
