# Fluent Owls 🦉

A tiny Telegram bot that posts one short English set to a channel each day, so people can level up their English a little every day. The set is built to make you both **correct** and **well spoken**:

- **3 quizzes** (beginner to advanced): a fill-in-the-blank sentence with four options and an instant explanation, sent as a native Telegram quiz poll.
- **1 grammar point**: a short rule with a plain explanation and example sentences you can hear (text plus audio).
- **1 "say it like a native" phrase**: a ready-made chunk for a real situation, with when to use it and an example.
- **1 role-play mini-dialogue**: a short two-voice exchange to act out both sides, for real-conversation practice.
- **1 shadowing clip**: a short native-audio voice message with the transcript, to listen to and repeat (the fastest drill for a natural rhythm and accent).

Want more at any time? Message the bot **/quiz**, **/grammar**, **/phrase**, **/dialogue**, **/shadow**, **/monologue** (a longer passage to retell), or **/prompt** (a question to answer out loud, then compare with a model) and it sends one right away. No database; each is a stateless random pick.

The whole project is junior friendly on purpose. The content is short, the English is plain, and the code is small and well documented.

## Why this format

The questions use contextual fill-in-the-blank (a "cloze" sentence). This is one of the most effective and enjoyable ways to build a language:

- The sentence around the blank teaches how a word is really used, not just its dictionary meaning.
- A quiz poll gives instant, anonymous feedback. Nobody can see who voted what.
- It scales. The same simple shape works for vocabulary, collocations, phrasal verbs, idioms, prepositions, confusing pairs, and grammar.

## What it focuses on

Questions are organized by the international **CEFR** scale (A1 to C2) instead of "easy/hard", so learners always know where they stand. Each level mixes the skills that matter most at that stage. The biggest gains for intermediate and advanced learners come from collocations, phrasal verbs, and idioms, the things that make you sound natural rather than merely correct, so those get heavy weight from B1 upward.

## The daily batch

The whole set posts together once a day, in order, so a follower gets a single
notification but still receives everything. Only the last post makes a sound;
the rest are sent silently.

| Order | Slot     | Kind      | Levels         | Notification |
| ----- | -------- | --------- | -------------- | ------------ |
| 1     | Morning  | quiz      | A1, A2         | silent       |
| 2     | Midday   | quiz      | B1, B2         | silent       |
| 3     | Evening  | quiz      | C1, C2         | silent       |
| 4     | Grammar  | grammar   | all (A1 to C2) | silent       |
| 5     | Phrase   | phrase    | all (A1 to C2) | silent       |
| 6     | Dialogue | dialogue  | all (A1 to C2) | silent       |
| 7     | Shadow   | shadowing | all (A1 to C2) | rings        |

The quizzes climb the CEFR bands; the grammar, phrase, dialogue, and shadowing
slots pool every level and show the level on each post, so learners self-select.
The batch time is `DAILY_CRON` (default `0 18 * * *`, i.e. 18:00), run in the
timezone set by `TZ_NAME` (default UTC). Evening on a weekday is when
educational channels see the most engagement. The order and which slots are
silent live in `src/schedules.ts`.

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

## Adding content

- **A quiz question**: see [`docs/QUESTIONS.md`](docs/QUESTIONS.md). Append an object to the right `src/content/questions-<level>.ts`, then run `pnpm audit-questions` and `pnpm test`.
- **A speaking item** (shadowing clip, dialogue, grammar point, monologue, or native phrase): see [`docs/SPEAKING.md`](docs/SPEAKING.md). Append to the matching `src/content/*-<level>.ts`, run `pnpm audit-speaking` and `pnpm test`, then `pnpm generate-audio` for any new audio and commit the new `.ogg`.

If the checks pass, redeploy.

## On-demand commands

Beyond the daily set, the bot answers commands in a DM and replies with a random item: **/quiz**, **/grammar**, **/phrase**, **/dialogue**, **/shadow**, **/monologue**, **/prompt**. They are stateless (a random pick), so there is no database. A learner who wants extra practice just asks.

## The audio

The shadowing clips, role-play dialogues, grammar examples, monologues, and question prompts are AI-generated once with [ElevenLabs](https://elevenlabs.io) and committed as OGG/Opus under `src/content/audio/`. Shadowing, grammar, and monologues use one American voice per CEFR level; dialogues and prompts use two voices (an asker and an answerer), and prompts include a built-in pause so the learner can answer before the model. The running bot only reads the files, so production needs no text-to-speech key and has no audio cost. Generating is a one-time dev step (`pnpm generate-audio`, needs `ELEVENLABS_API_KEY` and `ffmpeg`); see [`docs/SPEAKING.md`](docs/SPEAKING.md). The audio is **not** covered by this repo's MIT license, see [`NOTICE`](NOTICE).

## Scripts

| Command                   | What it does                                                                  |
| ------------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`                | Start the bot locally with hot reload                                         |
| `pnpm start`              | Run the compiled bot (after `pnpm build`)                                     |
| `pnpm build`              | Compile TypeScript to `dist/`                                                 |
| `pnpm test`               | Run unit tests (no network)                                                   |
| `pnpm typecheck`          | TypeScript with no emit                                                       |
| `pnpm audit-questions`    | Validate the question banks                                                   |
| `pnpm audit-speaking`     | Validate the shadowing, dialogue, grammar, monologue, and phrase banks        |
| `pnpm audit-all`          | Run both content audits                                                       |
| `pnpm generate-audio`     | Dev only: generate the audio `.ogg` clips (ElevenLabs)                        |
| `pnpm send-test [slot]`   | Post one slot now (morning/midday/evening/grammar/phrase/dialogue/shadow/all) |
| `pnpm post-welcome [id?]` | Post the welcome message, or edit it in place by id                           |
| `pnpm format`             | Prettier across the repo                                                      |

## Why no database

A daily question channel does not need accounts, saved votes, or a leaderboard. Telegram already tallies the anonymous quiz poll and reveals the answer on the spot. Staying stateless means fewer moving parts, no migrations, and no privacy footprint.

## License

Code: MIT (see [`LICENSE`](LICENSE)).

The generated voice clips in `src/content/audio/` are **not** MIT-licensed. They
are AI-generated with ElevenLabs under a commercial license and are subject to
the ElevenLabs Terms of Service. If you fork this project, generate your own
audio rather than reusing those files. See [`NOTICE`](NOTICE).
