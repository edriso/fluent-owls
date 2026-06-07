/**
 * Core domain types for the Fluent Owls quiz bot.
 *
 * The content fields are the source of truth and live in
 * src/content/questions-*.ts, one file per CEFR level. Each question is sent
 * to the channel as a single native Telegram quiz poll: the sentence (with a
 * blank) is the poll question, the answer choices are the poll options, and a
 * short explanation is revealed after the reader votes.
 *
 * Constraints (validated by scripts/audit-questions.ts and the unit tests):
 *  - `options` has 2 to 10 entries, each unique and <= 100 chars
 *  - `correctIndex` points at one of those options
 *  - the rendered poll question (header + prompt) is <= 300 chars
 *  - `explanation` is <= 200 chars (Telegram quiz poll limit)
 */

/**
 * CEFR levels, from beginner (A1) to mastery (C2).
 *
 * We use the international CEFR scale instead of "easy/medium/hard" because it
 * is the standard learners already recognize, and it lets people see exactly
 * where they are on their English journey. Each posting slot draws from a band
 * of levels (see schedules.ts).
 *
 * See: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
 */
export type Level = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

/** All levels in order, beginner first. The single source of truth for "every level". */
export const LEVELS: readonly Level[] = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

/**
 * The English skill a question trains.
 *
 * These are the areas where learners gain the most. Collocations, phrasal
 * verbs, and idioms in particular are what make someone sound natural rather
 * than merely correct. The topic is shown in the question header.
 */
export type Topic =
  | 'vocabulary'
  | 'collocations'
  | 'phrasal-verbs'
  | 'idioms'
  | 'confusing-pairs'
  | 'prepositions'
  | 'grammar';

/**
 * A single multiple-choice quiz question, as written by an author.
 *
 * Most questions use the contextual fill-in-the-blank format: a natural
 * sentence with the target word blanked out using "____" (four underscores).
 * This "cloze in context" style is a proven, enjoyable way to build vocabulary
 * because the surrounding sentence shows how the word is actually used.
 */
export type QuizQuestion = {
  /** Stable, unique id. Starts with the level, e.g. "b1-007". */
  id: string;
  /** The sentence or question shown above the options. */
  prompt: string;
  /** Between 2 and 10 answer choices. */
  options: string[];
  /** Index into `options` of the correct answer (0-based). */
  correctIndex: number;
  /**
   * Short explanation shown after the reader votes. Good explanations teach the
   * rule or meaning, so even a wrong guess leaves the learner smarter.
   */
  explanation: string;
  /** The skill this question trains. Drives the header badge. */
  topic: Topic;
};

/**
 * A question paired with the CEFR level it was loaded from.
 *
 * Authors write plain {@link QuizQuestion} objects in each level's content
 * file. The content registry (content/index.ts) tags every question with its
 * level so the rest of the app can show a level badge and pick from level bands.
 */
export type LeveledQuestion = QuizQuestion & {
  /** The CEFR level this question belongs to. */
  level: Level;
};

/**
 * The speaking skill a shadowing clip trains.
 *
 * Sounding like a confident native is mostly these few things, none of which a
 * fill-in-the-blank quiz can teach. Each clip targets ONE so the tip stays
 * concrete. The label is woven into the "listen and repeat" instruction.
 *
 *  - linking:     connected speech (run words together, "pick it up" -> "pi-ki-tup")
 *  - stress:      sentence rhythm (stress the content words, swallow the rest)
 *  - intonation:  pitch movement (rising questions, falling statements, emotion)
 *  - reduction:   weak forms and contractions ("want to" -> "wanna", schwa sounds)
 *  - pacing:      thought groups and pausing (where natives breathe, not word by word)
 */
export type ShadowingFocus = 'linking' | 'stress' | 'intonation' | 'reduction' | 'pacing';

/**
 * One shadowing clip: a short, natural model sentence the learner listens to
 * and repeats out loud, copying the speaker's rhythm and melody. This is the
 * single most effective drill for pronunciation and fluency, and it is pure
 * broadcast: the bot delivers the model, the learner practises on their own.
 *
 * The audio is pre-generated once (scripts/generate-audio.ts) and committed as
 * an OGG/Opus file, so the running bot never calls a text-to-speech API: no key,
 * no cost, no new failure mode at runtime. The `text` is both the on-screen
 * transcript (in the voice caption) and the script the audio is generated from,
 * so the two can never drift.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - `text` is non-empty and <= TRANSCRIPT_MAX_CHARS (keeps clips short)
 *  - the rendered caption is <= CAPTION_MAX_CHARS (Telegram media caption limit)
 *  - no em-dashes anywhere (house style)
 */
export type ShadowingClip = {
  /** Stable, unique id. Starts with the level and a "sh" marker, e.g. "b1-sh-001". */
  id: string;
  /** The sentence(s) to listen to and repeat. Also the script the audio is built from. */
  text: string;
  /** Short real-situation label shown above the line, e.g. "Catching up with a friend". */
  context: string;
  /** The one delivery skill this clip drills. Woven into the instruction. */
  focus: ShadowingFocus;
  /** One concrete tip on HOW to say it, tied to the focus. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-sh-001.ogg". */
  audio: string;
};

/** A shadowing clip tagged with the CEFR level it was loaded from. */
export type LeveledShadowingClip = ShadowingClip & {
  /** The CEFR level this clip belongs to. */
  level: Level;
};

/**
 * The conversational job a native phrase does.
 *
 * These are the moves that make speech sound fluent and confident: agreeing,
 * disagreeing politely, giving an opinion, softening a request, buying time,
 * reacting, telling a story. The label is shown as the header badge.
 */
export type PhraseFunction =
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

/**
 * One "say it like a native" phrase: a ready-made chunk for a real situation,
 * with when to use it and an example. Posted as a voice message whose audio reads
 * the phrase and the example aloud, with the same text in an HTML caption, so
 * learners both read the chunk and HEAR it pronounced. Chunks are how fluent
 * speakers actually talk, in whole pre-built phrases rather than word by word, so
 * memorising a few makes you sound natural fast.
 *
 * The audio file name is derived from the id (`<id>.ogg`), so unlike the other
 * voice types a phrase has no separate `audio` field.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - every field is non-empty and within its limit (see limits.ts)
 *  - no em-dashes anywhere (house style)
 */
export type NativePhrase = {
  /** Stable, unique id. Starts with the level and a "ph" marker, e.g. "b1-ph-001". */
  id: string;
  /** The natural chunk itself, e.g. "I see what you mean, but...". */
  phrase: string;
  /** When to reach for it, e.g. "Disagreeing politely in a discussion". */
  situation: string;
  /** A full sample sentence that uses the phrase in context. */
  example: string;
  /** The conversational job it does. Drives the header badge. */
  fn: PhraseFunction;
};

/** A native phrase tagged with the CEFR level it was loaded from. */
export type LeveledNativePhrase = NativePhrase & {
  /** The CEFR level this phrase belongs to. */
  level: Level;
};

/** One line of a dialogue, said by speaker A or speaker B. */
export type DialogueTurn = {
  /** Who speaks this line. The two speakers get two different voices in the audio. */
  speaker: 'A' | 'B';
  /** What they say. One short, natural line. */
  text: string;
};

/**
 * One role-play mini-dialogue: a short real-situation exchange (2 to 4 turns)
 * the learner listens to and then shadows on BOTH sides. This is the bridge
 * between imitation (a single shadowing line) and real conversation: it trains
 * natural replies and turn-taking, the back-and-forth of actually talking.
 *
 * The audio is a single voice message built from the turns, with a different
 * voice for speaker A and speaker B (see scripts/generate-audio.ts), so it
 * sounds like a real two-person conversation. Generated once and committed, like
 * the shadowing clips, so the running bot never calls a text-to-speech API.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - 2 to 4 turns, alternating speakers, each line non-empty and within its limit
 *  - the rendered caption is <= CAPTION_MAX_CHARS
 *  - no em-dashes anywhere (house style)
 */
export type Dialogue = {
  /** Stable, unique id. Starts with the level and a "dl" marker, e.g. "b1-dl-001". */
  id: string;
  /** Short real-situation label, e.g. "Ordering at a café". */
  situation: string;
  /** The lines of the exchange, alternating between speaker A and speaker B. */
  turns: DialogueTurn[];
  /** One concrete tip: a useful pattern or reply to copy from the exchange. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-dl-001.ogg". */
  audio: string;
};

/** A dialogue tagged with the CEFR level it was loaded from. */
export type LeveledDialogue = Dialogue & {
  /** The CEFR level this dialogue belongs to. */
  level: Level;
};

/**
 * One grammar point: a short rule, a plain-English explanation, and two or three
 * example sentences. Posted as a voice message whose audio is the examples read
 * aloud, so the learner both reads the rule and HEARS it used correctly (text
 * plus sound in one post). Audio is generated once and committed, like the other
 * voice clips.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - rule, explanation, and 2 to 3 non-empty examples, each within its limit
 *  - the rendered caption is <= CAPTION_MAX_CHARS
 *  - no em-dashes anywhere (house style)
 */
export type GrammarRule = {
  /** Stable, unique id. Starts with the level and a "gr" marker, e.g. "b1-gr-001". */
  id: string;
  /** Short rule title, e.g. "Present perfect for life experience". */
  rule: string;
  /** Plain, junior-friendly explanation in one or two short sentences. */
  explanation: string;
  /** Two or three example sentences. These are what the audio reads aloud. */
  examples: string[];
  /** One concrete tip or common mistake to avoid. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-gr-001.ogg". */
  audio: string;
};

/** A grammar rule tagged with the CEFR level it was loaded from. */
export type LeveledGrammarRule = GrammarRule & {
  /** The CEFR level this rule belongs to. */
  level: Level;
};

/**
 * One model passage (a "monologue"): a few sentences of clear, natural English
 * on a useful everyday topic. The learner listens, then says it again in their
 * own words (a retell), which builds the ability to speak at length. Longer than
 * a shadowing line on purpose, so it trains stamina and flow. Single voice.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - topic and note non-empty within their limits
 *  - `text` non-empty and <= MONOLOGUE_MAX_CHARS
 *  - the rendered caption is <= CAPTION_MAX_CHARS
 *  - no em-dashes anywhere (house style)
 */
export type Monologue = {
  /** Stable, unique id. Starts with the level and an "mn" marker, e.g. "b1-mn-001". */
  id: string;
  /** Short topic label, e.g. "Describing your hometown". */
  topic: string;
  /** The passage to listen to and then retell. Also the script the audio uses. */
  text: string;
  /** One concrete tip on what to notice or aim for when retelling. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-mn-001.ogg". */
  audio: string;
};

/** A monologue tagged with the CEFR level it was loaded from. */
export type LeveledMonologue = Monologue & {
  /** The CEFR level this monologue belongs to. */
  level: Level;
};

/**
 * One question-prompt drill: a real conversation question, then (in the audio) a
 * pause for the learner to answer out loud, then a model answer. This trains
 * speaking on demand, the hardest part of fluency: the prompt removes "what do I
 * say?" so the learner can focus on HOW they say it, then self-compares with the
 * model. Two voices (the asker and the answerer). Audio generated once.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - question, answer, topic, and note non-empty within their limits
 *  - the rendered caption is <= CAPTION_MAX_CHARS
 *  - no em-dashes anywhere (house style)
 */
export type Prompt = {
  /** Stable, unique id. Starts with the level and a "pr" marker, e.g. "b1-pr-001". */
  id: string;
  /** Short context label, e.g. "Talking about work". */
  topic: string;
  /** The question the learner hears and answers. */
  question: string;
  /** A model answer, shown and spoken after the pause. */
  answer: string;
  /** One concrete tip: a useful structure or phrase to reuse in your own answer. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-pr-001.ogg". */
  audio: string;
};

/** A prompt tagged with the CEFR level it was loaded from. */
export type LeveledPrompt = Prompt & {
  /** The CEFR level this prompt belongs to. */
  level: Level;
};

/**
 * The pronunciation skill a drill trains. Each is a thing a learner can hear and
 * copy, none of which a written quiz can teach:
 *
 *  - minimal-pair:      two words that differ in one sound (ship/sheep), to train the ear and mouth
 *  - connected-speech:  how words blend, link, and reduce in natural speech (gonna, didja)
 *  - word-stress:       which syllable is stressed (REcord vs reCORD), which changes meaning
 *  - weak-forms:        how small words shrink when unstressed (to -> tuh, can -> kn)
 *  - spelling-sound:    how spelling maps to sound (silent letters, -ed endings, "ough"), to decode words
 */
export type PronunciationFocus =
  | 'minimal-pair'
  | 'connected-speech'
  | 'word-stress'
  | 'weak-forms'
  | 'spelling-sound';

/**
 * One pronunciation drill: a short, targeted listen-and-repeat exercise on a
 * single sound contrast or speech feature. Posted as a voice message whose audio
 * reads the `items` aloud (with small gaps), so the learner hears the difference
 * and copies it. Like the other voice content, audio is generated once and
 * committed, so the running bot never calls a text-to-speech API.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - title, explanation, and note non-empty within their limits
 *  - 2 to 6 non-empty `items`, each within its limit (these are read aloud)
 *  - the rendered caption is <= CAPTION_MAX_CHARS
 *  - no em-dashes anywhere (house style)
 */
export type PronunciationDrill = {
  /** Stable, unique id. Starts with the level and a "pn" marker, e.g. "b1-pn-001". */
  id: string;
  /** The pronunciation skill this drill trains. Drives the header badge. */
  focus: PronunciationFocus;
  /** Short label for the target, e.g. "ship vs sheep" or "want to becomes wanna". */
  title: string;
  /** Plain, junior-friendly explanation of how to make or hear the difference. */
  explanation: string;
  /** The lines read aloud (and shown): word pairs or short example sentences. */
  items: string[];
  /** One concrete tip or common mistake to avoid. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-pn-001.ogg". */
  audio: string;
};

/** A pronunciation drill tagged with the CEFR level it was loaded from. */
export type LeveledPronunciationDrill = PronunciationDrill & {
  /** The CEFR level this drill belongs to. */
  level: Level;
};

/**
 * One vocabulary entry: a single useful word taught in depth, with a plain
 * meaning, example sentences, and a usage tip (a collocation, synonym, or common
 * mistake). Unlike a quiz (which tests a word) or a phrase (a whole chunk), this
 * TEACHES one word richly. Posted as a voice message whose audio reads the word
 * and the examples aloud, so learners hear the pronunciation and the usage, with
 * the same text in an HTML caption. Depth of vocabulary, with correct
 * pronunciation, is a core part of sounding fluent.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - word, meaning, and note non-empty within their limits
 *  - 2 to 3 non-empty example sentences, each within its limit (read aloud)
 *  - the rendered caption is <= CAPTION_MAX_CHARS
 *  - no em-dashes anywhere (house style)
 */
export type VocabularyEntry = {
  /** Stable, unique id. Starts with the level and a "vc" marker, e.g. "b1-vc-001". */
  id: string;
  /** The target word (or short phrase), e.g. "reliable". */
  word: string;
  /** A plain, junior-friendly definition. */
  meaning: string;
  /** Two or three example sentences. The audio reads the word, then these. */
  examples: string[];
  /** One usage tip: a common collocation, a synonym, or a mistake to avoid. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-vc-001.ogg". */
  audio: string;
};

/** A vocabulary entry tagged with the CEFR level it was loaded from. */
export type LeveledVocabularyEntry = VocabularyEntry & {
  /** The CEFR level this entry belongs to. */
  level: Level;
};

/**
 * One idiom entry: a common figurative expression, with a plain meaning, example
 * sentences, and a usage tip (register, or a typical situation). Idioms are what
 * make speech sound natural and native rather than merely correct, but their
 * meaning cannot be guessed from the words, so each is taught directly. Posted as
 * a voice message whose audio reads the idiom and the examples aloud, with the
 * same text in an HTML caption, so learners hear how it is really said.
 *
 * Constraints (validated by scripts/audit-speaking.ts and the unit tests):
 *  - idiom, meaning, and note non-empty within their limits
 *  - 2 to 3 non-empty example sentences, each within its limit (read aloud)
 *  - the rendered caption is <= CAPTION_MAX_CHARS
 *  - no em-dashes anywhere (house style)
 */
export type IdiomEntry = {
  /** Stable, unique id. Starts with the level and an "idm" marker, e.g. "b1-idm-001". */
  id: string;
  /** The idiom itself, e.g. "break the ice". */
  idiom: string;
  /** A plain, junior-friendly meaning. */
  meaning: string;
  /** Two or three example sentences. The audio reads the idiom, then these. */
  examples: string[];
  /** One usage tip: register (formal/casual), or a typical situation. */
  note: string;
  /** File name of the committed OGG/Opus clip, e.g. "b1-idm-001.ogg". */
  audio: string;
};

/** An idiom entry tagged with the CEFR level it was loaded from. */
export type LeveledIdiomEntry = IdiomEntry & {
  /** The CEFR level this entry belongs to. */
  level: Level;
};
