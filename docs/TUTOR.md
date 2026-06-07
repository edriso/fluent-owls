# The personal tutor (optional database)

By default Fluent Owls is a stateless channel broadcaster with **no database**.
Set `DATABASE_URL` and one extra feature switches on: a **personal tutor** in the
bot's DMs that remembers where each learner is, walks them through the content in
sequence, and keeps a daily streak.

## Commands (DM the bot)

| Command   | What it does                                                                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/next`   | Sends your next item, in sequence, at your level. Rotates through quiz, grammar, phrase, dialogue, shadow, and prompt, advancing a cursor per kind so you do not repeat until that kind's pool cycles. Keeps your daily streak. |
| `/level`  | Set your level: `/level b1` (a1, a2, b1, b2, c1, c2). `/next` then matches it.                                                                                                                                                  |
| `/streak` | Show your current streak and level.                                                                                                                                                                                             |

The stateless on-demand commands (`/quiz`, `/grammar`, `/shadow`, ...) still work
the same; `/next` is the one that tracks progress.

## Why a direct driver, not Prisma

The tilawah bot uses Prisma because it tracks rich per-user reading state. This
bot needs only two tiny tables and **compiles to `dist/` with a slim runtime
image**, where Prisma's generated client and a separate `migrate` compose service
add fragile build steps. So this bot uses the `mysql2` driver directly and
creates its tables with `CREATE TABLE IF NOT EXISTS` on boot. That means:

- no codegen, no `prisma generate` in the Dockerfile or CI;
- **no migration step** to run, ever (the tables appear on first boot);
- the database is **optional**: no `DATABASE_URL`, no database, bot unchanged.

If the fleet later standardizes on Prisma everywhere, this is easy to swap.

## Schema

One table (a second is room to grow). Created automatically; you never run SQL.

```sql
CREATE TABLE learners (
  telegram_id BIGINT PRIMARY KEY,   -- the learner's Telegram user id
  level       VARCHAR(2)  DEFAULT 'b1',
  step        INT         DEFAULT 0,   -- round-robin position across kinds
  cursors     TEXT,                    -- JSON: { kind: position } per kind
  streak      INT         DEFAULT 0,
  last_day    VARCHAR(10),             -- YYYY-MM-DD in TZ_NAME, for the streak
  created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Setup (server)

The shared MariaDB and this bot's database/user already exist (see the server's
`docs/05-databases.md`). To enable the tutor:

1. In the bot's `.env`, set `DATABASE_URL="mysql://fluentowls:<password>@shared-db:3306/fluentowls_db"`.
2. Bring up the bot: `cd /opt/bots && docker compose up -d --build fluent-owls`
   (a push to `main` also deploys via CI). On boot the bot connects and creates
   the `learners` table. There is **nothing else to run**.

To turn the tutor off again, unset `DATABASE_URL` and redeploy.

### About the `<bot>-migrate` service

This bot does NOT use Prisma, so the shared `compose-with-db.yml` template's
default command (`pnpm prisma migrate deploy`) fails with "Command prisma not
found". You do not need a migrate service at all (tables auto-create on boot).
If you keep one for fleet consistency, set its command to **`pnpm db:deploy`** —
a tiny entrypoint (`src/migrate.ts`) that runs the same `CREATE TABLE IF NOT
EXISTS` and exits. It reuses the bot image (which has tsx + mysql2 + dist), so no
`target: builder` is needed.

## Safety

- If `DATABASE_URL` is wrong or the database is down at boot, the bot logs the
  error, disables the tutor for that run, and **keeps posting to the channel**.
  A database problem never stops the daily content.
- The pure logic (streak math in `src/lib/streak.ts`, item selection in
  `src/lib/tutor.ts`) is unit-tested with no database connection.
