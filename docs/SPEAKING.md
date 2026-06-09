# Adding Speaking Exercises (Shadowing + Native Phrases)

Alongside the quizzes, the bot posts several speaking exercises each day
(grammar, a native phrase, a role-play dialogue, a rotating bonus, and a
shadowing clip), and offers every type on demand in a DM. The banks:

- **Shadowing clips** — a short native audio line you listen to and repeat, to
  build a natural rhythm and accent. One file per CEFR level:
  `src/content/shadowing-a1.ts` ... `shadowing-c2.ts`.
- **Role-play dialogues** — a short two-voice exchange (2 to 4 turns) the learner
  shadows on both sides, for real-conversation practice. One file per level:
  `src/content/dialogues-a1.ts` ... `dialogues-c2.ts`.
- **Grammar points** — a short rule, a plain explanation, and example sentences
  the audio reads aloud (text plus sound). One file per level:
  `src/content/grammar-a1.ts` ... `grammar-c2.ts`.
- **Monologues** — a longer model passage to listen to and then retell in your
  own words. On demand (the /monologue command) and in the channel's rotating
  bonus slot. One file per level: `src/content/monologues-a1.ts` ... `monologues-c2.ts`.
- **Question prompts** — a question, a pause to answer out loud, then a model
  answer to compare with. On demand (the /prompt command) and in the bonus slot.
  One file per level: `src/content/prompts-a1.ts` ... `prompts-c2.ts`.
- **Pronunciation drills** — a sound contrast or speech feature (minimal pairs,
  connected speech, word stress, weak forms, sound-and-spelling), with the items
  read aloud to copy. On demand (the /pronounce command) and in the bonus slot. One
  file per level: `src/content/pronunciation-a1.ts` ... `pronunciation-c2.ts`.
- **Vocabulary** — one useful word taught in depth: meaning, examples read
  aloud, and a usage tip. On demand (the /vocab command) and in the bonus slot.
  One file per level: `src/content/vocabulary-a1.ts` ... `vocabulary-c2.ts`.
- **Idioms** — a common idiom with its meaning and worked examples, to sound
  native. On demand (the /idiom command) and in the bonus slot. One file per
  level: `src/content/idioms-a1.ts` ... `idioms-c2.ts`.
- **Stories** — a short narrative to listen to and retell, with a takeaway. On
  demand (the /story command) and in the bonus slot. One file per level:
  `src/content/stories-a1.ts` ... `stories-c2.ts`.
- **Useful talks** — a short, practical talk (focus, health, habits) from solid
  ideas, to listen to and learn from. On demand (the /talk command) and in the
  bonus slot. One file per level: `src/content/talks-a1.ts` ... `talks-c2.ts`.
- **"Say it like a native" phrases** — ready-made chunks for real situations,
  now voice messages (the chunk and example read aloud) with an HTML caption. One
  file per level: `src/content/phrases-a1.ts` ... `phrases-c2.ts`.

The id prefix must match the file and the type: a shadowing clip in
`shadowing-b1.ts` has an id like `b1-sh-013`; a phrase in `phrases-b1.ts` has an
id like `b1-ph-013`. The level is added automatically by the registry
(`src/content/shadowing.ts`, `src/content/phrases.ts`), so you never repeat it.

The exact numeric limits live in `src/lib/limits.ts` and are shared by the audit
script and the tests, so they cannot drift.

## Shadowing clips

```ts
type ShadowingClip = {
  id: string; // "b1-sh-013", unique, starts with the level and "-sh-"
  text: string; // the line to say. ALSO the exact script the audio is built from
  context: string; // short real-situation label, e.g. "Catching up with a friend"
  focus: 'linking' | 'stress' | 'intonation' | 'reduction' | 'pacing';
  note: string; // one concrete tip on HOW to say it, tied to the focus
  audio: string; // must be "<id>.ogg", e.g. "b1-sh-013.ogg"
};
```

Authoring checklist:

1. **Keep it short.** One natural sentence, or two short ones (about 8 to 20
   seconds spoken). Short lines are easy to repeat, which is the whole point.
2. **Make it real and natural.** Write what a native actually says in that
   situation, contractions and all ("How's it going?", not "How is it going?").
3. **Pick one focus.** Each clip drills one thing. The tip should match it: a
   `linking` clip gets a linking tip, an `intonation` clip an intonation tip.
4. **Write a concrete tip.** "Link 'meet you' so it sounds like 'mee-chu'." beats
   "say it naturally". Use plain spelling for sounds; learners are not phoneticians.
5. **Name the audio `<id>.ogg`.** The audit enforces this.
6. **No em-dashes.** House style. A test enforces it.

The `text` is both the on-screen transcript and the script the audio is
generated from, so the spoken clip and the caption can never drift.

## Role-play dialogues

```ts
type DialogueTurn = { speaker: 'A' | 'B'; text: string };
type Dialogue = {
  id: string; // "b1-dl-013", unique, starts with the level and "-dl-"
  situation: string; // short real-situation label, e.g. "Ordering at a café"
  turns: DialogueTurn[]; // 2 to 4 turns, ALTERNATING A, B, A, B...
  note: string; // a tip: a useful pattern or reply to copy
  audio: string; // must be "<id>.ogg"
};
```

Authoring checklist:

1. **Pick a real situation** the learner will actually face.
2. **Alternate speakers** strictly: turn 0 is A, turn 1 is B, and so on. The
   audit enforces this, because the audio gives A and B two different voices.
3. **Keep each line short and natural**, the way people really reply.
4. **Use the note to point out the pattern** worth stealing ("Decline softly
   with 'I'd love to, but...'").
5. **No em-dashes.** House style.

The two voices are chosen automatically in `scripts/generate-audio.ts` (speaker
A is the level's voice, speaker B is a contrasting partner voice). Each turn is
synthesized separately and stitched together with a short gap.

## Grammar points

```ts
type GrammarRule = {
  id: string; // "b1-gr-013", unique, starts with the level and "-gr-"
  rule: string; // short title, e.g. "Present perfect for experience"
  explanation: string; // one or two plain, junior-friendly sentences
  examples: string[]; // 2 or 3 example sentences (these are read aloud)
  note: string; // a tip or a common mistake to avoid
  audio: string; // must be "<id>.ogg"
};
```

Authoring checklist: keep the rule small and the explanation plain; give 2 or 3
natural examples (the audio reads them, with a small gap between each); point out
the common mistake in the note; no em-dashes.

## Monologues (model passages)

```ts
type Monologue = {
  id: string; // "b1-mn-013", unique, starts with the level and "-mn-"
  topic: string; // short label, e.g. "Describing your hometown"
  text: string; // a few sentences of clear, natural English (the script)
  note: string; // what to notice or aim for when retelling
  audio: string; // must be "<id>.ogg"
};
```

Authoring checklist: write clear, concise, native-sounding English; keep it short
enough to retell (well under the limit in `limits.ts`); scale length and richness
by level; no em-dashes. Monologues are pulled with the /monologue command, not
posted in the daily batch.

## Question prompts

```ts
type Prompt = {
  id: string; // "b1-pr-013", unique, starts with the level and "-pr-"
  topic: string; // short context label, e.g. "Talking about work"
  question: string; // the question the learner hears and answers
  answer: string; // a model answer, spoken after the pause
  note: string; // a useful structure or phrase to reuse
  audio: string; // must be "<id>.ogg"
};
```

Authoring checklist: ask a real, open question a person would actually be asked;
write a natural model answer that quietly teaches a reusable structure (call it
out in the note); scale difficulty by level; no em-dashes. In the audio, the
question and the answer use two different voices with a built-in pause between
them (set by `generate-audio.ts`), so the learner answers in the gap and then
compares with the model. Prompts are pulled with /prompt, not in the daily set.

## Native phrases

```ts
type NativePhrase = {
  id: string; // "b1-ph-013", unique, starts with the level and "-ph-"
  phrase: string; // the chunk itself, e.g. "I see your point, but ..."
  situation: string; // when to use it, e.g. "Disagreeing politely"
  example: string; // a full sentence using the phrase
  fn:
    | 'opinion'
    | 'agreeing'
    | 'disagreeing'
    | 'small-talk'
    | 'softening'
    | 'clarifying'
    | 'reacting'
    | 'storytelling'
    | 'transitions'
    | 'requests';
};
```

Authoring checklist:

1. **Pick a phrase people actually use.** Real, current, spoken English.
2. **Match the level.** A1 is "Can I have ..., please?"; C2 is "Be that as it
   may, ...". See the spread already in each file.
3. **Show when to use it** in `situation`, and **show it working** in `example`.
4. **No em-dashes.** House style.

## Generating the audio (one time, dev only)

The `.ogg` files are generated once and kept on disk. They are ElevenLabs output
under the owner's commercial license, so they are **git-ignored and not in the
repo** (see [`../NOTICE`](../NOTICE)); generate your own with the command below.
The running bot never calls a text-to-speech API, so production needs no key and
has no audio cost or extra failure mode.

You need an ElevenLabs API key and `ffmpeg` installed (`brew install ffmpeg`).

```bash
# In your .env (dev only): ELEVENLABS_API_KEY=...
pnpm generate-audio          # generates any clip that has no .ogg yet
pnpm generate-audio b1 c1    # only these levels
pnpm generate-audio --force  # regenerate everything
```

It is idempotent: clips that already have a `.ogg` are skipped, so after adding
new clips you just run it again and only the new ones are generated. It prints
the total character count up front (ElevenLabs bills ~1 credit per character on
the multilingual model), so you can check it against your plan before it runs.
The new `.ogg` files in `src/content/audio/` are git-ignored, so they stay on
your machine. To deploy them, rsync them to the production host's clip folder
(`/opt/bots/data/fluent-owls/audio`, bind-mounted read-only); see
[`DEPLOY.md`](./DEPLOY.md). Do not commit them.

Tip on cost: ElevenLabs commercial rights are perpetual once generated on a paid
plan, even after you cancel. A common path is to take a one-month plan, generate
a long runway of clips, then cancel. Avoid the free tier for a public channel: it
has no commercial license and forces "elevenlabs.io" into your title.

## After you edit

```bash
pnpm audit-speaking      # validates ids, fields, lengths, audio file names
pnpm test                # the same checks plus formatting and scheduler tests
pnpm generate-audio      # only if you added or changed shadowing clips
pnpm audit-speaking --require-audio   # pre-deploy: fail if any .ogg is missing
pnpm send-test shadow    # optional: preview the shadowing slot in the channel
pnpm send-test phrase    # optional: preview the phrase slot
```

## Picking and repeats

Like the quizzes, the picker is `dayOfYearIn(today, TZ) % pool.length`. The
shadowing and phrase slots pool every level, so the cycle length equals the
total number of items, at one post a day. The bank ships with 66 shadowing clips
per level (396 total, well over a year before a repeat), 48 dialogues per level
(288), 24 grammar points per level (144, the daily grammar slot, about 5
months), and 20 phrases per level (120, now voice messages with audio).
Monologues (34 per level, 204), question prompts (40 per level, 240),
pronunciation drills (20 per level, 120), vocabulary entries (34 per level, 204),
idioms (34 per level, 204), stories (18 to 19 per level, 110), and useful talks
(17 to 20 per level, 116) are pulled on demand AND surfaced in the channel's
rotating "bonus" slot (one type per day, cycling through all seven). Add more to
lengthen any cycle.
Every post shows its level, so mixing levels day to day is fine: learners
self-select.

Audio is cheap: run `pnpm audit-speaking` to see the total character count
(roughly 1 ElevenLabs credit per character on the multilingual model). The full
bank (2,146 voice clips, every speaking type including phrases, pronunciation,
vocabulary, idioms, stories, and useful talks) is around 238k credits to generate
once (spread across months as you add content), and the running bot never pays
again:
the clips are generated once and only ever read. Adding content and re-running
`pnpm generate-audio` only generates the new items (it is idempotent). Each CEFR
level has its own American voice (speaker A) plus a contrasting partner voice for
the two-speaker dialogues and prompts; keep new content on those same voices for
consistency, or override per level with `ELEVENLABS_VOICE_<LEVEL>` (see the
script header). The one exception is the talks bank: each talk is read by one of
a wider set of American voices (chosen by a stable hash of its id, see
`AMERICAN_TALK_VOICES` in the script), so the long talks have variety instead of
a single narrator.
