import { join } from 'node:path';

/**
 * Where the committed shadowing audio lives, and how to find one clip's file.
 *
 * The OGG/Opus clips are generated once (scripts/generate-audio.ts) and checked
 * into the repo under src/content/audio. The running bot only ever READS them,
 * so there is no text-to-speech key, cost, or network call at runtime.
 *
 * The path is resolved from the current working directory, which is the project
 * root in every documented way of running the bot (pnpm dev, pnpm start, the
 * Docker CMD, and the dev scripts all start from the repo root). We deliberately
 * do NOT resolve relative to this compiled module, because `tsc` emits the code
 * to dist/ but never copies the .ogg files there: the audio only ever exists in
 * the source tree, which the repo (and the Docker image) always ships.
 */
export const AUDIO_DIR = join(process.cwd(), 'src', 'content', 'audio');

/** Absolute path to one shadowing clip's committed audio file. */
export function audioPathFor(fileName: string): string {
  return join(AUDIO_DIR, fileName);
}
