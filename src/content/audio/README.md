# Shadowing audio (generated, committed)

These `.ogg` files are the voice clips for the shadowing exercises, one per
shadowing clip (`<id>.ogg`, matching `src/content/shadowing-*.ts`). They are
**OGG/Opus**, the format Telegram wants for a voice message.

They are **generated once and committed** so the running bot never calls a
text-to-speech API: no key, no cost, and no extra failure mode in production.

- To (re)generate: `pnpm generate-audio` (dev only). See [`docs/SPEAKING.md`](../../../docs/SPEAKING.md).
- These files are AI-generated with ElevenLabs and are **not** covered by the
  repository's MIT license. See [`NOTICE`](../../../NOTICE).

Do not edit the `.ogg` files by hand. Edit the transcript in the matching
`shadowing-*.ts`, then regenerate.
