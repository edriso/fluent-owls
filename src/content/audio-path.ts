import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Where the committed voice clips live, and how to find one clip's file.
 *
 * The OGG/Opus clips are generated once (scripts/generate-audio.ts) and checked
 * into the repo under src/content/audio. The running bot only ever READS them,
 * so there is no text-to-speech key, cost, or network call at runtime.
 *
 * The path is resolved from the current working directory, which is the project
 * root in every documented way of running the bot (pnpm dev, pnpm start, the
 * Docker CMD, and the dev scripts all start from the repo root). We deliberately
 * do NOT resolve relative to this compiled module, because `tsc` emits the code
 * to dist/ but never copies the .ogg files there.
 *
 * IMPORTANT for Docker: the slim runtime image copies dist/ (compiled JS), so it
 * must ALSO copy src/content/audio explicitly, or this dir is missing and every
 * voice post fails silently. The Dockerfile does that; index.ts logs a loud
 * error at boot (via countAudioClips) if the dir is empty, so a misbuilt image
 * is obvious in the logs instead of looking like "the bot just went quiet".
 */
export const AUDIO_DIR = join(process.cwd(), 'src', 'content', 'audio');

/** Absolute path to one voice clip's committed audio file. */
export function audioPathFor(fileName: string): string {
  return join(AUDIO_DIR, fileName);
}

/**
 * How many .ogg clips are actually present on disk. Used by the startup check to
 * fail loudly when the audio did not make it into the running image. Returns 0
 * if the directory does not exist (rather than throwing), so the caller can warn.
 */
export function countAudioClips(): number {
  if (!existsSync(AUDIO_DIR)) return 0;
  return readdirSync(AUDIO_DIR).filter((f) => f.endsWith('.ogg')).length;
}
