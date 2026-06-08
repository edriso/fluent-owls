/**
 * One-time audio generator for the speaking clips. Run with `pnpm generate-audio`.
 *
 * This is a DEV-ONLY tool. It turns every audio item (shadowing clips, role-play
 * dialogues, grammar examples, monologues, and question prompts) into an
 * OGG/Opus voice clip (what Telegram wants) under src/content/audio/<id>.ogg,
 * using ElevenLabs text-to-speech. Those files are committed, so the RUNNING bot
 * never calls a TTS API: no key, no cost, and no new failure mode in production.
 *
 * Shadowing, grammar, and monologues are one voice. Dialogues and prompts use
 * two voices stitched with a gap (a short breath for dialogues; a longer pause
 * for prompts, so the learner can answer before the model).
 *
 * It is idempotent: a clip whose .ogg already exists is skipped, so after adding
 * content you just run it again and only the new items are generated.
 *
 * Requirements:
 *   - ELEVENLABS_API_KEY in your env or .env (only needed to run THIS script).
 *   - ffmpeg installed and on PATH (brew install ffmpeg). Used to make OGG/Opus.
 *
 * Optional env:
 *   - ELEVENLABS_VOICE_<LEVEL>    Voice for that level (e.g. ELEVENLABS_VOICE_B1).
 *   - ELEVENLABS_VOICE_<LEVEL>_B  Second (partner) voice for dialogues at that level.
 *   - ELEVENLABS_VOICE_ID         Force ONE voice for everything, overriding the above.
 *   - ELEVENLABS_MODEL_ID         Defaults to eleven_multilingual_v2 (best prosody).
 *
 * Run modes (combine freely):
 *   pnpm generate-audio              every item that has no .ogg yet
 *   pnpm generate-audio b1 c1        only these levels
 *   pnpm generate-audio shadowing    only that kind (also: dialogues, grammar, monologues, prompts)
 *   pnpm generate-audio --sample     one of each kind per level (audition)
 *   pnpm generate-audio --force      regenerate, even items that already exist
 */
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv, logger } from 'telegram-broadcast-kit';
import { AUDIO_DIR, audioPathFor } from '../src/content/audio-path';
import { ALL_SHADOWING } from '../src/content/shadowing';
import { ALL_DIALOGUES } from '../src/content/dialogues';
import { ALL_GRAMMAR } from '../src/content/grammar';
import { ALL_MONOLOGUES } from '../src/content/monologues';
import { ALL_PROMPTS } from '../src/content/prompts';
import { ALL_PRONUNCIATION } from '../src/content/pronunciation';
import { ALL_PHRASES } from '../src/content/phrases';
import { ALL_VOCABULARY } from '../src/content/vocabulary';
import { ALL_IDIOMS } from '../src/content/idioms';
import { ALL_STORIES } from '../src/content/stories';
import { ALL_TALKS } from '../src/content/talks';
import { LEVELS, type Level } from '../src/types';

loadEnv();

// One clear American voice per CEFR level (speaker A), and a contrasting partner
// voice (speaker B) for dialogues. Both are ElevenLabs premade voices, on every
// account. Override per level with ELEVENLABS_VOICE_<LEVEL> (and _B), or force a
// single voice for everything with ELEVENLABS_VOICE_ID.
const VOICE_A_BY_LEVEL: Record<Level, { id: string; name: string }> = {
  a1: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  a2: { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian' },
  b1: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  b2: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
  c1: { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda' },
  c2: { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill' },
};
const VOICE_B_BY_LEVEL: Record<Level, { id: string; name: string }> = {
  a1: { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian' },
  a2: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  b1: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
  b2: { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda' },
  c1: { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill' },
  c2: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
};

const MODEL_ID = process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2';
const FORCED_VOICE = process.env.ELEVENLABS_VOICE_ID?.trim();

/** Voice for speaker A (single-voice shadowing also uses this). */
function voiceA(level: Level): string {
  if (FORCED_VOICE) return FORCED_VOICE;
  return (
    process.env[`ELEVENLABS_VOICE_${level.toUpperCase()}`]?.trim() || VOICE_A_BY_LEVEL[level].id
  );
}
/** Partner voice for speaker B in dialogues. */
function voiceB(level: Level): string {
  if (FORCED_VOICE) return FORCED_VOICE;
  return (
    process.env[`ELEVENLABS_VOICE_${level.toUpperCase()}_B`]?.trim() || VOICE_B_BY_LEVEL[level].id
  );
}

/** A unit of audio to generate: one or more spoken segments, written to one file. */
type Segment = { text: string; voiceId: string };
type Kind =
  | 'shadow'
  | 'dialogue'
  | 'grammar'
  | 'monologue'
  | 'prompt'
  | 'pron'
  | 'phrase'
  | 'vocab'
  | 'idiom'
  | 'story'
  | 'talk';
/** `gap` is the silence (seconds) between segments. Prompts use a long pause so
 *  the learner can answer; everything else uses a short breath. */
type Job = {
  id: string;
  level: Level;
  audio: string;
  kind: Kind;
  segments: Segment[];
  gap?: number;
};

/** Map a command-line token to the content kind it filters to. */
const KIND_TOKENS: Record<string, Kind> = {
  shadowing: 'shadow',
  dialogues: 'dialogue',
  grammar: 'grammar',
  monologues: 'monologue',
  prompts: 'prompt',
  pronunciation: 'pron',
  phrases: 'phrase',
  vocabulary: 'vocab',
  idioms: 'idiom',
  stories: 'story',
  talks: 'talk',
};

/** Pause (seconds) the learner gets to answer, between a prompt question and the model answer. */
const PROMPT_PAUSE_SECONDS = 4;

/** Confirm ffmpeg is available, with a friendly message if it is not. */
function checkFfmpeg(): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', ['-version']);
    proc.on('error', () =>
      reject(new Error('ffmpeg not found. Install it (e.g. "brew install ffmpeg") and try again.')),
    );
    proc.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg check exited with code ${code}`)),
    );
  });
}

/** Call ElevenLabs and return the spoken text as MP3 bytes. */
async function textToMp3(text: string, voiceId: string, apiKey: string): Promise<Buffer> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`ElevenLabs ${res.status} ${res.statusText}: ${detail.slice(0, 300)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

/** Run ffmpeg with the given args, resolving on exit code 0. */
function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args);
    let stderr = '';
    proc.stderr.on('data', (chunk) => (stderr += String(chunk)));
    proc.on('error', reject);
    proc.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg failed (${code}): ${stderr.slice(-300)}`)),
    );
  });
}

/** Transcode a single MP3 buffer to mono OGG/Opus (the shadowing path). */
async function oneSegmentToOgg(mp3: Buffer, outPath: string): Promise<void> {
  const tmp = `${outPath}.seg0.mp3`;
  await writeFile(tmp, mp3);
  try {
    await runFfmpeg([
      '-y',
      '-i',
      tmp,
      '-c:a',
      'libopus',
      '-b:a',
      '48k',
      '-ar',
      '48000',
      '-ac',
      '1',
      outPath,
    ]);
  } finally {
    await rm(tmp, { force: true });
  }
}

/**
 * Stitch several spoken MP3 segments into one mono OGG/Opus file, with a short
 * silence between them (the dialogue path). Each input is normalized to a common
 * format first, then concatenated, so mismatched sample rates cannot break it.
 */
async function segmentsToOgg(mp3s: Buffer[], outPath: string, gapSeconds: number): Promise<void> {
  const tmpFiles: string[] = [];
  for (let i = 0; i < mp3s.length; i += 1) {
    const tmp = `${outPath}.seg${i}.mp3`;
    await writeFile(tmp, mp3s[i]!);
    tmpFiles.push(tmp);
  }
  try {
    const inputs: string[] = [];
    const norm: string[] = [];
    const labels: string[] = [];
    let idx = 0;
    const pushNorm = () => {
      norm.push(`[${idx}:a]aresample=48000,aformat=sample_fmts=s16:channel_layouts=mono[a${idx}]`);
      labels.push(`[a${idx}]`);
      idx += 1;
    };
    for (let i = 0; i < tmpFiles.length; i += 1) {
      inputs.push('-i', tmpFiles[i]!);
      pushNorm();
      if (i < tmpFiles.length - 1) {
        inputs.push('-f', 'lavfi', '-t', String(gapSeconds), '-i', 'anullsrc=r=48000:cl=mono');
        pushNorm();
      }
    }
    const filter = `${norm.join(';')};${labels.join('')}concat=n=${labels.length}:v=0:a=1[out]`;
    await runFfmpeg([
      '-y',
      ...inputs,
      '-filter_complex',
      filter,
      '-map',
      '[out]',
      '-c:a',
      'libopus',
      '-b:a',
      '48k',
      '-ar',
      '48000',
      '-ac',
      '1',
      outPath,
    ]);
  } finally {
    for (const f of tmpFiles) await rm(f, { force: true });
  }
}

/** Build the full list of generation jobs from both content banks. */
function allJobs(): Job[] {
  const shadow: Job[] = ALL_SHADOWING.map((c) => ({
    id: c.id,
    level: c.level,
    audio: c.audio,
    kind: 'shadow',
    segments: [{ text: c.text, voiceId: voiceA(c.level) }],
  }));
  const dialogue: Job[] = ALL_DIALOGUES.map((d) => ({
    id: d.id,
    level: d.level,
    audio: d.audio,
    kind: 'dialogue',
    segments: d.turns.map((t) => ({
      text: t.text,
      voiceId: t.speaker === 'A' ? voiceA(d.level) : voiceB(d.level),
    })),
  }));
  // Grammar: the example sentences, read with the level's voice (a small gap
  // between them). Monologues: the passage in one voice.
  const grammar: Job[] = ALL_GRAMMAR.map((g) => ({
    id: g.id,
    level: g.level,
    audio: g.audio,
    kind: 'grammar',
    segments: g.examples.map((ex) => ({ text: ex, voiceId: voiceA(g.level) })),
  }));
  const monologue: Job[] = ALL_MONOLOGUES.map((m) => ({
    id: m.id,
    level: m.level,
    audio: m.audio,
    kind: 'monologue',
    segments: [{ text: m.text, voiceId: voiceA(m.level) }],
  }));
  // Prompts: the question (asker's voice), a long pause to answer, then the model
  // answer (a second voice).
  const prompt: Job[] = ALL_PROMPTS.map((p) => ({
    id: p.id,
    level: p.level,
    audio: p.audio,
    kind: 'prompt',
    gap: PROMPT_PAUSE_SECONDS,
    segments: [
      { text: p.question, voiceId: voiceA(p.level) },
      { text: p.answer, voiceId: voiceB(p.level) },
    ],
  }));
  // Pronunciation: the items (word pairs or short sentences) read with one voice
  // and a small gap between them, so the learner hears each and repeats.
  const pron: Job[] = ALL_PRONUNCIATION.map((p) => ({
    id: p.id,
    level: p.level,
    audio: p.audio,
    kind: 'pron',
    segments: p.items.map((text) => ({ text, voiceId: voiceA(p.level) })),
  }));
  // Phrases: the chunk read aloud, then a worked example, in one voice with a
  // small gap. The audio file name is derived from the id (phrases have no audio
  // field). Posted as a voice message with an HTML caption (see post.ts).
  const phrase: Job[] = ALL_PHRASES.map((p) => ({
    id: p.id,
    level: p.level,
    audio: `${p.id}.ogg`,
    kind: 'phrase',
    segments: [
      { text: p.phrase, voiceId: voiceA(p.level) },
      { text: p.example, voiceId: voiceA(p.level) },
    ],
  }));
  // Vocabulary: the word read aloud, then the example sentences, in one voice
  // with a small gap. Posted as a voice message with an HTML caption.
  const vocab: Job[] = ALL_VOCABULARY.map((v) => ({
    id: v.id,
    level: v.level,
    audio: v.audio,
    kind: 'vocab',
    segments: [
      { text: v.word, voiceId: voiceA(v.level) },
      ...v.examples.map((text) => ({ text, voiceId: voiceA(v.level) })),
    ],
  }));
  // Idioms: the idiom read aloud, then the example sentences, in one voice with
  // a small gap. Posted as a voice message with an HTML caption.
  const idiom: Job[] = ALL_IDIOMS.map((it) => ({
    id: it.id,
    level: it.level,
    audio: it.audio,
    kind: 'idiom',
    segments: [
      { text: it.idiom, voiceId: voiceA(it.level) },
      ...it.examples.map((text) => ({ text, voiceId: voiceA(it.level) })),
    ],
  }));
  // Stories: the whole narrative read in one voice, like a monologue.
  const story: Job[] = ALL_STORIES.map((s) => ({
    id: s.id,
    level: s.level,
    audio: s.audio,
    kind: 'story',
    segments: [{ text: s.text, voiceId: voiceA(s.level) }],
  }));
  // Talks: the whole informative passage read in one voice, like a story.
  const talk: Job[] = ALL_TALKS.map((t) => ({
    id: t.id,
    level: t.level,
    audio: t.audio,
    kind: 'talk',
    segments: [{ text: t.text, voiceId: voiceA(t.level) }],
  }));
  return [
    ...shadow,
    ...dialogue,
    ...grammar,
    ...monologue,
    ...prompt,
    ...pron,
    ...phrase,
    ...vocab,
    ...idiom,
    ...story,
    ...talk,
  ];
}

async function main(): Promise<void> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      'Missing ELEVENLABS_API_KEY. Set it in your env or .env (dev only; the bot never needs it).',
    );
    process.exit(1);
  }

  const args = process.argv.slice(2).map((a) => a.toLowerCase());
  const force = args.includes('--force');
  const sample = args.includes('--sample');
  const levelFilter = args.filter((a): a is Level => (LEVELS as readonly string[]).includes(a));
  const kindFilter = args.map((a) => KIND_TOKENS[a]).filter((k): k is Kind => Boolean(k));

  let jobs = allJobs();
  if (kindFilter.length > 0) jobs = jobs.filter((j) => kindFilter.includes(j.kind));
  if (levelFilter.length > 0) jobs = jobs.filter((j) => levelFilter.includes(j.level));
  if (sample) {
    // One shadow and one dialogue per level, to audition the voices.
    const seen = new Set<string>();
    jobs = jobs.filter((j) => {
      const key = `${j.level}-${j.kind}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const todo = force ? jobs : jobs.filter((j) => !existsSync(audioPathFor(j.audio)));
  const skipped = jobs.length - todo.length;
  if (todo.length === 0) {
    console.log(
      `Nothing to do: all ${jobs.length} item(s) already have audio. Use --force to redo.`,
    );
    return;
  }

  const totalChars = todo.reduce(
    (sum, j) => sum + j.segments.reduce((s, seg) => s + seg.text.length, 0),
    0,
  );
  console.log(
    `Generating ${todo.length} item(s) (${skipped} already done), ` +
      `~${totalChars} characters / credits on model "${MODEL_ID}".`,
  );

  await checkFfmpeg();
  await mkdir(AUDIO_DIR, { recursive: true });

  let ok = 0;
  const failures: string[] = [];
  for (let i = 0; i < todo.length; i += 1) {
    const job = todo[i]!;
    const outPath = audioPathFor(job.audio);
    try {
      const mp3s: Buffer[] = [];
      for (const seg of job.segments) mp3s.push(await textToMp3(seg.text, seg.voiceId, apiKey));
      if (mp3s.length === 1) await oneSegmentToOgg(mp3s[0]!, outPath);
      else await segmentsToOgg(mp3s, outPath, job.gap ?? 0.45);
      ok += 1;
      logger.info('Generated', { id: job.id, kind: job.kind, n: `${i + 1}/${todo.length}` });
    } catch (err) {
      failures.push(`${job.id}: ${String(err)}`);
      logger.error('Failed to generate', { id: job.id, error: String(err) });
    }
  }

  console.log(`\nDone. ${ok} generated, ${failures.length} failed, ${skipped} skipped.`);
  if (failures.length > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log('Commit the new .ogg files in src/content/audio so production can post them.');
}

main().catch((err) => {
  logger.error('generate-audio failed', { error: String(err) });
  process.exit(1);
});
