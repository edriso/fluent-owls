# syntax=docker/dockerfile:1
#
# Multi-stage build for the Fluent Owls Telegram bot.
# Builder installs every dep, generates the Prisma client, and compiles TS to JS.
# Runtime is a slim image with only the compiled output and prod node_modules.
#
# The `fluent-owls-migrate` compose service points at the `builder` stage (which
# keeps the prisma CLI and the schema) and runs `pnpm db:deploy`.
#
# `tsx` stays in the runtime image because the start command is
# `node --import tsx dist/src/index.js` (its ESM hook resolves the
# extension-less relative imports in dist/).

# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

# Copy the Prisma schema/config before install so the postinstall `prisma
# generate` hook has them. We do NOT use --ignore-scripts here: Prisma needs its
# install scripts (engines) and our postinstall generate. `pnpm.onlyBuiltDependencies`
# in package.json approves the Prisma packages; other unapproved scripts are
# skipped (esbuild ships its binary via optional deps, so it needs none).
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
# Regenerate against the final tree (idempotent) and compile to dist/.
RUN pnpm exec prisma generate
RUN pnpm build

# ---------- runtime ----------
FROM node:22-alpine
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
# --prod drops devDependencies (typescript, vitest, prettier, prisma CLI) but
# keeps the Prisma client/adapter/driver and tsx. --ignore-scripts is safe at
# runtime: the client was generated in the builder (and compiled into dist), and
# the driver adapter needs no separate query engine.
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/dist ./dist

# The bot writes nothing to disk: content and audio ship in the image, the
# optional tutor state lives in the shared database. No volume to manage.

# Drop privileges. The official node image ships a `node` user (UID 1000).
USER node

# Long-polling bot: no inbound port needed (the /health server binds PORT).
CMD ["node", "--import", "tsx", "dist/src/index.js"]
