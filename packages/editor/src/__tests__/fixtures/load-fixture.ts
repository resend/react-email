import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const cache = new Map<string, string>();

/**
 * Reads a fixture file relative to `src/__tests__/fixtures/`.
 * Cached so a single fixture file is read once per test process.
 *
 * Example: `loadFixture('paste-sources/word.html')`
 */
export function loadFixture(relativePath: string): string {
  const absolute = resolve(HERE, relativePath);
  let content = cache.get(absolute);
  if (content === undefined) {
    content = readFileSync(absolute, 'utf8');
    cache.set(absolute, content);
  }
  return content;
}
