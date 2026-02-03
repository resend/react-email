/**
 * Extracts the tweet ID from various Twitter/X URL formats.
 * Supports both twitter.com and x.com domains.
 */
export function extractTweetIdFromUrl(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Try to match the input against various URL patterns
  try {
    if (/^\d+$/.test(input)) {
      return input;
    }

    const url = new URL(input.trim());

    if (!url.hostname.match(/^(?:.*\.)?(?:twitter\.com|x\.com)$/)) {
      return null;
    }

    const segments = url.pathname.split('/').filter(Boolean);

    for (let i = 0; i < segments.length - 1; i++) {
      if (['status', 'statuses'].includes(segments[i])) {
        const tweetId = segments[i + 1];

        if (/^\d+$/.test(tweetId)) {
          return tweetId;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}
