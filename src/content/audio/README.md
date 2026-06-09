# Speaking audio (generated locally, NOT in git)

This folder holds the `.ogg` voice clips for the audio exercises, named
`<id>.ogg` to match their content: shadowing clips (`shadowing-*.ts`), role-play
dialogues (`dialogues-*.ts`, two voices stitched together), grammar examples
(`grammar-*.ts`), monologues (`monologues-*.ts`), question prompts
(`prompts-*.ts`, a question, a pause, then a model answer), and the other spoken
types. They are **OGG/Opus**, the format Telegram wants for a voice message.

The `.ogg` files are **git-ignored and not part of this repository.** They are
AI-generated with ElevenLabs under the owner's commercial license, governed by
the ElevenLabs Terms of Service, so they are not redistributed here (see
[`NOTICE`](../../../NOTICE)). The bot reads them from this folder at runtime; in
production the folder is a read-only bind mount of the host's clip store (see
[`docs/DEPLOY.md`](../../../docs/DEPLOY.md)).

To create them, run `pnpm generate-audio` (dev only, needs `ELEVENLABS_API_KEY`
and `ffmpeg`). See [`docs/SPEAKING.md`](../../../docs/SPEAKING.md). It is
idempotent: a clip whose `.ogg` already exists is skipped.

Do not edit the `.ogg` files by hand. Edit the transcript in the matching
`*-<level>.ts` (the transcripts ARE in the repo and are 0BSD-licensed), then
regenerate.
