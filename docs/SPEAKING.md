# Adding Speaking Exercises (Shadowing + Native Phrases)

Alongside the quizzes, the bot posts two speaking exercises each day:

- **Shadowing clips** — a short native audio line you listen to and repeat, to
  build a natural rhythm and accent. One file per CEFR level:
  `src/content/shadowing-a1.ts` ... `shadowing-c2.ts`.
- **"Say it like a native" phrases** — ready-made chunks for real situations
  (text only, no audio). One file per level: `src/content/phrases-a1.ts` ...
  `phrases-c2.ts`.

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

The shadowing `.ogg` files are generated once and committed. The running bot
never calls a text-to-speech API, so production needs no key and has no audio
cost or extra failure mode.

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
Commit the new `.ogg` files in `src/content/audio/` afterwards.

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
total number of clips (or phrases), at one post a day. The bank ships with 40
shadowing clips per level (240 total, about 8 months before a repeat) and 20
phrases per level (120 total, about 4 months). Add more to lengthen the cycle.
Every post shows its level, so mixing levels day to day is fine: learners
self-select.

Audio is cheap: run `pnpm audit-speaking` to see the total character count
(roughly 1 ElevenLabs credit per character on the multilingual model). Even the
full 240-clip bank is well under 10k credits, a small fraction of a Creator
month's 121k, so generating everything in one subscription month is easy.
