import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AUDIO_DIR, audioPathFor, countAudioClips } from '../src/content/audio-path';

/**
 * The boot-time audio check (src/index.ts) relies on countAudioClips() to tell,
 * loudly, when the voice clips are not present (mount missing in production, or
 * clips never generated in dev). These tests pin its behaviour.
 *
 * The clips are git-ignored and NOT in the repo (ElevenLabs output, see NOTICE),
 * so a clean checkout/CI has zero of them and a dev box that ran
 * `pnpm generate-audio` has many. The tests therefore do NOT assume any clip is
 * present: they check the contract (path resolution, an honest count that never
 * throws, and that the count reacts to a clip appearing). Full per-item parity
 * stays an opt-in gate (`pnpm audit-speaking --require-audio`).
 */
describe('audio-path', () => {
  it('resolves a clip path inside the audio directory', () => {
    expect(audioPathFor('b1-sh-001.ogg')).toBe(`${AUDIO_DIR}/b1-sh-001.ogg`);
  });

  it('counts exactly the .ogg files on disk (zero when none are generated)', () => {
    const onDisk = existsSync(AUDIO_DIR)
      ? readdirSync(AUDIO_DIR).filter((f) => f.endsWith('.ogg')).length
      : 0;
    expect(countAudioClips()).toBe(onDisk);
  });

  it('reacts to a clip appearing and disappearing, and never throws when empty', () => {
    // Prove the boot check actually tracks clips on disk, without depending on
    // the (un-committed) real bank: drop a probe .ogg, the count rises by one;
    // remove it, the count returns. A *.ogg name is git-ignored, so this never
    // dirties the working tree.
    mkdirSync(AUDIO_DIR, { recursive: true });
    const before = countAudioClips();
    expect(before).toBeGreaterThanOrEqual(0);

    const probe = audioPathFor('__audio_path_test__.ogg');
    writeFileSync(probe, '');
    try {
      expect(countAudioClips()).toBe(before + 1);
    } finally {
      rmSync(probe, { force: true });
    }
    expect(countAudioClips()).toBe(before);
  });
});
