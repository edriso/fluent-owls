import { describe, expect, it } from 'vitest';
import { channelUrlFrom, resolvePort } from '../src/config';

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

describe('resolvePort', () => {
  it('defaults to 8080 on garbage or empty input', () => {
    expect(resolvePort(undefined)).toBe(8080);
    expect(resolvePort('not-a-number')).toBe(8080);
    expect(resolvePort('0')).toBe(8080);
  });

  it('accepts a valid port', () => {
    expect(resolvePort('3000')).toBe(3000);
  });
});
