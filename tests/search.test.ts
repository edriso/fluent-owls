import { describe, expect, it } from 'vitest';
import { searchGrammar } from '../src/lib/search';

describe('searchGrammar', () => {
  it('finds a rule by topic words', () => {
    const found = searchGrammar('present perfect');
    expect(found).not.toBeNull();
    expect(`${found!.rule} ${found!.explanation}`.toLowerCase()).toContain('perfect');
  });

  it('finds conditionals', () => {
    const found = searchGrammar('conditional');
    expect(found).not.toBeNull();
    expect(`${found!.rule} ${found!.explanation}`.toLowerCase()).toContain('conditional');
  });

  it('handles a natural question', () => {
    const found = searchGrammar('when do I use the passive?');
    expect(found).not.toBeNull();
    expect(`${found!.rule} ${found!.explanation}`.toLowerCase()).toContain('passive');
  });

  it('returns null for nonsense', () => {
    expect(searchGrammar('xyzzy qwerty zzz')).toBeNull();
  });

  it('returns null for an empty or too-short query', () => {
    expect(searchGrammar('')).toBeNull();
    expect(searchGrammar('a an of')).toBeNull();
  });
});
