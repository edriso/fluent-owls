import { loadEnv } from 'telegram-broadcast-kit';

// One .env for the whole bot, loaded through the shared kernel: loadEnv()
// finds the project root (the folder with package.json) and loads the single
// .env there. Production hosts inject env vars directly; loadEnv is a no-op
// then because dotenv never overrides an already-set variable.
loadEnv();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalBigInt(raw: string | undefined): bigint | null {
  if (!raw) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

/**
 * Turn a raw value into a public https://t.me/ link, or null if it has no
 * derivable public link. Accepts an "@username", a "t.me/..." URL, or a full
 * "https://t.me/..." URL. A numeric "-100..." id returns null because it has no
 * public link without an API call and admin rights.
 */
export function channelUrlFrom(raw: string): string | null {
  const id = raw.trim();
  if (id.startsWith('@')) {
    const handle = id.slice(1);
    return /^[A-Za-z0-9_]{4,32}$/.test(handle) ? `https://t.me/${handle}` : null;
  }
  const m = id.match(/^https?:\/\/t\.me\/(.+)$/i) ?? id.match(/^t\.me\/(.+)$/i);
  return m ? `https://t.me/${m[1]}` : null;
}

const channelChatId = requireEnv('CHANNEL_CHAT_ID').trim();
const channelPublicUrl = process.env.CHANNEL_PUBLIC_URL?.trim();

export const config = Object.freeze({
  botToken: requireEnv('BOT_TOKEN'),
  // Best practice is the numeric "-100..." id. "@channel" also works.
  channelChatId,
  // Public link for /start in DMs. null if not configured.
  channelUrl: channelUrlFrom(channelPublicUrl || channelChatId),
  // Optional. If unset, /admin_* commands authorise nobody.
  adminTelegramId: optionalBigInt(process.env.ADMIN_TELEGRAM_ID),
  // Timezone for the cron schedule. Defaults to UTC.
  timezone: process.env.TZ_NAME?.trim() || 'UTC',
  // When the daily set posts (everything together), in the configured timezone.
  // Default 18:00 (6pm): research shows educational channels get the best
  // engagement on weekday evenings, and one focused daily drop beats scattering
  // posts. Override via env.
  dailyCron: process.env.DAILY_CRON?.trim() || '0 18 * * *',
  // Optional. When set, the personal-tutor commands (/next, /level, /streak)
  // turn on and store per-user progress in the shared MariaDB. When unset, the
  // bot runs exactly as before: a stateless channel broadcaster, no database.
  databaseUrl: process.env.DATABASE_URL?.trim() || null,
  isDev: process.env.NODE_ENV !== 'production',
});
