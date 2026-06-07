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
import { ALL_DIALOGUES } from '../src/content/dialogues';
import { ALL_GRAMMAR } from '../src/content/grammar';
import { ALL_MONOLOGUES } from '../src/content/monologues';
import { ALL_PROMPTS } from '../src/content/prompts';
import { ALL_PRONUNCIATION } from '../src/content/pronunciation';
import { ALL_VOCABULARY } from '../src/content/vocabulary';
import { ALL_IDIOMS } from '../src/content/idioms';
import {
  buildDialogueCaption,
  buildGrammarCaption,
  buildIdiomMessage,
  buildMonologueCaption,
  buildPhraseMessage,
  buildPromptCaption,
  buildPronunciationCaption,
  buildShadowingCaption,
  buildVocabularyMessage,
} from '../src/lib/format';
import {
  CAPTION_MAX_CHARS,
  CONTEXT_MAX_CHARS,
  DIALOGUE_MAX_TURNS,
  DIALOGUE_MIN_TURNS,
  DIALOGUE_TURN_MAX_CHARS,
  EXAMPLE_MAX_CHARS,
  EXPLANATION_LINE_MAX_CHARS,
  GRAMMAR_EXAMPLE_MAX_CHARS,
  GRAMMAR_MAX_EXAMPLES,
  GRAMMAR_MIN_EXAMPLES,
  IDIOM_EXAMPLE_MAX_CHARS,
  IDIOM_MAX_EXAMPLES,
  IDIOM_MEANING_MAX_CHARS,
  IDIOM_MIN_EXAMPLES,
  IDIOM_PHRASE_MAX_CHARS,
  MONOLOGUE_MAX_CHARS,
  NOTE_MAX_CHARS,
  PHRASE_MAX_CHARS,
  PROMPT_ANSWER_MAX_CHARS,
  PROMPT_QUESTION_MAX_CHARS,
  PRON_EXPLANATION_MAX_CHARS,
  PRON_ITEM_MAX_CHARS,
  PRON_MAX_ITEMS,
  PRON_MIN_ITEMS,
  PRON_TITLE_MAX_CHARS,
  RULE_MAX_CHARS,
  SITUATION_MAX_CHARS,
  TOPIC_MAX_CHARS,
  TRANSCRIPT_MAX_CHARS,
  VOCAB_EXAMPLE_MAX_CHARS,
  VOCAB_MAX_EXAMPLES,
  VOCAB_MEANING_MAX_CHARS,
  VOCAB_MIN_EXAMPLES,
  VOCAB_WORD_MAX_CHARS,
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

  // Phrases are now voice messages: the audio file name is derived from the id
  // (no audio field). Count a missing clip like the other voice types.
  if (!existsSync(audioPathFor(`${phrase.id}.ogg`))) missingAudio += 1;
}

// --- Role-play dialogues ---------------------------------------------------
const seenDialogues = new Set<string>();
const seenDialogueText = new Set<string>();

for (const d of ALL_DIALOGUES) {
  if (seenDialogues.has(d.id)) add(d.id, 'id', 'duplicate id');
  seenDialogues.add(d.id);
  if (!d.id.startsWith(`${d.level}-dl-`)) {
    add(d.id, 'id', `must start with "${d.level}-dl-"`);
  }

  checkText(d.id, 'situation', d.situation, CONTEXT_MAX_CHARS);
  checkText(d.id, 'note', d.note, NOTE_MAX_CHARS);

  if (d.turns.length < DIALOGUE_MIN_TURNS || d.turns.length > DIALOGUE_MAX_TURNS) {
    add(
      d.id,
      'turns',
      `must have ${DIALOGUE_MIN_TURNS}-${DIALOGUE_MAX_TURNS}, found ${d.turns.length}`,
    );
  }
  d.turns.forEach((t, i) => {
    checkText(d.id, `turns[${i}]`, t.text, DIALOGUE_TURN_MAX_CHARS);
    // Speakers must alternate A, B, A, B... so the two voices take turns.
    const expected = i % 2 === 0 ? 'A' : 'B';
    if (t.speaker !== expected) {
      add(d.id, `turns[${i}]`, `speaker should be "${expected}" (turns must alternate)`);
    }
  });

  if (d.audio !== `${d.id}.ogg`) {
    add(d.id, 'audio', `should be "${d.id}.ogg", got "${d.audio}"`);
  }

  const cap = buildDialogueCaption(d).length;
  if (cap > CAPTION_MAX_CHARS)
    add(d.id, 'caption', `rendered caption ${cap} > ${CAPTION_MAX_CHARS}`);

  const normDialogue = d.turns
    .map((t) => t.text)
    .join(' | ')
    .trim()
    .toLowerCase();
  if (seenDialogueText.has(normDialogue))
    add(d.id, 'turns', 'duplicate dialogue (same lines as another)');
  seenDialogueText.add(normDialogue);

  if (!existsSync(audioPathFor(d.audio))) missingAudio += 1;
}

// --- Grammar rules ---------------------------------------------------------
const seenGrammar = new Set<string>();

for (const g of ALL_GRAMMAR) {
  if (seenGrammar.has(g.id)) add(g.id, 'id', 'duplicate id');
  seenGrammar.add(g.id);
  if (!g.id.startsWith(`${g.level}-gr-`)) add(g.id, 'id', `must start with "${g.level}-gr-"`);

  checkText(g.id, 'rule', g.rule, RULE_MAX_CHARS);
  checkText(g.id, 'explanation', g.explanation, EXPLANATION_LINE_MAX_CHARS);
  checkText(g.id, 'note', g.note, NOTE_MAX_CHARS);

  if (g.examples.length < GRAMMAR_MIN_EXAMPLES || g.examples.length > GRAMMAR_MAX_EXAMPLES) {
    add(
      g.id,
      'examples',
      `must have ${GRAMMAR_MIN_EXAMPLES}-${GRAMMAR_MAX_EXAMPLES}, found ${g.examples.length}`,
    );
  }
  g.examples.forEach((ex, i) => checkText(g.id, `examples[${i}]`, ex, GRAMMAR_EXAMPLE_MAX_CHARS));

  if (g.audio !== `${g.id}.ogg`) add(g.id, 'audio', `should be "${g.id}.ogg", got "${g.audio}"`);
  const gcap = buildGrammarCaption(g).length;
  if (gcap > CAPTION_MAX_CHARS)
    add(g.id, 'caption', `rendered caption ${gcap} > ${CAPTION_MAX_CHARS}`);
  if (!existsSync(audioPathFor(g.audio))) missingAudio += 1;
}

// --- Monologues ------------------------------------------------------------
const seenMonologues = new Set<string>();

for (const m of ALL_MONOLOGUES) {
  if (seenMonologues.has(m.id)) add(m.id, 'id', 'duplicate id');
  seenMonologues.add(m.id);
  if (!m.id.startsWith(`${m.level}-mn-`)) add(m.id, 'id', `must start with "${m.level}-mn-"`);

  checkText(m.id, 'topic', m.topic, TOPIC_MAX_CHARS);
  checkText(m.id, 'text', m.text, MONOLOGUE_MAX_CHARS);
  checkText(m.id, 'note', m.note, NOTE_MAX_CHARS);

  if (m.audio !== `${m.id}.ogg`) add(m.id, 'audio', `should be "${m.id}.ogg", got "${m.audio}"`);
  const mcap = buildMonologueCaption(m).length;
  if (mcap > CAPTION_MAX_CHARS)
    add(m.id, 'caption', `rendered caption ${mcap} > ${CAPTION_MAX_CHARS}`);
  if (!existsSync(audioPathFor(m.audio))) missingAudio += 1;
}

// --- Question prompts ------------------------------------------------------
const seenPrompts = new Set<string>();
const seenPromptText = new Set<string>();

for (const p of ALL_PROMPTS) {
  if (seenPrompts.has(p.id)) add(p.id, 'id', 'duplicate id');
  seenPrompts.add(p.id);
  if (!p.id.startsWith(`${p.level}-pr-`)) add(p.id, 'id', `must start with "${p.level}-pr-"`);

  checkText(p.id, 'topic', p.topic, TOPIC_MAX_CHARS);
  checkText(p.id, 'question', p.question, PROMPT_QUESTION_MAX_CHARS);
  checkText(p.id, 'answer', p.answer, PROMPT_ANSWER_MAX_CHARS);
  checkText(p.id, 'note', p.note, NOTE_MAX_CHARS);

  const norm = p.question.trim().toLowerCase();
  if (seenPromptText.has(norm)) add(p.id, 'question', 'duplicate question');
  seenPromptText.add(norm);

  if (p.audio !== `${p.id}.ogg`) add(p.id, 'audio', `should be "${p.id}.ogg", got "${p.audio}"`);
  const pcap = buildPromptCaption(p).length;
  if (pcap > CAPTION_MAX_CHARS)
    add(p.id, 'caption', `rendered caption ${pcap} > ${CAPTION_MAX_CHARS}`);
  if (!existsSync(audioPathFor(p.audio))) missingAudio += 1;
}

// --- Pronunciation drills --------------------------------------------------
const seenPron = new Set<string>();

for (const d of ALL_PRONUNCIATION) {
  if (seenPron.has(d.id)) add(d.id, 'id', 'duplicate id');
  seenPron.add(d.id);
  if (!d.id.startsWith(`${d.level}-pn-`)) add(d.id, 'id', `must start with "${d.level}-pn-"`);

  checkText(d.id, 'title', d.title, PRON_TITLE_MAX_CHARS);
  checkText(d.id, 'explanation', d.explanation, PRON_EXPLANATION_MAX_CHARS);
  checkText(d.id, 'note', d.note, NOTE_MAX_CHARS);

  if (d.items.length < PRON_MIN_ITEMS || d.items.length > PRON_MAX_ITEMS) {
    add(d.id, 'items', `must have ${PRON_MIN_ITEMS}-${PRON_MAX_ITEMS}, found ${d.items.length}`);
  }
  d.items.forEach((it, i) => checkText(d.id, `items[${i}]`, it, PRON_ITEM_MAX_CHARS));

  if (d.audio !== `${d.id}.ogg`) add(d.id, 'audio', `should be "${d.id}.ogg", got "${d.audio}"`);
  const dcap = buildPronunciationCaption(d).length;
  if (dcap > CAPTION_MAX_CHARS)
    add(d.id, 'caption', `rendered caption ${dcap} > ${CAPTION_MAX_CHARS}`);
  if (!existsSync(audioPathFor(d.audio))) missingAudio += 1;
}

// --- Vocabulary entries ----------------------------------------------------
const seenVocab = new Set<string>();
const seenWord = new Set<string>();

for (const v of ALL_VOCABULARY) {
  if (seenVocab.has(v.id)) add(v.id, 'id', 'duplicate id');
  seenVocab.add(v.id);
  if (!v.id.startsWith(`${v.level}-vc-`)) add(v.id, 'id', `must start with "${v.level}-vc-"`);

  // Two entries for the same word waste a rotation slot.
  const normWord = v.word.trim().toLowerCase();
  if (seenWord.has(normWord)) add(v.id, 'word', `duplicate word "${v.word}"`);
  seenWord.add(normWord);

  checkText(v.id, 'word', v.word, VOCAB_WORD_MAX_CHARS);
  checkText(v.id, 'meaning', v.meaning, VOCAB_MEANING_MAX_CHARS);
  checkText(v.id, 'note', v.note, NOTE_MAX_CHARS);

  if (v.examples.length < VOCAB_MIN_EXAMPLES || v.examples.length > VOCAB_MAX_EXAMPLES) {
    add(
      v.id,
      'examples',
      `must have ${VOCAB_MIN_EXAMPLES}-${VOCAB_MAX_EXAMPLES}, found ${v.examples.length}`,
    );
  }
  v.examples.forEach((ex, i) => checkText(v.id, `examples[${i}]`, ex, VOCAB_EXAMPLE_MAX_CHARS));

  if (v.audio !== `${v.id}.ogg`) add(v.id, 'audio', `should be "${v.id}.ogg", got "${v.audio}"`);
  const vcap = buildVocabularyMessage(v).length;
  if (vcap > CAPTION_MAX_CHARS)
    add(v.id, 'caption', `rendered caption ${vcap} > ${CAPTION_MAX_CHARS}`);
  if (!existsSync(audioPathFor(v.audio))) missingAudio += 1;
}

// --- Idioms ----------------------------------------------------------------
const seenIdiom = new Set<string>();
const seenIdiomText = new Set<string>();

for (const it of ALL_IDIOMS) {
  if (seenIdiom.has(it.id)) add(it.id, 'id', 'duplicate id');
  seenIdiom.add(it.id);
  if (!it.id.startsWith(`${it.level}-idm-`)) add(it.id, 'id', `must start with "${it.level}-idm-"`);

  // Two entries for the same idiom waste a rotation slot.
  const normIdiom = it.idiom.trim().toLowerCase();
  if (seenIdiomText.has(normIdiom)) add(it.id, 'idiom', `duplicate idiom "${it.idiom}"`);
  seenIdiomText.add(normIdiom);

  checkText(it.id, 'idiom', it.idiom, IDIOM_PHRASE_MAX_CHARS);
  checkText(it.id, 'meaning', it.meaning, IDIOM_MEANING_MAX_CHARS);
  checkText(it.id, 'note', it.note, NOTE_MAX_CHARS);

  if (it.examples.length < IDIOM_MIN_EXAMPLES || it.examples.length > IDIOM_MAX_EXAMPLES) {
    add(
      it.id,
      'examples',
      `must have ${IDIOM_MIN_EXAMPLES}-${IDIOM_MAX_EXAMPLES}, found ${it.examples.length}`,
    );
  }
  it.examples.forEach((ex, i) => checkText(it.id, `examples[${i}]`, ex, IDIOM_EXAMPLE_MAX_CHARS));

  if (it.audio !== `${it.id}.ogg`)
    add(it.id, 'audio', `should be "${it.id}.ogg", got "${it.audio}"`);
  const icap = buildIdiomMessage(it).length;
  if (icap > CAPTION_MAX_CHARS)
    add(it.id, 'caption', `rendered caption ${icap} > ${CAPTION_MAX_CHARS}`);
  if (!existsSync(audioPathFor(it.audio))) missingAudio += 1;
}

// --- Summary ---------------------------------------------------------------
for (const level of LEVELS) {
  const sh = ALL_SHADOWING.filter((c) => c.level === level).length;
  const ph = ALL_PHRASES.filter((p) => p.level === level).length;
  const dl = ALL_DIALOGUES.filter((d) => d.level === level).length;
  const gr = ALL_GRAMMAR.filter((g) => g.level === level).length;
  const mn = ALL_MONOLOGUES.filter((m) => m.level === level).length;
  const pr = ALL_PROMPTS.filter((p) => p.level === level).length;
  const pn = ALL_PRONUNCIATION.filter((d) => d.level === level).length;
  const vc = ALL_VOCABULARY.filter((v) => v.level === level).length;
  const id = ALL_IDIOMS.filter((i) => i.level === level).length;
  console.log(
    `  ${level.toUpperCase()}: ${sh} shadow, ${dl} dialogue, ${gr} grammar, ${mn} monologue, ${pr} prompt, ${pn} pron, ${vc} vocab, ${id} idiom, ${ph} phrase`,
  );
}
console.log(
  `Total: ${ALL_SHADOWING.length} shadowing, ${ALL_DIALOGUES.length} dialogues, ${ALL_GRAMMAR.length} grammar, ${ALL_MONOLOGUES.length} monologues, ${ALL_PROMPTS.length} prompts, ${ALL_PRONUNCIATION.length} pronunciation, ${ALL_VOCABULARY.length} vocabulary, ${ALL_IDIOMS.length} idioms, ${ALL_PHRASES.length} phrases`,
);

// Audio cost estimate. ElevenLabs bills ~1 credit per character on the
// multilingual model, so the total spoken-text length is the credit cost of
// generating every audio clip once (dialogues count every turn; grammar and
// pronunciation count every example/item; phrases count the chunk and example).
const totalAudioChars =
  ALL_SHADOWING.reduce((sum, c) => sum + c.text.length, 0) +
  ALL_DIALOGUES.reduce((sum, d) => sum + d.turns.reduce((s, t) => s + t.text.length, 0), 0) +
  ALL_GRAMMAR.reduce((sum, g) => sum + g.examples.reduce((s, e) => s + e.length, 0), 0) +
  ALL_MONOLOGUES.reduce((sum, m) => sum + m.text.length, 0) +
  ALL_PROMPTS.reduce((sum, p) => sum + p.question.length + p.answer.length, 0) +
  ALL_PRONUNCIATION.reduce((sum, d) => sum + d.items.reduce((s, it) => s + it.length, 0), 0) +
  ALL_PHRASES.reduce((sum, p) => sum + p.phrase.length + p.example.length, 0) +
  ALL_VOCABULARY.reduce(
    (sum, v) => sum + v.word.length + v.examples.reduce((s, e) => s + e.length, 0),
    0,
  ) +
  ALL_IDIOMS.reduce(
    (sum, it) => sum + it.idiom.length + it.examples.reduce((s, e) => s + e.length, 0),
    0,
  );
console.log(
  `Audio: ~${totalAudioChars} characters total (~${totalAudioChars} credits to generate every clip once on multilingual v2).`,
);

const totalAudioItems =
  ALL_SHADOWING.length +
  ALL_DIALOGUES.length +
  ALL_GRAMMAR.length +
  ALL_MONOLOGUES.length +
  ALL_PROMPTS.length +
  ALL_PRONUNCIATION.length +
  ALL_VOCABULARY.length +
  ALL_IDIOMS.length +
  ALL_PHRASES.length;
const requireAudio = process.argv.slice(2).includes('--require-audio');
if (missingAudio > 0) {
  const line = `${missingAudio}/${totalAudioItems} audio clip(s) have no .ogg yet. Run "pnpm generate-audio".`;
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
