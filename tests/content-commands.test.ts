import { describe, expect, it } from 'vitest';
import { CONTENT_COMMANDS, GRAMMAR_COMMAND } from '../src/content-commands';

/**
 * The content-command registry is the single source of truth for the on-demand
 * commands, /listen, /help, and the command menu. These checks lock its shape so
 * a careless edit (a duplicate command, a missing field, the wrong /listen set)
 * is caught here rather than in production.
 */
describe('CONTENT_COMMANDS registry', () => {
  it('lists exactly the expected commands, in the menu/help order', () => {
    expect(CONTENT_COMMANDS.map((c) => c.command)).toEqual([
      'quiz',
      'grammar',
      'story',
      'vocab',
      'phrase',
      'idiom',
      'dialogue',
      'shadow',
      'talk',
      'monologue',
      'prompt',
      'pronounce',
    ]);
  });

  it('has unique command names and aliases (no collisions)', () => {
    const names = CONTENT_COMMANDS.flatMap((c) => [c.command, ...(c.aliases ?? [])]);
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps /pron as a hidden alias of /pronounce', () => {
    const pronounce = CONTENT_COMMANDS.find((c) => c.command === 'pronounce');
    expect(pronounce?.aliases).toContain('pron');
  });

  it('includes every audio type in /listen and excludes only the text-only quiz', () => {
    const inListen = CONTENT_COMMANDS.filter((c) => c.inListen).map((c) => c.command);
    expect(inListen).not.toContain('quiz');
    // Everything except quiz is a voice message, so it belongs in /listen.
    expect(inListen.length).toBe(CONTENT_COMMANDS.length - 1);
  });

  it('marks grammar as the only custom-handler command and exposes it', () => {
    const custom = CONTENT_COMMANDS.filter((c) => c.customHandler).map((c) => c.command);
    expect(custom).toEqual(['grammar']);
    expect(GRAMMAR_COMMAND.command).toBe('grammar');
  });

  it('gives every command the fields /help and the menu need', () => {
    for (const c of CONTENT_COMMANDS) {
      expect(c.emoji.length).toBeGreaterThan(0);
      expect(c.help.length).toBeGreaterThan(0);
      expect(c.menu.length).toBeGreaterThan(0);
      expect(typeof c.send).toBe('function');
    }
  });
});
