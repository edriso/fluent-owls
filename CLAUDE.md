# Fluent Owls: Repo Guide

## What this is

A tiny no-database Telegram bot that posts one short English set each day to one channel. The set has seven parts, posted together once a day (default 18:00) in this order: three native quiz polls (a beginner warm-up A1-A2, an intermediate B1-B2, an advanced challenge C1-C2), then a grammar point (rule plus spoken examples), then a "say it like a native" phrase for a real situation, then a role-play mini-dialogue (a two-voice exchange), then an audio shadowing clip (listen and repeat). Only the last post (the shadowing clip) makes a notification sound, so followers get a single daily ping but still receive everything.

The aim is both halves of good English: the quizzes and grammar build what makes you _correct_; the phrase, dialogue, and shadowing clip build the chunks, the real back-and-forth, and the rhythm that make you _well spoken_ and natural. Quiz polls reveal the answer and a short explanation after the reader votes. Grammar, shadowing clips, dialogues, and monologues are voice messages with the text in the caption (a dialogue uses two voices, for speakers A and B).

Beyond the daily set, the bot answers on-demand commands in a DM (/quiz, /grammar, /phrase, /dialogue, /shadow, /monologue, /prompt), each a random pick, so a keen learner can pull more whenever they want. Monologues (longer model passages to retell) and question prompts (hear a question, pause, answer, then a model answer) are on-demand only, not in the daily batch.

The channel is read-only by design, and the on-demand commands are stateless, so there is still NO database. The bot cannot hear or grade a learner's speaking; it delivers a great model and a clear "do this", and the learner practises on their own (the same self-driven loop as the quiz). The bot exists to deliver good content on a schedule.

## Shared kernel

The cross-bot plumbing lives in **`telegram-broadcast-kit`** (a separate repo, pinned by git tag in `package.json` and bumped automatically by Renovate). fluent-owls imports from it instead of duplicating: the `logger`, the root `.env` loader (`loadEnv`), the cron `Scheduler` (error containment + node-cron v4 registry + cron validation), the `/health` server (`startHealthServer`, which reads `PORT` itself), and the poll sender (`sendPoll`, quiz mode). The quiz poll goes through `sendPoll` with `type: 'quiz'`, `correctOptionId` (0-based), and a clamped `explanation`; the kernel validates the quiz config and throws on bad input, or logs and returns null on a send failure.

Everything fluent-owls-specific stays here: the content banks (quizzes, shadowing clips, native phrases), the daily batch + per-slot dispatch (`runOnce`/`runDailyBatch`/`startScheduler` in `src/scheduler.ts`), the level/topic formatting and explanation clamp (`src/lib/format.ts`), the typed daily picker (`src/lib/pick.ts`, which reuses the kernel's `dayOfYearIn`), and the local posters (`src/lib/post.ts`). The posters are kept local on purpose: `postQuizPoll` wraps the kernel's `sendPoll`, but `postVoice` (shadowing audio via `bot.api.sendVoice`) and `postPlainMessage`/`postPhrase` (HTML, link preview off) call grammy directly because the kernel does not expose those shapes. To change shared code: edit the kernel, tag a new version, and merge the Renovate bump PR it opens here.

## Folder layout

```
fluent-owls/
├── src/
│   ├── index.ts          Entry point: builds the bot, the kernel scheduler, and the kernel /health server.
│   ├── config.ts         env loading (via the kernel's loadEnv). Required: BOT_TOKEN, CHANNEL_CHAT_ID.
│   ├── bot.ts            Grammy setup: /start, /about, on-demand content commands (/quiz, /grammar, ...), and one /admin_<slot> per batch slot.
│   ├── scheduler.ts      Domain layer over the kernel's Scheduler; runOnce dispatches by slot kind; runDailyBatch; findSlot; start/stopScheduler.
│   ├── schedules.ts      THE EDIT POINT for the batch order, slot kinds, level bands, and which slots are silent.
│   ├── types.ts          Level/Topic + QuizQuestion, ShadowingClip, NativePhrase (and their Leveled* forms), LEVELS.
│   ├── content/
│   │   ├── questions-a1.ts ... questions-c2.ts   One quiz bank per CEFR level.
│   │   ├── shadowing-a1.ts ... shadowing-c2.ts   One shadowing-clip bank per level.
│   │   ├── dialogues-a1.ts ... dialogues-c2.ts   One role-play dialogue bank per level.
│   │   ├── grammar-a1.ts ... grammar-c2.ts       One grammar bank per level.
│   │   ├── monologues-a1.ts ... monologues-c2.ts One monologue bank per level (on-demand).
│   │   ├── prompts-a1.ts ... prompts-c2.ts       One question-prompt bank per level (on-demand).
│   │   ├── phrases-a1.ts ... phrases-c2.ts       One native-phrase bank per level.
│   │   ├── index.ts        Quiz registry: tags each bank with its level, builds pools.
│   │   ├── shadowing.ts     Shadowing registry (ALL_SHADOWING, shadowingPool).
│   │   ├── dialogues.ts     Dialogue registry (ALL_DIALOGUES, dialoguesPool).
│   │   ├── grammar.ts       Grammar registry (ALL_GRAMMAR, grammarPool).
│   │   ├── monologues.ts    Monologue registry (ALL_MONOLOGUES, monologuesPool).
│   │   ├── prompts.ts       Prompt registry (ALL_PROMPTS, promptsPool).
│   │   ├── phrases.ts       Phrase registry (ALL_PHRASES, phrasesPool).
│   │   ├── pool.ts          Generic interleave-by-level helper, shared by all three registries.
│   │   ├── audio-path.ts    Where the committed .ogg clips live and how to find one.
│   │   ├── audio/           Committed OGG/Opus shadowing clips (generated once, see scripts).
│   │   └── welcome.ts      Pinned welcome message body (HTML).
│   └── lib/
│       ├── limits.ts     Telegram limits for polls + speaking content (shared by audits + tests).
│       ├── pick.ts       Typed day-of-year picker (reuses the kernel's dayOfYearIn).
│       ├── format.ts     buildPrompt/toPollOptions/clampExplanation + caption builders (shadowing, dialogue, grammar, monologue) + buildPhraseMessage.
│       └── post.ts       postQuizPoll, postVoice/postDialogue/postGrammar/postMonologue (sendVoice), postPhrase/postPlainMessage; all take an optional chatId (default channel) for DM commands.
├── scripts/
│   ├── send-test.ts       Manual dev sender (any slot name, or all).
│   ├── post-welcome.ts    Post or edit-in-place the pinned welcome message.
│   ├── audit-questions.ts Validate the quiz banks (ids, options, indices, lengths).
│   ├── audit-speaking.ts  Validate the shadowing, dialogue, and phrase banks (ids, fields, lengths, audio names).
│   └── generate-audio.ts  DEV ONLY: ElevenLabs TTS -> ffmpeg -> OGG (one voice for shadowing, two stitched for dialogues), idempotent.
├── tests/                Vitest unit tests, no network.
├── docs/
│   ├── DEPLOY.md         Host-agnostic deploy notes.
│   ├── QUESTIONS.md      How to add a quiz question.
│   └── SPEAKING.md       How to add a shadowing clip or a native phrase, and how to generate audio.
├── .env.example          All env vars documented.
├── package.json
└── tsconfig.json
```

## Tech stack

| Layer    | Choice                                                          |
| -------- | --------------------------------------------------------------- |
| Bot      | TypeScript, Grammy, node-cron v4, Node 20+                      |
| Kernel   | `telegram-broadcast-kit` (logger, env, Scheduler, health, poll) |
| Storage  | none, no database, no state file                                |
| Packager | pnpm                                                            |
| Tests    | Vitest, no network                                              |

## Design choices

- **CEFR levels, not easy/hard.** Learners recognize A1 to C2, and it lets the channel target a band per slot. The `Level` union and the `LEVELS` array in `src/types.ts` are the single source of truth.
- **Contextual fill-in-the-blank.** Every question is a sentence with a `____` blank. The surrounding context teaches usage, which plain word lists cannot. This shape also scales across all seven topics.
- **One poll per question.** Unlike SQL Ninjas (which needs a separate context message because SQL is long), English answer words are short, so the sentence is the poll question and the words are the options. Simpler, one post, no scrolling.
- **No database, no state file.** Each band picks its question deterministically from `dayOfYearIn(date, TZ) % pool.length`. The same calendar day always returns the same question, so a restart cannot re-pick. Add questions to lengthen the cycle.
- **Quiz polls, anonymous.** Quiz polls reveal the answer and explanation on vote (the learn-by-doing loop). Anonymous means nothing to track and no privacy footprint.
- **Authors write plain questions; the registry tags the level.** `src/content/index.ts` attaches each file's level, so authors never repeat it.
- **`.env` is loaded by the kernel.** `src/config.ts` calls the kernel's `loadEnv()`, which finds the project root and loads its `.env`. Production hosts inject env vars directly, so `loadEnv` is a harmless no-op then (dotenv never overrides an already-set variable). Required values still throw if missing.
- **No retries.** A failed Telegram call is logged; the next scheduled fire takes over. The bot is meant to run for years untouched.
- **Date math is timezone-safe.** `dayOfYearIn` uses `Intl.DateTimeFormat` with the timezone, never `Date.getDate()`, so a UTC host serving a Cairo-time channel still picks the right day.
- **Speaking, not just correctness.** Quizzes alone teach accuracy, not delivery. The three speaking exercises form a loop: native phrases give ready-made chunks, role-play dialogues train the real back-and-forth of conversation, and shadowing drills rhythm and accent. All fit a broadcast channel because they need no reply from the learner: the bot delivers the model, the learner practises (and self-compares). Each post shows its level, so the level-pooled speaking slots let anyone self-select.
- **Audio is pre-generated and committed, never made at runtime.** The shadowing `.ogg` files are created once by `scripts/generate-audio.ts` (ElevenLabs TTS, then ffmpeg to OGG/Opus) and checked into `src/content/audio/`. The running bot only reads them, so production needs no TTS key, has no audio cost, and gains no new failure mode. This is the same "runs for years untouched" ethos as the no-database rule. A clip's `text` is both the transcript shown in the caption and the script the audio is generated from, so the two cannot drift.
- **One generic interleave, three content types.** Quizzes, shadowing clips, and native phrases all use the same `interleaveByLevel` helper (`src/content/pool.ts`) and the same `pickForDay`, so they rotate identically and there is one rotation behaviour to reason about.
- **Shadowing and dialogues are voice messages, not audio files.** `postVoice`/`postDialogue` use `sendVoice` (not `sendAudio`), so a clip gets the inline waveform player and Telegram's built-in playback-speed control, which is exactly what a shadower wants.
- **Dialogues are two voices stitched into one clip.** A role-play has a speaker A and a speaker B with different voices. `generate-audio.ts` synthesizes each turn separately, then concatenates them with a short silence via ffmpeg, so one voice message sounds like a real exchange. The learner shadows both roles.
- **Grammar is text plus sound in one post.** A grammar voice message reads the example sentences aloud (with small gaps) while the caption shows the rule, a plain explanation, and those examples. So learners both read the rule and hear it used correctly, without a second message.
- **Monologues and prompts are on-demand, not daily.** Longer model passages (/monologue, listen then retell) and question-prompt drills (/prompt, hear a question, pause, answer, compare) would make the daily batch too heavy, so they live in the banks and are pulled on demand. This keeps the daily set focused while still offering depth and the most credit-heavy audio. A prompt clip is the question voice, a built-in answer pause (a few seconds), then the model answer in a second voice, all stitched by `generate-audio.ts`.
- **On-demand commands instead of a database.** The bot replies to /quiz, /grammar, /phrase, /dialogue, /shadow, /monologue with a random item, sent to whoever asked (the posters take an optional chatId). A random pick needs no per-user state, so the "no database" rule holds. A DB would only be worth it for per-user features (progress, streaks, a personal schedule, like the tilawah bot), which the channel does not need.
- **Evening, one ping.** `DAILY_CRON` defaults to 18:00 because educational channels get the most engagement on weekday evenings, and one focused daily drop beats scattering posts. The batch still rings only once (the last post), so a follower gets a single daily notification however many slots there are.

## How to change what it posts

**A quiz question:**

1. **Pick the right file.** `src/content/questions-<level>.ts`. The id prefix must match the level (`b1-`).
2. **Edit or append** a `QuizQuestion`. See `docs/QUESTIONS.md` for the checklist.
3. **Validate.** `pnpm audit-questions && pnpm test`.
4. **Preview.** `pnpm send-test midday` posts a slot to the channel now.
5. **Redeploy.**

**A shadowing clip or a native phrase:** see `docs/SPEAKING.md`. In short: edit `src/content/shadowing-<level>.ts` (id like `b1-sh-013`) or `phrases-<level>.ts` (id like `b1-ph-013`), run `pnpm audit-speaking && pnpm test`, then for a new shadowing clip run `pnpm generate-audio` and commit the new `.ogg`. Preview with `pnpm send-test shadow` or `pnpm send-test phrase`. `pnpm audit-all` runs both audits at once (the name avoids pnpm's built-in `audit`).

To change WHEN the set posts, set `DAILY_CRON`. To change the ORDER, the slot KINDS, WHICH levels a slot covers, or WHICH slots are silent, edit `src/schedules.ts` (each slot has a `kind`: `quiz`, `grammar`, `phrase`, `dialogue`, or `shadow`).

## Environment variables

| Variable              | Required | Notes                                                           |
| --------------------- | -------- | --------------------------------------------------------------- |
| `BOT_TOKEN`           | yes      | From `@BotFather`.                                              |
| `CHANNEL_CHAT_ID`     | yes      | Numeric `-100...` is best; `@channel` also works.               |
| `CHANNEL_PUBLIC_URL`  | no       | Public link shown by `/start` in DMs.                           |
| `ADMIN_TELEGRAM_ID`   | no       | Unlocks the `/admin_*` slot commands in DMs.                    |
| `TZ_NAME`             | no       | Cron timezone. Default UTC.                                     |
| `DAILY_CRON`          | no       | When the daily set posts (default `0 18 * * *`).                |
| `PORT`                | no       | `/health` server port. Default 8080.                            |
| `NODE_ENV`            | no       | `production` for hosted.                                        |
| `ELEVENLABS_API_KEY`  | dev only | Only for `pnpm generate-audio`. Never read at runtime.          |
| `ELEVENLABS_VOICE_ID` | dev only | Optional. Force one voice (else two American voices alternate). |
| `ELEVENLABS_MODEL_ID` | dev only | Optional. Defaults to `eleven_multilingual_v2`.                 |

The `ELEVENLABS_*` vars are used only by the audio-generation script. The running bot never touches a TTS API: it posts the committed `.ogg` files. Leave them unset in production.

## Channel admin rights

The bot only needs **"Post messages"**. Quiz posts are never auto-deleted; the channel scrollback is the archive.

## Testing

`pnpm test` runs Vitest. The suite covers:

- The quiz banks: every question has a unique level-prefixed id, 2 to 10 unique non-empty options under 100 chars, a `correctIndex` in range, a `____` blank, a rendered question under 300 chars, an explanation under 200 chars, and no em-dashes.
- The shadowing banks: unique `<level>-sh-` ids, a transcript/context/note within limits, an audio name of `<id>.ogg`, a caption that renders within the Telegram limit and is pinned left-to-right, a valid focus, and no em-dashes.
- The dialogue banks: unique `<level>-dl-` ids, 2 to 4 turns that alternate A/B, each line within limits, a caption that renders and is LTR-pinned, an audio name of `<id>.ogg`, and no em-dashes.
- The grammar banks: unique `<level>-gr-` ids, a rule/explanation/note within limits, 2 to 3 example sentences within limits, a caption that renders and is LTR-pinned, an audio name of `<id>.ogg`, and no em-dashes.
- The monologue banks: unique `<level>-mn-` ids, a topic/text/note within limits, a caption that renders and is LTR-pinned, an audio name of `<id>.ogg`, and no em-dashes.
- The prompt banks: unique `<level>-pr-` ids, topic/question/answer/note within limits, a caption that renders and is LTR-pinned, an audio name of `<id>.ogg`, and no em-dashes.
- The phrase banks: unique `<level>-ph-` ids, phrase/situation/example within limits, a valid function, a rendered message that contains the phrase, and no em-dashes.
- `pickForDay`: deterministic, cycles the pool, throws on empty (the typed picker; the kernel tests its timezone `dayOfYearIn`).
- The caption/message builders (shadowing, dialogue, grammar, monologue, phrase) plus `buildPrompt` / `toPollOptions` / `clampExplanation`: headers, validation, clamping, LTR isolation, HTML escaping.
- `runOnce` / `runDailyBatch` / `findSlot`: the batch posts every slot in the kind its schedule declares (quiz->poll, grammar/dialogue/shadow->voice, phrase->message), in order, with only the last one audible, and survives a total send failure.
- `channelUrlFrom`: the `/start` DM link (port resolution moved to the kernel).

No test needs a real bot token or any audio file; `vitest.config.ts` injects placeholders and the posters are mocked. `pnpm audit-all` (quizzes + speaking) is a separate, network-free data check.

## Common gotchas

- **Channel admin rights**: the bot must be a channel admin with "Post messages" on, or `sendPoll` returns 403.
- **Numeric chat id is safest**: `-1001234567890` survives a username change; `@channel` does not.
- **Quiz polls go through the kernel's `sendPoll`**: pass `type: 'quiz'`, `correctOptionId` (0-based), a clamped `explanation`, and `direction: 'ltr'`. The kernel validates the quiz config and throws on a bad index / over-long explanation (a programming bug, surfaced loudly), and logs + returns null on a network failure. See `src/lib/post.ts`.
- **Poll text is pinned left-to-right**: the kernel wraps a poll's plain-text question and options in a bidi isolate, defaulting to RTL (its Arabic origin). Our content is English, so `postQuizPoll` passes `direction: 'ltr'` (kit v0.2.2+); without it the poll mirrors for the reader (a leading emoji/number flips to the wrong side). A scheduler test guards that the posted question starts with the LTR isolate mark.
- **Polls are always anonymous**: by design. Nobody can see who voted, including the bot.
- **All audio must be generated and committed**: the voice posters (`postVoice`, `postDialogue`, `postGrammar`, `postMonologue`) read `src/content/audio/<id>.ogg` from disk and upload via `sendVoice`. A missing file is caught and logged ("is the audio generated?") and the rest of the batch still posts. Run `pnpm generate-audio` (needs `ELEVENLABS_API_KEY` and `ffmpeg`), then commit the files. `pnpm audit-speaking --require-audio` fails on any gap across all four audio kinds, for a pre-deploy gate. Dialogues (one call per turn) and grammar (one call per example) make several calls and concatenate, so they use more credits per item than a single shadowing clip.
- **On-demand commands reply to the asker, not the channel**: every poster takes an optional `chatId` (default `config.channelChatId`). The /quiz, /grammar, /phrase, /dialogue, /shadow, /monologue handlers pass `ctx.chat.id`, so a DM request gets a private reply. The picks are random (`Math.random`), which is fine here (this is the bot runtime, not a workflow script). No per-user state, so still no database.
- **Audio path is resolved from `process.cwd()`** (the repo root), not from the compiled module, because `tsc` emits to `dist/` but never copies the `.ogg` files there. Start the bot from the project root (every documented recipe does). See `src/content/audio-path.ts`.
- **`generate-audio` must not import `src/config`**: that would require `BOT_TOKEN` just to make audio. It loads env via the kernel's `loadEnv` and reads `ELEVENLABS_*` directly.
- **The shadowing caption and the phrase message are pinned/escaped too**: `buildShadowingCaption` wraps the plain-text caption in an LTR isolate (same RTL-mirroring fix as the poll); `buildPhraseMessage` is HTML and escapes `& < >`. Keep both in mind when editing `format.ts`.

## Style and Git

- Plain, junior-friendly English in both content and comments. Short sentences.
- **No em-dashes** anywhere. Use commas, colons, or separate sentences. A test enforces this for question content.
- Commit after each meaningful unit of work, on the `main` branch.
- Do NOT add `Co-Authored-By` lines to commit messages.
