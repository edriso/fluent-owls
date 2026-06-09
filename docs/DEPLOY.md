# Deployment

This bot is small and (by default) stateless. It runs anywhere Node 20 runs: Fly.io, Railway, Render, a VPS, a Docker container, or your laptop. The one thing it needs on disk is the voice clips, which are NOT in the repo and are supplied at runtime by a bind mount (see [Audio](#audio-voice-clips) below). There is no database unless you opt into the personal tutor (`DATABASE_URL`), whose Prisma schema is applied by a one-off `fluent-owls-migrate` step on deploy. A redeploy is the whole release process.

## What you need

1. A Telegram bot from `@BotFather`. Save the token.
2. A Telegram channel where the bot is an admin with **Post messages** permission. No other right is required.
3. The channel id. Easiest path: forward a channel message to `@RawDataBot` or `@JsonDumpBot` and read `chat.id`. It looks like `-1001234567890`. The numeric id is preferred; it survives a username change.

## Environment variables

| Variable             | Required | Notes                                                     |
| -------------------- | -------- | --------------------------------------------------------- |
| `BOT_TOKEN`          | yes      | From `@BotFather`.                                        |
| `CHANNEL_CHAT_ID`    | yes      | Numeric `-100...` is best; `@channel` also works.         |
| `CHANNEL_PUBLIC_URL` | no       | Public link shown by `/start` in DMs.                     |
| `ADMIN_TELEGRAM_ID`  | no       | Unlocks the `/admin_*` slot commands in DMs.              |
| `TZ_NAME`            | no       | Cron timezone. Default Africa/Cairo.                      |
| `DAILY_CRON`         | no       | When the daily set posts (default `0 18 * * *`).          |
| `REMINDER_CRON`      | no       | Per-user reminder time (default `0 9 * * *`, tutor only). |
| `DATABASE_URL`       | no       | Enables the personal tutor; Prisma/MariaDB URL.           |
| `PORT`               | no       | `/health` server port. Default 8080.                      |
| `NODE_ENV`           | no       | `production` for hosted.                                  |

The `.env` file is optional. If you set the variables in your host dashboard, you do not need a file at all.

## Personal tutor (optional database)

The bot runs with no database by default. To turn on the personal tutor (the `/next`, `/level`, `/streak` DM commands and per-user streaks), set `DATABASE_URL` to point at the shared MariaDB:

```
DATABASE_URL="mysql://fluentowls:<password>@shared-db:3306/fluentowls_db"
```

It uses **Prisma**, like the other DB-backed bots, so it follows the standard `<bot>-migrate` pattern. Add a `fluent-owls-migrate` service to `/opt/bots/docker-compose.yml` that targets the build stage (which keeps the prisma CLI) and runs `pnpm db:deploy`, then apply migrations and start the bot:

```bash
cd /opt/bots && docker compose run --rm --build fluent-owls-migrate
docker compose up -d --build fluent-owls
```

The CI deploy runs both for you on push. The exact `fluent-owls-migrate` service block, schema, and commands are in [`TUTOR.md`](./TUTOR.md). The shared DB and this bot's database/user are set up once on the server (see the server's `docs/05-databases.md`). To turn the tutor off, unset `DATABASE_URL` and remove the migrate step from the deploy.

## Audio (voice clips)

The voice clips are AI-generated with ElevenLabs and are **not in the repository**: they are ElevenLabs output under the owner's commercial license, governed by the ElevenLabs Terms of Service, so they are git-ignored and not redistributed (see [`../NOTICE`](../NOTICE)). The running bot only reads them; production needs no text-to-speech key.

Because the clips live outside git, they are **not** baked into the Docker image either. The runtime stage ships only the code; the clips are supplied at runtime by a **read-only bind mount** onto `src/content/audio`. The clips are durable host data, like a database volume, decoupled from the code release. This also keeps the image and the public repo small and code-only.

**One-time host setup (VPS):** keep all bots' runtime data in one tree, `/opt/bots/data/<bot>/...`, OUTSIDE the git checkouts, so no `git pull`/`reset` can ever touch it. This bot's clips live in `/opt/bots/data/fluent-owls/audio/`. Mount that into the container. In `/opt/bots/docker-compose.yml`, the `fluent-owls` service (the bot only, not the migrate helper) gets:

```yaml
fluent-owls:
  build: ./telegram/fluent-owls
  env_file: ./telegram/fluent-owls/.env
  restart: unless-stopped
  volumes:
    - ./data/fluent-owls/audio:/app/src/content/audio:ro # voice clips, read-only
  depends_on:
    shared-db:
      condition: service_healthy
```

The compose file lives at `/opt/bots/`, so the relative source `./data/fluent-owls/audio` resolves to `/opt/bots/data/fluent-owls/audio`. The `:ro` makes it read-only (the bot never writes audio). The target `/app/src/content/audio` matches where the bot resolves clips (`process.cwd()` is `/app`). To populate or refresh the host folder, generate the clips on your laptop (`pnpm generate-audio`) and copy them up:

```bash
rsync -av src/content/audio/ <SERVER_IP>:/opt/bots/data/fluent-owls/audio/
```

`generate-audio` is idempotent (it skips a clip whose `.ogg` already exists), so after adding content you regenerate only the new clips and rsync again. No redeploy is needed for an audio-only change; the bind mount is live.

The `ELEVENLABS_*` variables in `.env.example` are **dev only**: they are used by `pnpm generate-audio` and are never read by the running bot. Leave them unset in production. Watch the boot log: index.ts logs `No audio clips found` (an error, meaning the mount is missing or empty) or `Audio clips available` with a count when the mount is healthy.

## First post: the pinned welcome

Once the bot is up and is a channel admin, run:

```bash
pnpm post-welcome
```

The bot posts the welcome message and prints its message id. Open the channel, long-press the welcome, and pin it. To edit later in place (the pin stays, no notification fires):

```bash
pnpm post-welcome <message_id>
```

## Smoke test the slots

```bash
pnpm send-test morning    # fires today's A1-A2 question to the channel now
pnpm send-test midday     # B1-B2
pnpm send-test evening    # C1-C2
pnpm send-test grammar    # today's grammar point (text + audio examples)
pnpm send-test phrase     # today's "say it like a native" phrase
pnpm send-test dialogue   # today's role-play dialogue (two-voice audio)
pnpm send-test shadow     # today's shadowing voice clip (needs the .ogg generated)
pnpm send-test all        # the whole daily set, in order
```

The `grammar`, `dialogue`, and `shadow` slots post audio files, so run `pnpm generate-audio` (dev only, see [SPEAKING.md](./SPEAKING.md)) to create the `.ogg` files locally before relying on them. The clips are git-ignored, so they stay on your machine (and on the production host's bind mount), never in the repo.

The script preflights `getChat` first, so a wrong token or channel id gives one clean error instead of two confusing ones.

## Hosting recipes

### Railway

1. Create a new project from this repo.
2. Add the env vars in the dashboard.
3. Set the start command to `pnpm start` (after a build step) or run `tsx src/index.ts` directly.

### Fly.io

```bash
fly launch --no-deploy
fly secrets set BOT_TOKEN=... CHANNEL_CHAT_ID=... TZ_NAME=Europe/London
fly deploy
fly logs
```

The `/health` endpoint on port 8080 keeps the machine alive.

### Plain VPS

```bash
pnpm install --prod
pnpm build
pnpm start
```

Wrap it in a systemd unit or pm2 so it restarts on crash.

### Docker

```Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "--import", "tsx", "dist/src/index.js"]
```

Logs go to stdout. There is nothing to mount.

## Verifying it works

1. Check `/health` returns 200 with `{"ok":true,...}` (the startup log reports `posts: 7`, the size of the daily set).
2. Tail the logs for a `Scheduler started` line at startup.
3. Send `/start` to the bot in a DM; you should get a reply pointing at the channel.
4. Run `pnpm send-test morning` to verify a channel post end to end.
5. Wait for a cron to fire. The first real fire is the final test.

## When something breaks

- **No post arrived.** Check the logs for a `Failed to post...` line. The usual cause is the bot is not a channel admin or "Post messages" is off.
- **403 from Telegram.** Same answer: admin rights.
- **400 on sendPoll.** An option over 100 chars or a bad option count. Run `pnpm audit-questions`.
- **A voice post did not arrive** (`Failed to post shadowing voice` or `Failed to post role-play dialogue`, "is the audio generated?"). The `.ogg` file is missing. Run `pnpm generate-audio` and commit the files, or `pnpm audit-speaking --require-audio` to find every gap. The other posts are unaffected.
- **Every voice post fails at once, but quizzes and the text phrase still arrive** (you see `No audio clips found` at boot, or a wall of "is the audio generated?" for grammar, dialogue, and shadow together). The audio bind mount is missing or empty. Confirm with `docker compose exec fluent-owls ls src/content/audio | head` (expect only `README.md`, or `No such file or directory`, when broken). Check that the host folder `/opt/bots/data/fluent-owls/audio/` exists and is full of `.ogg` files, and that the `fluent-owls` service in `/opt/bots/docker-compose.yml` has the `volumes: - ./data/fluent-owls/audio:/app/src/content/audio:ro` line (see [Audio](#audio-voice-clips)). Re-up with `docker compose up -d fluent-owls`. This is distinct from one clip missing above: here the whole directory is absent.

## Backups

The code is in git, so the repo is the truth for everything except the voice clips. The clips are NOT in the repo (see [Audio](#audio-voice-clips)), so they are the one thing to keep a copy of: they cost ElevenLabs credits to make, and regenerating all of them is not free. Keep the clip folder backed up off the host (a `tar czf fluent-owls-audio.tgz src/content/audio` kept somewhere safe, or attached as a private release asset). You can always rebuild them from the transcripts with `pnpm generate-audio`, but only with an ElevenLabs key and credits, so a copy saves both. The tutor database, if enabled, is backed up with the shared MariaDB dump (see the server's cheatsheet). Pin the welcome once and forget it.
