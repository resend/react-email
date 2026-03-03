import { getUrlFromString } from './utils';

describe('getUrlFromString', () => {
  it('returns hash as-is', () => {
    expect(getUrlFromString('#')).toBe('#');
  });

  it('returns valid https URLs as-is', () => {
    expect(getUrlFromString('https://example.com')).toBe(
      'https://example.com',
    );
  });

  it('returns valid http URLs as-is', () => {
    expect(getUrlFromString('http://example.com')).toBe('http://example.com');
  });

  it('returns mailto URLs as-is', () => {
    expect(getUrlFromString('mailto:user@example.com')).toBe(
      'mailto:user@example.com',
    );
  });

  it('returns tel URLs as-is', () => {
    expect(getUrlFromString('tel:+1234567890')).toBe('tel:+1234567890');
  });

  it('rejects javascript: URLs', () => {
    expect(getUrlFromString('javascript:alert(1)')).toBeNull();
  });

  it('rejects data: URLs', () => {
    expect(getUrlFromString('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('rejects vbscript: URLs', () => {
    expect(getUrlFromString('vbscript:msgbox')).toBeNull();
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
