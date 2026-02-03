import { describe, expect, it } from 'vitest';
import { extractTweetIdFromUrl } from './twitter-utils';

describe('extractTweetIdFromUrl', () => {
  it('extracts IDs from valid Twitter/X URLs', () => {
    const validUrls = [
      'https://twitter.com/username/status/1234567890',
      'https://x.com/username/status/1234567890',
      'https://twitter.com/username/statuses/1234567890',
      'https://twitter.com/i/web/status/1234567890',
      'http://twitter.com/username/status/1234567890',
      'https://twitter.com/username/status/1234567890/',
      '  https://twitter.com/username/status/1234567890  ',
      '1234567890', // raw ID
    ];

    validUrls.forEach((url) => {
      expect(extractTweetIdFromUrl(url)).toBe('1234567890');
    });
  });

  it('extracts ID from subdomain URL', () => {
    const url = 'https://mobile.twitter.com/username/status/1234567890';
    expect(extractTweetIdFromUrl(url)).toBe('1234567890');
  });

  it('extracts ID from URL with query parameters', () => {
    const url = 'https://twitter.com/username/status/1234567890?s=20&t=abc';
    expect(extractTweetIdFromUrl(url)).toBe('1234567890');
  });

  it('extracts ID from URL with hash fragment', () => {
    const url = 'https://twitter.com/username/status/1234567890#reply';
    expect(extractTweetIdFromUrl(url)).toBe('1234567890');
  });

  it('returns null for invalid Twitter/X URLs', () => {
    const urls = [
      'https://twitter.com/username',
      'https://twitter.com/username/likes',
      'https://twitter.com/status',
      'https://twitter.com/status/',
      'https://twitter.com/username/status/abc123',
      'https://example.com/username/status/1234567890',
    ];

    urls.forEach((url) => {
      expect(extractTweetIdFromUrl(url)).toBeNull();
    });
  });

  it('returns null for nullish input', () => {
    expect(extractTweetIdFromUrl(null as unknown as string)).toBeNull();
    expect(extractTweetIdFromUrl(undefined as unknown as string)).toBeNull();

    expect(extractTweetIdFromUrl('')).toBeNull();
  });
});
