import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AUDIO_DIR, audioPathFor, countAudioClips } from '../src/content/audio-path';

/**
 * The boot-time audio check (src/index.ts) relies on countAudioClips() to tell,
 * loudly, when the committed clips did not make it into the running image (the
 * exact failure that once left every voice post silent in production). These
 * tests pin its behaviour. They do NOT assert that every bank item has a clip:
 * that stays an opt-in gate (`pnpm audit-speaking --require-audio`), because the
 * content structure is deliberately allowed to be valid before its audio exists.
 */
describe('audio-path', () => {
  it('resolves a clip path inside the audio directory', () => {
    expect(audioPathFor('b1-sh-001.ogg')).toBe(`${AUDIO_DIR}/b1-sh-001.ogg`);
  });

  it('counts exactly the committed .ogg files in the audio directory', () => {
    const onDisk = readdirSync(AUDIO_DIR).filter((f) => f.endsWith('.ogg')).length;
    expect(countAudioClips()).toBe(onDisk);
  });

  it('reports a positive count for the committed bank (a misbuilt image reads 0)', () => {
    // The repo ships every clip, so a healthy checkout is never empty. Zero here
    // means the audio is missing, which is exactly what the boot check flags.
    expect(countAudioClips()).toBeGreaterThan(0);
    expect(existsSync(AUDIO_DIR)).toBe(true);
  });
});
