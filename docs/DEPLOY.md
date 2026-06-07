# Deployment

This bot is small and (by default) stateless. It runs anywhere Node 20 runs: Fly.io, Railway, Render, a VPS, a Docker container, or your laptop. There is no volume to mount, and no database unless you opt into the personal tutor (`DATABASE_URL`), whose Prisma schema is applied by a one-off `fluent-owls-migrate` step on deploy. A redeploy is the whole release process.

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

The `ELEVENLABS_*` variables in `.env.example` are **dev only**: they are used by `pnpm generate-audio` to create the audio clips once (shadowing, dialogues, grammar, monologues, prompts), and are never read by the running bot. Leave them unset in production. The committed `.ogg` files in `src/content/audio/` are all production needs, so make sure they ship with your deploy (the Docker recipe below copies the whole repo, so they are included).

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

The `grammar`, `dialogue`, and `shadow` slots post committed audio files, so run `pnpm generate-audio` (dev only, see [SPEAKING.md](./SPEAKING.md)) and commit the `.ogg` files before relying on them.

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

## Backups

There is nothing to back up. The repo is the truth. Pin the welcome once and forget it.
