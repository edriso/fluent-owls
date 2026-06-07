/**
 * One-time audio generator for the shadowing clips. Run with `pnpm generate-audio`.
 *
 * This is a DEV-ONLY tool. It reads every shadowing clip's `text`, sends it to
 * ElevenLabs text-to-speech, converts the result to OGG/Opus (what Telegram
 * wants for a voice message), and writes it to src/content/audio/<id>.ogg. Those
 * files are committed to the repo, so the RUNNING bot never calls a TTS API: no
 * key, no cost, and no new failure mode in production.
 *
 * It is idempotent: a clip whose .ogg already exists is skipped, so you can run
 * it again after adding clips and only the new ones are generated. Pass --force
 * to regenerate everything, or one or more level names (e.g. b1 c1) to limit it.
 *
 * Requirements:
 *   - ELEVENLABS_API_KEY in your env or .env (only needed to run THIS script).
 *   - ffmpeg installed and on PATH (brew install ffmpeg). Used to make OGG/Opus.
 *
 * Optional env:
 *   - ELEVENLABS_VOICE_<LEVEL>  One voice per CEFR level (e.g. ELEVENLABS_VOICE_B1).
 *                               If unset, a curated American voice is used per level.
 *   - ELEVENLABS_VOICE_ID       Force ONE voice for every clip, overriding the above.
 *   - ELEVENLABS_MODEL_ID       Defaults to eleven_multilingual_v2 (best prosody).
 *
 * Run modes:
 *   pnpm generate-audio            every clip that has no .ogg yet
 *   pnpm generate-audio b1 c1      only these levels
 *   pnpm generate-audio --sample   just one clip per level (to audition voices)
 *   pnpm generate-audio --force    regenerate, even clips that already exist
 *
 * Cost: ElevenLabs charges ~1 credit per character on the multilingual model.
 * The script prints the total character count up front so you can sanity-check
 * it against your plan's monthly credits before it runs.
 */
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv, logger } from 'telegram-broadcast-kit';
import { AUDIO_DIR, audioPathFor } from '../src/content/audio-path';
import { ALL_SHADOWING } from '../src/content/shadowing';
import { LEVELS, type Level, type LeveledShadowingClip } from '../src/types';

loadEnv();

// One clear American voice per CEFR level, female and male alternating so each
// level has its own consistent "teacher" and the channel stays varied. These
// are ElevenLabs premade voices, available on every account. Swap any of them
// per level with ELEVENLABS_VOICE_<LEVEL>, or force one voice for everything
// with ELEVENLABS_VOICE_ID.
const DEFAULT_VOICE_BY_LEVEL: Record<Level, { id: string; name: string }> = {
  a1: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  a2: { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian' },
  b1: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  b2: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
  c1: { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda' },
  c2: { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill' },
};

const MODEL_ID = process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2';

/** Choose the voice for a clip: a forced global voice, else a per-level env
 *  override, else the curated default for that level. */
function voiceForClip(clip: LeveledShadowingClip): { id: string; name: string } {
  const forced = process.env.ELEVENLABS_VOICE_ID?.trim();
  if (forced) return { id: forced, name: 'custom (ELEVENLABS_VOICE_ID)' };
  const perLevel = process.env[`ELEVENLABS_VOICE_${clip.level.toUpperCase()}`]?.trim();
  if (perLevel) return { id: perLevel, name: `custom (${clip.level.toUpperCase()})` };
  return DEFAULT_VOICE_BY_LEVEL[clip.level];
}

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
    headers: {
      'xi-api-key': apiKey,
      'content-type': 'application/json',
      accept: 'audio/mpeg',
    },
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

/** Convert an MP3 buffer to a mono OGG/Opus file (Telegram voice format). */
function mp3ToOgg(mp3: Buffer, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Read MP3 from stdin, write OGG/Opus to outPath. Mono 48k keeps voice
    // files tiny while sounding clean.
    const proc = spawn('ffmpeg', [
      '-y',
      '-i',
      'pipe:0',
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
    let stderr = '';
    proc.stderr.on('data', (chunk) => (stderr += String(chunk)));
    proc.on('error', reject);
    proc.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg failed (${code}): ${stderr.slice(-300)}`)),
    );
    proc.stdin.write(mp3);
    proc.stdin.end();
  });
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

  let clips: LeveledShadowingClip[] = ALL_SHADOWING;
  if (levelFilter.length > 0) clips = clips.filter((c) => levelFilter.includes(c.level));
  if (sample) {
    // One clip per level, to audition the chosen voices before the full run.
    const seen = new Set<Level>();
    clips = clips.filter((c) => (seen.has(c.level) ? false : (seen.add(c.level), true)));
  }

  // Skip clips already generated unless --force.
  const todo = force ? clips : clips.filter((c) => !existsSync(audioPathFor(c.audio)));
  const skipped = clips.length - todo.length;

  if (todo.length === 0) {
    console.log(
      `Nothing to do: all ${clips.length} clip(s) already have audio. Use --force to redo.`,
    );
    return;
  }

  const totalChars = todo.reduce((sum, c) => sum + c.text.length, 0);
  console.log(
    `Generating ${todo.length} clip(s) (${skipped} already done), ` +
      `~${totalChars} characters / credits on model "${MODEL_ID}".`,
  );

  await checkFfmpeg();
  await mkdir(AUDIO_DIR, { recursive: true });

  let ok = 0;
  const failures: string[] = [];
  for (let i = 0; i < todo.length; i += 1) {
    const clip = todo[i]!;
    const voice = voiceForClip(clip);
    const tmpPath = join(AUDIO_DIR, `${clip.id}.tmp.mp3`);
    try {
      const mp3 = await textToMp3(clip.text, voice.id, apiKey);
      // Stage to a temp file too (handy for debugging), then transcode.
      await writeFile(tmpPath, mp3);
      await mp3ToOgg(mp3, audioPathFor(clip.audio));
      await rm(tmpPath, { force: true });
      ok += 1;
      logger.info('Generated clip', {
        id: clip.id,
        voice: voice.name,
        n: `${i + 1}/${todo.length}`,
      });
    } catch (err) {
      await rm(tmpPath, { force: true }).catch(() => {});
      failures.push(`${clip.id}: ${String(err)}`);
      logger.error('Failed to generate clip', { id: clip.id, error: String(err) });
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
