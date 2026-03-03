import { getUrlFromString } from './utils';

describe('getUrlFromString', () => {
  it('returns hash as-is', () => {
    expect(getUrlFromString('#')).toBe('#');
  });

  it('returns valid URLs as-is', () => {
    expect(getUrlFromString('https://example.com')).toBe(
      'https://example.com',
    );
  });

  it('auto-prefixes URLs with dots', () => {
    const result = getUrlFromString('example.com');
    expect(result).toBe('https://example.com/');
  });

  it('returns null for invalid strings', () => {
    expect(getUrlFromString('not a url')).toBeNull();
  });

  it('returns null for strings without dots', () => {
    expect(getUrlFromString('justtext')).toBeNull();
  });
});
