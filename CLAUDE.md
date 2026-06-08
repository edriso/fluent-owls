# Fluent Owls: Repo Guide

## What this is

A tiny Telegram bot (no database by default) that posts one short English set each day to one channel. The set has eight parts, posted together once a day (default 18:00) in this order: three native quiz polls (a beginner warm-up A1-A2, an intermediate B1-B2, an advanced challenge C1-C2), then a grammar point (rule plus spoken examples), then a "say it like a native" phrase for a real situation, then a role-play mini-dialogue (a two-voice exchange), then a rotating "bonus" (one richer type per day, cycling through vocabulary, idiom, story, talk, pronunciation, monologue, prompt, so the channel slowly shows the whole library), then an audio shadowing clip (listen and repeat). Only the last post (the shadowing clip) makes a notification sound, so followers get a single daily ping but still receive everything.

The aim is both halves of good English: the quizzes and grammar build what makes you _correct_; the phrase, dialogue, and shadowing clip build the chunks, the real back-and-forth, and the rhythm that make you _well spoken_ and natural. Quiz polls reveal the answer and a short explanation after the reader votes. Grammar, shadowing clips, dialogues, and monologues are voice messages with the text in the caption (a dialogue uses two voices, for speakers A and B).

Beyond the daily set, the bot answers on-demand commands in a DM (/quiz, /grammar, /phrase, /dialogue, /shadow, /monologue, /prompt, /pronounce, /vocab, /idiom, /story, /talk; /pron still works as a quiet alias), each a random pick, so a keen learner can pull more whenever they want. Each of these takes an OPTIONAL CEFR level so a learner can target their level (e.g. `/story b1`); with no level it draws from all of them (the filter is `poolForLevel` in `src/lib/select.ts`). `/listen` sends a random clip from ANY audio bank (the whole audio library in one command), and `/help` lists everything. `/grammar <topic>` (or just typing a topic like "present perfect" in a DM) searches the grammar bank and returns the matching point with its spoken examples. Monologues (longer model passages to retell), question prompts (hear a question, pause, answer, then a model answer), pronunciation drills (a sound contrast or speech feature, with words read aloud to copy), vocabulary entries (one useful word taught with meaning, examples, and a usage tip), idioms (a figurative expression with meaning and examples, to sound native), and stories (a short narrated story with a takeaway, for listening and retelling) are pulled on demand, AND each appears in the channel through the daily rotating "bonus" slot (see `BONUS_ROTATION` in `src/scheduler.ts`).

The channel is read-only by design, and the on-demand commands are stateless, so the default deployment has NO database. One opt-in feature, the personal tutor, needs per-user state: set `DATABASE_URL` and the bot also answers /next (your next item in sequence at your level), /level, /streak, and /reminders in DMs, and sends a once-a-day practice reminder (`REMINDER_CRON`, default 09:00) to learners who have not practised yet that day. Progress lives in the shared MariaDB via Prisma (schema applied by a `fluent-owls-migrate` step on deploy). Unset, none of that loads and the bot is the pure broadcaster. The bot cannot hear or grade a learner's speaking; it delivers a great model and a clear "do this", and the learner practises on their own. The bot exists to deliver good content on a schedule.

## Shared kernel

The cross-bot plumbing lives in **`telegram-broadcast-kit`** (a separate repo, pinned by git tag in `package.json` and bumped automatically by Renovate). fluent-owls imports from it instead of duplicating: the `logger`, the root `.env` loader (`loadEnv`), the cron `Scheduler` (error containment + node-cron v4 registry + cron validation), the `/health` server (`startHealthServer`, which reads `PORT` itself), and the poll sender (`sendPoll`, quiz mode). The quiz poll goes through `sendPoll` with `type: 'quiz'`, `correctOptionId` (0-based), and a clamped `explanation`; the kernel validates the quiz config and throws on bad input, or logs and returns null on a send failure.

Everything fluent-owls-specific stays here: the content banks (quizzes, shadowing clips, native phrases), the daily batch + per-slot dispatch (`runOnce`/`runDailyBatch`/`startScheduler` in `src/scheduler.ts`), the level/topic formatting and explanation clamp (`src/lib/format.ts`), the typed daily picker (`src/lib/pick.ts`, which reuses the kernel's `dayOfYearIn`), and the local posters (`src/lib/post.ts`). The posters are kept local on purpose: `postQuizPoll` wraps the kernel's `sendPoll`, but `postVoice` (shadowing audio via `bot.api.sendVoice`) and `postPlainMessage`/`postPhrase` (HTML, link preview off) call grammy directly because the kernel does not expose those shapes. To change shared code: edit the kernel, tag a new version, and merge the Renovate bump PR it opens here.

## Folder layout

```
fluent-owls/
├── src/
│   ├── index.ts          Entry point: builds the bot, the kernel scheduler, and the kernel /health server.
│   ├── config.ts         env loading (via the kernel's loadEnv). Required: BOT_TOKEN, CHANNEL_CHAT_ID. Optional: DATABASE_URL (tutor).
│   ├── database/         Optional personal-tutor DB (Prisma + adapter-mariadb). client.ts (client, null when no DATABASE_URL), learners.ts (service), generated/ (gitignored client). No-op when DATABASE_URL is unset.
│   ├── bot.ts            Grammy setup: /start, /about, on-demand content commands (/quiz, /grammar, ...), and one /admin_<slot> per batch slot.
│   ├── scheduler.ts      Domain layer over the kernel's Scheduler; runOnce dispatches by slot kind; runDailyBatch; findSlot; start/stopScheduler.
│   ├── schedules.ts      THE EDIT POINT for the batch order, slot kinds, level bands, and which slots are silent.
│   ├── types.ts          Level/Topic + QuizQuestion, ShadowingClip, Dialogue, GrammarRule, Monologue, Prompt, NativePhrase (and Leveled* forms), LEVELS.
│   ├── content/
│   │   ├── questions-a1.ts ... questions-c2.ts   One quiz bank per CEFR level.
│   │   ├── shadowing-a1.ts ... shadowing-c2.ts   One shadowing-clip bank per level.
│   │   ├── dialogues-a1.ts ... dialogues-c2.ts   One role-play dialogue bank per level.
│   │   ├── grammar-a1.ts ... grammar-c2.ts       One grammar bank per level.
│   │   ├── monologues-a1.ts ... monologues-c2.ts One monologue bank per level (on-demand).
│   │   ├── prompts-a1.ts ... prompts-c2.ts       One question-prompt bank per level (on-demand).
│   │   ├── pronunciation-a1.ts ... pronunciation-c2.ts One pronunciation-drill bank per level (on-demand).
│   │   ├── vocabulary-a1.ts ... vocabulary-c2.ts One vocabulary bank per level (on-demand).
│   │   ├── idioms-a1.ts ... idioms-c2.ts         One idiom bank per level (on-demand).
│   │   ├── stories-a1.ts ... stories-c2.ts       One short-story bank per level (on-demand).
│   │   ├── talks-a1.ts ... talks-c2.ts           One useful-talk bank per level (on-demand).
│   │   ├── phrases-a1.ts ... phrases-c2.ts       One native-phrase bank per level.
│   │   ├── index.ts        Quiz registry: tags each bank with its level, builds pools.
│   │   ├── shadowing.ts     Shadowing registry (ALL_SHADOWING, shadowingPool).
│   │   ├── dialogues.ts     Dialogue registry (ALL_DIALOGUES, dialoguesPool).
│   │   ├── grammar.ts       Grammar registry (ALL_GRAMMAR, grammarPool).
│   │   ├── monologues.ts    Monologue registry (ALL_MONOLOGUES, monologuesPool).
│   │   ├── prompts.ts       Prompt registry (ALL_PROMPTS, promptsPool).
│   │   ├── pronunciation.ts Pronunciation registry (ALL_PRONUNCIATION, pronunciationPool).
│   │   ├── vocabulary.ts    Vocabulary registry (ALL_VOCABULARY, vocabularyPool).
│   │   ├── idioms.ts        Idiom registry (ALL_IDIOMS, idiomsPool).
│   │   ├── stories.ts       Story registry (ALL_STORIES, storiesPool).
│   │   ├── talks.ts        Talk registry (ALL_TALKS, talksPool).
│   │   ├── phrases.ts       Phrase registry (ALL_PHRASES, phrasesPool).
│   │   ├── pool.ts          Generic interleave-by-level helper, shared by every registry.
│   │   ├── audio-path.ts    Where the committed .ogg clips live and how to find one.
│   │   ├── audio/           Committed OGG/Opus clips for every audio kind (generated once, see scripts).
│   │   └── welcome.ts      Pinned welcome message body (HTML).
│   └── lib/
│       ├── limits.ts     Telegram limits for polls + speaking content (shared by audits + tests).
│       ├── pick.ts       Typed day-of-year picker (reuses the kernel's dayOfYearIn).
│       ├── streak.ts     Pure streak math for the tutor (dayKeyIn, nextStreak), unit-tested, no DB.
│       ├── tutor.ts      Pure /next selection: round-robin kind + per-kind cursor -> typed item.
│       ├── search.ts     Keyword search over the grammar bank (for /grammar <topic> and free-text DM questions).
│       ├── format.ts     buildPrompt/toPollOptions/clampExplanation + caption builders (shadowing, dialogue, grammar, monologue) + buildPhraseMessage.
│       └── post.ts       postQuizPoll, postVoice/postDialogue/postGrammar/postMonologue (sendVoice), postPhrase/postPlainMessage; all take an optional chatId (default channel) for DM commands.
├── scripts/
│   ├── send-test.ts       Manual dev sender (any slot name, or all).
│   ├── post-welcome.ts    Post or edit-in-place the pinned welcome message.
│   ├── audit-questions.ts Validate the quiz banks (ids, options, indices, lengths).
│   ├── audit-speaking.ts  Validate the shadowing, dialogue, grammar, monologue, prompt, and phrase banks.
│   └── generate-audio.ts  DEV ONLY: ElevenLabs TTS -> ffmpeg -> OGG (one per-level voice for the narration types: shadowing/grammar/monologue/story/vocab/idiom/pron/phrase; two stitched for dialogues/prompts; talks rotate a wider American-voice set by id), idempotent.
├── tests/                Vitest unit tests, no network.
├── docs/
│   ├── DEPLOY.md         Host-agnostic deploy notes.
│   ├── QUESTIONS.md      How to add a quiz question.
│   ├── SPEAKING.md       How to add any speaking item (shadowing, dialogue, grammar, monologue, prompt, phrase) and generate audio.
│   ├── TUTOR.md          The optional personal-tutor database (commands, schema, setup).
│   └── channel-description.md  Copy-paste channel description options + the longer blurb.
├── prisma/               schema.prisma (Learner model) + migrations/ (for the optional tutor).
├── prisma.config.ts      Prisma 7 CLI config (schema path, migrations path, DATABASE_URL).
├── .env.example          All env vars documented.
├── package.json          Includes db:generate / db:deploy / db:migrate scripts and postinstall generate.
└── tsconfig.json
```

## Tech stack

| Layer    | Choice                                                              |
| -------- | ------------------------------------------------------------------- |
| Bot      | TypeScript, Grammy, node-cron v4, Node 20+                          |
| Kernel   | `telegram-broadcast-kit` (logger, env, Scheduler, health, poll)     |
| Storage  | none by default; optional MariaDB via Prisma for the personal tutor |
| Packager | pnpm                                                                |
| Tests    | Vitest, no network                                                  |

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
- **Monologues, prompts, pronunciation, vocabulary, idioms, and stories are on-demand, not daily.** Longer model passages (/monologue, listen then retell), question-prompt drills (/prompt, hear a question, pause, answer, compare), pronunciation drills (/pronounce, a sound contrast or speech feature with words read aloud), vocabulary (/vocab, one word taught in depth), idioms (/idiom, a figurative expression), stories (/story, a short narrated story), and useful talks (/talk, an informative mini-talk on a life skill) would make the daily batch too heavy, so they live in the banks and are pulled on demand. This keeps the daily set focused while still offering depth and the most credit-heavy audio. A prompt clip is the question voice, a built-in answer pause (a few seconds), then the model answer in a second voice; a pronunciation clip reads the drill's items with small gaps in one voice. All are stitched by `generate-audio.ts`.
- **Pronunciation is its own content type.** A `PronunciationDrill` (`src/content/pronunciation-*.ts`, registry `pronunciation.ts`) targets one of five `focus` kinds: minimal-pair (ship/sheep), connected-speech (gonna, didja), word-stress (REcord vs reCORD), weak-forms (to -> tuh), or spelling-sound (silent letters, -ed endings, "ough"). The audio reads the `items` aloud so the learner hears the contrast and copies it. It follows the same shape as the other voice types (level banks, `interleaveByLevel` pool, an `audio` field of `<id>.ogg`, an LTR-isolated caption, audit + tests), so there is nothing new to reason about in the rotation.
- **Vocabulary is its own content type.** A `VocabularyEntry` (`src/content/vocabulary-*.ts`, registry `vocabulary.ts`) teaches one word in depth: a plain `meaning`, 2 to 3 `examples`, and a usage `note` (collocation, synonym, or common mistake). It posts as a voice message (the word and examples read aloud) with an HTML caption, via `postVocabulary`. Unlike a quiz (which tests a word) or a phrase (a whole chunk), it builds word knowledge with correct pronunciation. Same shape as the other voice types; the audit also enforces a unique word per entry.
- **Idioms are their own content type.** An `IdiomEntry` (`src/content/idioms-*.ts`, registry `idioms.ts`, marker `idm`) teaches a figurative expression you cannot decode from the words (e.g. "break the ice"): a plain `meaning`, 2 to 3 `examples`, and a register/usage `note`. It posts as a voice message (the idiom and examples read aloud) with an HTML caption, via `postIdiom`. Idioms are what most make speech sound native. Same shape and audit (incl. a unique-idiom check) as vocabulary.
- **Stories are their own content type.** A `Story` (`src/content/stories-*.ts`, registry `stories.ts`, marker `st`) is a short narrated story (a few sentences with a beginning, middle, and end) plus a takeaway `note`. It posts as a voice message (the story narrated, single voice) with an LTR-isolated plain caption, via `postStory`. Unlike a monologue (a first-person model to retell), a story is a third-person narrative to listen to and enjoy; it is longer (`STORY_MAX_CHARS` 700), so it builds listening stamina and narrative rhythm. Same shape, audit, and tests as the monologue type.
- **Talks are their own content type.** A `Talk` (`src/content/talks-*.ts`, registry `talks.ts`, marker `tk`) is a short informative mini-talk on a useful life skill (deep work, social-media use, healthy eating, exercise, sleep, habits), grounded in mainstream, safely-framed advice (no medical claims). It posts as a voice message (the talk narrated) with an LTR-isolated plain caption, via `postTalk`. Same long-audio shape (`TALK_MAX_CHARS` 700) and tests as stories; it gives the channel real-world value beyond language drills while being extended-listening practice. Unlike the other types, talks do NOT use the single per-level voice: each talk is read by one of a wider set of American voices, chosen by a stable hash of its id (`AMERICAN_TALK_VOICES` / `voiceForTalk` in `scripts/generate-audio.ts`), so the long talks vary instead of sounding like one narrator.
- **Phrases are voice messages too.** The "say it like a native" phrase now posts via `sendVoice` (the audio reads the chunk and the example aloud) with the same HTML caption as before, so learners read AND hear the chunk. Phrases are the one voice type with no `audio` field: the file name is derived from the id (`<id>.ogg`) in `postPhrase` and `generate-audio.ts`, to avoid an `audio` line on every one of the many phrase objects.
- **On-demand commands are stateless; the tutor is the one stateful, opt-in extra.** The random commands (/quiz, /grammar, ...) and the grammar search (`/grammar <topic>` / free-text DM, via `src/lib/search.ts`) need no per-user state, so they keep the no-DB default. The personal tutor (/next, /level, /streak, /reminders, plus the daily reminder cron) is the one feature that genuinely needs per-user progress, so it is gated behind `DATABASE_URL`: present -> tutor on; absent -> the DB modules export null/no-ops, the tutor commands hide and the reminder job is not scheduled.
- **Prisma + adapter-mariadb, matching the fleet.** The tutor uses Prisma like the tilawah bot, so it fits the shared-MariaDB + `<bot>-migrate` deploy convention. The `prisma-client` generator emits an ESM client into `src/database/generated` (gitignored; `prisma generate` runs via postinstall and explicitly in the Dockerfile builder). The connection URL is supplied at runtime by the driver adapter (no binary query engine). Tables are created by `prisma migrate deploy` (the `fluent-owls-migrate` service that targets the build stage), not at runtime. The pure logic (streak math, item selection) lives in `src/lib/streak.ts` and `src/lib/tutor.ts` and is unit-tested without a DB.
- **Evening, one ping.** `DAILY_CRON` defaults to 18:00 because educational channels get the most engagement on weekday evenings, and one focused daily drop beats scattering posts. The batch still rings only once (the last post), so a follower gets a single daily notification however many slots there are.

## How to change what it posts

**A quiz question:**

1. **Pick the right file.** `src/content/questions-<level>.ts`. The id prefix must match the level (`b1-`).
2. **Edit or append** a `QuizQuestion`. See `docs/QUESTIONS.md` for the checklist.
3. **Validate.** `pnpm audit-questions && pnpm test`.
4. **Preview.** `pnpm send-test midday` posts a slot to the channel now.
5. **Redeploy.**

**A shadowing clip or a native phrase:** see `docs/SPEAKING.md`. In short: edit `src/content/shadowing-<level>.ts` (id like `b1-sh-013`) or `phrases-<level>.ts` (id like `b1-ph-013`), run `pnpm audit-speaking && pnpm test`, then for a new shadowing clip run `pnpm generate-audio` and commit the new `.ogg`. Preview with `pnpm send-test shadow` or `pnpm send-test phrase`. `pnpm audit-all` runs both audits at once (the name avoids pnpm's built-in `audit`).

To change WHEN the set posts, set `DAILY_CRON`. To change the ORDER, the slot KINDS, WHICH levels a slot covers, or WHICH slots are silent, edit `src/schedules.ts` (each slot has a `kind`: `quiz`, `grammar`, `phrase`, `dialogue`, `bonus`, or `shadow`). The `bonus` kind rotates the richer types day by day via `BONUS_ROTATION` in `src/scheduler.ts`.

## Environment variables

| Variable              | Required | Notes                                                                                                                                                                  |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BOT_TOKEN`           | yes      | From `@BotFather`.                                                                                                                                                     |
| `CHANNEL_CHAT_ID`     | yes      | Numeric `-100...` is best; `@channel` also works.                                                                                                                      |
| `CHANNEL_PUBLIC_URL`  | no       | Public link shown by `/start` in DMs.                                                                                                                                  |
| `ADMIN_TELEGRAM_ID`   | no       | Unlocks the `/admin_*` slot commands in DMs.                                                                                                                           |
| `TZ_NAME`             | no       | Cron timezone. Default Africa/Cairo.                                                                                                                                   |
| `DAILY_CRON`          | no       | When the daily set posts (default `0 18 * * *`).                                                                                                                       |
| `REMINDER_CRON`       | no       | When the per-user practice reminder fires (default `0 9 * * *`, tutor only).                                                                                           |
| `DATABASE_URL`        | no       | Enables the personal tutor (/next, /level, /streak, /reminders). MySQL/MariaDB via Prisma; schema applied by the migrate step. Unset = no database. See docs/TUTOR.md. |
| `PORT`                | no       | `/health` server port. Default 8080.                                                                                                                                   |
| `NODE_ENV`            | no       | `production` for hosted.                                                                                                                                               |
| `ELEVENLABS_API_KEY`  | dev only | Only for `pnpm generate-audio`. Never read at runtime.                                                                                                                 |
| `ELEVENLABS_VOICE_ID` | dev only | Optional. Force one voice (else two American voices alternate).                                                                                                        |
| `ELEVENLABS_MODEL_ID` | dev only | Optional. Defaults to `eleven_multilingual_v2`.                                                                                                                        |

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
- The pronunciation banks: unique `<level>-pn-` ids, title/explanation/note within limits, 2 to 6 items within limits, a valid focus, a caption that renders and is LTR-pinned, an audio name of `<id>.ogg`, and no em-dashes.
- The vocabulary banks: unique `<level>-vc-` ids, a unique word per entry, word/meaning/note within limits, 2 to 3 examples within limits, a rendered HTML caption that contains the word, an audio name of `<id>.ogg`, and no em-dashes.
- The idiom banks: unique `<level>-idm-` ids, a unique idiom per entry, idiom/meaning/note within limits, 2 to 3 examples within limits, a rendered HTML caption that contains the idiom, an audio name of `<id>.ogg`, and no em-dashes.
- The story banks: unique `<level>-st-` ids, title/text/note within limits, a caption that renders and is LTR-pinned, an audio name of `<id>.ogg`, and no em-dashes.
- The talk banks: unique `<level>-tk-` ids, topic/text/note within limits, a caption that renders and is LTR-pinned, an audio name of `<id>.ogg`, and no em-dashes.
- The phrase banks: unique `<level>-ph-` ids, phrase/situation/example within limits, a valid function, a rendered caption that contains the phrase, and no em-dashes.
- `pickForDay`: deterministic, cycles the pool, throws on empty (the typed picker; the kernel tests its timezone `dayOfYearIn`).
- The caption/message builders (shadowing, dialogue, grammar, monologue, phrase) plus `buildPrompt` / `toPollOptions` / `clampExplanation`: headers, validation, clamping, LTR isolation, HTML escaping.
- `runOnce` / `runDailyBatch` / `findSlot`: the batch posts every slot in the kind its schedule declares (quiz->poll, grammar/dialogue/shadow->voice, phrase->message), in order, with only the last one audible, and survives a total send failure.
- The tutor logic: `nextStreak`/`dayKeyIn` (streak math: start, no double-count, consecutive, gap, month boundary) and `pickNext`/`kindForStep` (round-robin kind, sequence cursor, level-correct item, wrap-around). Both are pure and need no database.
- `searchGrammar`: finds the right grammar point by topic words, ignores stopwords, returns null for nonsense. Pure, no database.
- `channelUrlFrom`: the `/start` DM link (port resolution moved to the kernel).
- `audio-path`: `countAudioClips` counts the committed `.ogg` files and `audioPathFor` resolves under `AUDIO_DIR`. This backs the boot-time check in `index.ts` that logs loudly when the audio is missing from the running image (the bug that once left every voice post silent). It does NOT assert per-item audio parity: that stays the opt-in `pnpm audit-speaking --require-audio` gate, since content may be valid before its clips exist.

No test needs a real bot token, a specific audio file, or a database; `vitest.config.ts` injects placeholders (no `DATABASE_URL`, so the tutor stays off in tests) and the posters are mocked. `audio-path.test.ts` only reads the committed clip directory, not any individual clip. `pnpm audit-all` (quizzes + speaking) is a separate, network-free data check.

## Common gotchas

- **Channel admin rights**: the bot must be a channel admin with "Post messages" on, or `sendPoll` returns 403.
- **Numeric chat id is safest**: `-1001234567890` survives a username change; `@channel` does not.
- **Quiz polls go through the kernel's `sendPoll`**: pass `type: 'quiz'`, `correctOptionId` (0-based), a clamped `explanation`, and `direction: 'ltr'`. The kernel validates the quiz config and throws on a bad index / over-long explanation (a programming bug, surfaced loudly), and logs + returns null on a network failure. See `src/lib/post.ts`.
- **Poll text is pinned left-to-right**: the kernel wraps a poll's plain-text question and options in a bidi isolate, defaulting to RTL (its Arabic origin). Our content is English, so `postQuizPoll` passes `direction: 'ltr'` (kit v0.2.2+); without it the poll mirrors for the reader (a leading emoji/number flips to the wrong side). A scheduler test guards that the posted question starts with the LTR isolate mark.
- **Polls are always anonymous**: by design. Nobody can see who voted, including the bot.
- **All audio must be generated and committed**: the voice posters (`postVoice`, `postDialogue`, `postGrammar`, `postMonologue`) read `src/content/audio/<id>.ogg` from disk and upload via `sendVoice`. A missing file is caught and logged ("is the audio generated?") and the rest of the batch still posts. Run `pnpm generate-audio` (needs `ELEVENLABS_API_KEY` and `ffmpeg`), then commit the files. `pnpm audit-speaking --require-audio` fails on any gap across all four audio kinds, for a pre-deploy gate. Dialogues (one call per turn) and grammar (one call per example) make several calls and concatenate, so they use more credits per item than a single shadowing clip.
- **On-demand commands reply to the asker, not the channel**: every poster takes an optional `chatId` (default `config.channelChatId`). The /quiz, /grammar, /phrase, /dialogue, /shadow, /monologue, /prompt handlers pass `ctx.chat.id`, so a DM request gets a private reply. Random picks use `Math.random` (fine in the bot runtime).
- **The tutor is optional and Prisma-backed**: `src/database/client.ts` builds the Prisma client only when `DATABASE_URL` is set (`prisma`/`dbEnabled` are null/false otherwise). The /next, /level, /streak handlers and `setMyCommands` all branch on `dbEnabled`, so without a database they degrade cleanly and never appear. Tables come from `prisma migrate deploy` via the `fluent-owls-migrate` service (NOT at runtime). To change the schema: edit `prisma/schema.prisma`, run `pnpm db:migrate` against a dev DB to create a migration, commit it; the deploy applies it. `prisma generate` runs on `pnpm install` (postinstall) and in the Dockerfile builder, so a fresh checkout must install before typecheck (the generated client in `src/database/generated` is gitignored).
- **Audio path is resolved from `process.cwd()`** (the repo root), not from the compiled module, because `tsc` emits to `dist/` but never copies the `.ogg` files there. Start the bot from the project root (every documented recipe does). See `src/content/audio-path.ts`.
- **`generate-audio` must not import `src/config`**: that would require `BOT_TOKEN` just to make audio. It loads env via the kernel's `loadEnv` and reads `ELEVENLABS_*` directly.
- **The shadowing caption and the phrase message are pinned/escaped too**: `buildShadowingCaption` wraps the plain-text caption in an LTR isolate (same RTL-mirroring fix as the poll); `buildPhraseMessage` is HTML and escapes `& < >`. Keep both in mind when editing `format.ts`.

## Content values (halal, family-friendly)

This is a Muslim-run channel. ALL content must be halal and wholesome, the kind anyone of any age can read without harm:

- **No haram themes, not even in passing.** Do not mention or normalize alcohol (wine, beer, etc.), smoking/vaping, gambling, pork, dating/romance, or anything that could nudge a reader to try a forbidden thing or treat it as normal. This applies to every field a learner sees: quiz sentences, options, grammar examples, dialogues, stories, talks, idioms, pronunciation items, everything. A health message like "quit smoking" is still off limits here; just pick a neutral topic (sugar, fast food, a bad habit) instead.
- **No bad language.** No profanity, slurs, swear words (the "F word" and the like), crude insults, or vulgarity. Keep it clean and kind.
- **No adult or violent content.** Nothing sexual, gory, or otherwise unsuitable for all ages.
- **Prefer genuinely good content.** Topics that build the learner up: useful skills, good character, family, learning, health (framed positively), nature, work, kindness. The talks bank in particular sticks to mainstream, safely-framed advice (no medical claims).

When in doubt, choose the wholesome option. If you ever find content that breaks these rules, replace it with a clean alternative and regenerate its audio (`pnpm generate-audio`) so the spoken clip matches.

(Note for maintainers: a commit like "talks (+18)" means eighteen items were added; it is NOT an age rating. All content here is all-ages.)

## Style and Git

- Plain, junior-friendly English in both content and comments. Short sentences.
- **No em-dashes** anywhere. Use commas, colons, or separate sentences. A test enforces this for question content.
- Commit after each meaningful unit of work, on the `main` branch.
- Do NOT add `Co-Authored-By` lines to commit messages.
