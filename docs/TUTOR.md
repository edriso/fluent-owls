# The personal tutor (optional database)

By default Fluent Owls is a stateless channel broadcaster with **no database**.
Set `DATABASE_URL` and one extra feature switches on: a **personal tutor** in the
bot's DMs that remembers where each learner is, walks them through the content in
sequence, and keeps a daily streak.

## Commands (DM the bot)

| Command      | What it does                                                                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/next`      | Sends your next item, in sequence, at your level. Rotates through quiz, grammar, phrase, dialogue, shadow, and prompt, advancing a cursor per kind so you do not repeat until that kind's pool cycles. Keeps your daily streak. |
| `/level`     | Set your level: `/level b1` (a1, a2, b1, b2, c1, c2). `/next` then matches it.                                                                                                                                                  |
| `/streak`    | Show your current streak, level, and reminder setting.                                                                                                                                                                          |
| `/reminders` | Turn the daily practice reminder on or off: `/reminders off`.                                                                                                                                                                   |

The stateless on-demand commands (`/quiz`, `/grammar`, `/shadow`, ...) still work
the same; `/next` is the one that tracks progress.

## Stack

Prisma with the MariaDB driver adapter (`@prisma/adapter-mariadb`), the same as
the tilawah bot, so it fits the fleet: a shared MariaDB and a `<bot>-migrate`
deploy step. The connection URL is supplied at runtime by the adapter; the
generated client lives in `src/database/generated` (gitignored, recreated by
`prisma generate`). The schema is one table:

```prisma
model Learner {
  telegramId BigInt   @id @map("telegram_id")  // the learner's Telegram user id
  level      String   @default("b1")           // CEFR level for /next
  step       Int      @default(0)              // round-robin position across kinds
  cursors    String?  @db.Text                 // JSON { kind: position } per kind
  streak     Int      @default(0)
  lastDay    String?  @map("last_day")         // YYYY-MM-DD in TZ_NAME, for the streak
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

The pure logic (streak math in `src/lib/streak.ts`, item selection in
`src/lib/tutor.ts`) is unit-tested with no database connection.

## Setup (server)

The shared MariaDB and this bot's database/user already exist (see the server's
`docs/05-databases.md`). To enable the tutor:

1. In the bot's `.env`, set `DATABASE_URL="mysql://fluentowls:<password>@shared-db:3306/fluentowls_db"`.
2. Make sure `/opt/bots/docker-compose.yml` has a **`fluent-owls-migrate`** service
   that targets the build stage with the prisma CLI and runs `pnpm db:deploy`:

   ```yaml
   fluent-owls-migrate:
     build:
       context: ./telegram/fluent-owls # your path to the bot
       target: builder # the build stage keeps the prisma CLI
     env_file: ./telegram/fluent-owls/.env
     command: pnpm db:deploy # = prisma migrate deploy
     depends_on:
       shared-db:
         condition: service_healthy
     restart: 'no'
     profiles: ['migrate']
   ```

3. Apply the migration, then start the bot:

   ```bash
   cd /opt/bots && docker compose run --rm --build fluent-owls-migrate
   docker compose up -d --build fluent-owls
   ```

   With auto-deploy, the GitHub workflow runs both steps for you on push.

To turn the tutor off again, unset `DATABASE_URL` and redeploy (the migrate step
will be a no-op against an empty URL, so also remove it from the deploy if you
fully disable the DB).

## Migrations

Migrations live in `prisma/migrations` and are applied with `prisma migrate
deploy` (`pnpm db:deploy`) inside the container. The initial migration uses
`CREATE TABLE IF NOT EXISTS`, so it is safe to apply even if the table already
exists. After a schema change, create a new migration with `pnpm db:migrate`
against a dev database, commit it, and the deploy applies it.

## Daily reminders

When the tutor is on, a scheduled job (`REMINDER_CRON`, default 09:00 in
`TZ_NAME`) DMs each learner who has reminders on, has practised at least once
before, and has not practised yet today, nudging them to keep their streak. New
users who only typed `/start` are never nagged (they have no practice day yet).
Learners opt out with `/reminders off`. The job is only scheduled when the
database is enabled, and each send is wrapped so one blocked user cannot stop the
rest.

## Asking about grammar

Separate from the tutor (works with or without the database): in a DM, send
`/grammar <topic>` or just type a topic ("present perfect", "second
conditional") and the bot searches the grammar bank and replies with the
matching rule plus its spoken examples. See `src/lib/search.ts`.

## Safety

- The database is OPTIONAL. With no `DATABASE_URL`, `prisma` is null, the tutor
  commands hide themselves (`setMyCommands` omits them) and reply that they are
  off, and the channel broadcaster runs unchanged.
- The bot connects lazily; the daily channel posts do not depend on the database.
