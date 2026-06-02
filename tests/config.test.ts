import { describe, expect, it } from 'vitest';
import { channelUrlFrom } from '../src/config';

// resolvePort moved to telegram-broadcast-kit (the kernel's health server reads
// PORT itself), and is tested there. channelUrlFrom is fluent-owls-specific
// (the /start DM link) and stays here.
describe('channelUrlFrom', () => {
  it('builds a t.me link from a valid @username', () => {
    expect(channelUrlFrom('@fluent_owls')).toBe('https://t.me/fluent_owls');
  });

  it('passes through a full t.me URL', () => {
    expect(channelUrlFrom('https://t.me/fluent_owls')).toBe('https://t.me/fluent_owls');
    expect(channelUrlFrom('t.me/fluent_owls')).toBe('https://t.me/fluent_owls');
  });

  it('returns null for a numeric chat id', () => {
    expect(channelUrlFrom('-1001234567890')).toBeNull();
  });

  it('rejects a too-short @handle', () => {
    expect(channelUrlFrom('@ab')).toBeNull();
  });
});
