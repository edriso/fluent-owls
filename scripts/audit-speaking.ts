/**
 * Speaking-content sanity checker. Run with `pnpm audit-speaking`.
 *
 * Validates the shadowing clips (shadowing-*.ts) and the native phrases
 * (phrases-*.ts): unique, correctly-prefixed ids; non-empty fields within their
 * limits; no em-dashes (house style); a caption/message that renders within the
 * Telegram limit; and that every shadowing clip's audio file name is the
 * expected "<id>.ogg".
 *
 * Audio FILES are generated separately (pnpm generate-audio) and committed, so
 * by default a missing .ogg is only reported, not a failure: the structure can
 * be valid before the audio exists. Pass --require-audio to make a missing file
 * fail (use this as a pre-deploy gate, once you have generated the audio).
 *
 * Pure data check: no network, no bot token. Exits 1 on any structural issue
 * (or missing audio with --require-audio), so it can be wired into CI.
 */
import { existsSync } from 'node:fs';
import { audioPathFor } from '../src/content/audio-path';
import { ALL_SHADOWING } from '../src/content/shadowing';
import { ALL_PHRASES } from '../src/content/phrases';
import { buildPhraseMessage, buildShadowingCaption } from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  CONTEXT_MAX_CHARS,
  EXAMPLE_MAX_CHARS,
  NOTE_MAX_CHARS,
  PHRASE_MAX_CHARS,
  SITUATION_MAX_CHARS,
  TRANSCRIPT_MAX_CHARS,
} from '../src/lib/limits';
import { LEVELS } from '../src/types';

type Issue = { id: string; field: string; detail: string };
const issues: Issue[] = [];
const add = (id: string, field: string, detail: string) => issues.push({ id, field, detail });

/** A reusable "non-empty and within max length" check. */
function checkText(id: string, field: string, value: string, max: number): void {
  if (value.trim().length === 0) add(id, field, 'empty');
  if (value.length > max) add(id, field, `length ${value.length} > ${max}`);
  if (value.includes('—')) add(id, field, 'contains an em-dash (use commas or periods)');
}

// --- Shadowing clips -------------------------------------------------------
const seenShadowing = new Set<string>();
const seenText = new Set<string>();
let missingAudio = 0;

for (const clip of ALL_SHADOWING) {
  if (seenShadowing.has(clip.id)) add(clip.id, 'id', 'duplicate id');
  seenShadowing.add(clip.id);
  if (!clip.id.startsWith(`${clip.level}-sh-`)) {
    add(clip.id, 'id', `must start with "${clip.level}-sh-"`);
  }

  // Two clips with the same line are a copy-paste slip and waste a rotation slot.
  const normText = clip.text.trim().toLowerCase();
  if (seenText.has(normText))
    add(clip.id, 'text', 'duplicate transcript (same line as another clip)');
  seenText.add(normText);

  checkText(clip.id, 'text', clip.text, TRANSCRIPT_MAX_CHARS);
  checkText(clip.id, 'context', clip.context, CONTEXT_MAX_CHARS);
  checkText(clip.id, 'note', clip.note, NOTE_MAX_CHARS);

  if (clip.audio !== `${clip.id}.ogg`) {
    add(clip.id, 'audio', `should be "${clip.id}.ogg", got "${clip.audio}"`);
  }

  const caption = buildShadowingCaption(clip).length;
  if (caption > CAPTION_MAX_CHARS) {
    add(clip.id, 'caption', `rendered caption ${caption} > ${CAPTION_MAX_CHARS}`);
  }

  if (!existsSync(audioPathFor(clip.audio))) missingAudio += 1;
}

// --- Native phrases --------------------------------------------------------
const seenPhrases = new Set<string>();
const seenPhraseText = new Set<string>();

for (const phrase of ALL_PHRASES) {
  if (seenPhrases.has(phrase.id)) add(phrase.id, 'id', 'duplicate id');
  seenPhrases.add(phrase.id);
  if (!phrase.id.startsWith(`${phrase.level}-ph-`)) {
    add(phrase.id, 'id', `must start with "${phrase.level}-ph-"`);
  }

  const normPhrase = phrase.phrase.trim().toLowerCase();
  if (seenPhraseText.has(normPhrase)) add(phrase.id, 'phrase', 'duplicate phrase');
  seenPhraseText.add(normPhrase);

  checkText(phrase.id, 'phrase', phrase.phrase, PHRASE_MAX_CHARS);
  checkText(phrase.id, 'situation', phrase.situation, SITUATION_MAX_CHARS);
  checkText(phrase.id, 'example', phrase.example, EXAMPLE_MAX_CHARS);

  // Just exercise the builder so a formatting bug surfaces here too.
  buildPhraseMessage(phrase);
}

// --- Summary ---------------------------------------------------------------
for (const level of LEVELS) {
  const sh = ALL_SHADOWING.filter((c) => c.level === level).length;
  const ph = ALL_PHRASES.filter((p) => p.level === level).length;
  console.log(`  ${level.toUpperCase()}: ${sh} shadowing, ${ph} phrases`);
}
console.log(`Total: ${ALL_SHADOWING.length} shadowing clips, ${ALL_PHRASES.length} phrases`);

// Audio cost estimate. ElevenLabs bills ~1 credit per character on the
// multilingual model, so the total transcript length is the credit cost of
// generating every clip once.
const totalAudioChars = ALL_SHADOWING.reduce((sum, c) => sum + c.text.length, 0);
console.log(
  `Audio: ~${totalAudioChars} characters total (~${totalAudioChars} credits to generate every clip once on multilingual v2).`,
);

const requireAudio = process.argv.slice(2).includes('--require-audio');
if (missingAudio > 0) {
  const line = `${missingAudio}/${ALL_SHADOWING.length} shadowing clip(s) have no audio yet. Run "pnpm generate-audio".`;
  if (requireAudio) {
    add('audio', 'files', line);
  } else {
    console.log(`Note: ${line}`);
  }
}

if (issues.length === 0) {
  console.log('OK: all speaking content passes the audit.');
  process.exit(0);
}

console.error(`Found ${issues.length} issue(s):`);
for (const i of issues) console.error(`  [${i.id}] ${i.field}: ${i.detail}`);
process.exit(1);
