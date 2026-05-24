import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FIXTURE_DIR = resolve(process.cwd(), 'src/__tests__/fixtures');
const cache = new Map<string, string>();

/**
 * Reads a fixture file relative to `src/__tests__/fixtures/`.
 * Cached so a single fixture file is read once per test process.
 *
 * Vitest runs from the package root, which is where `process.cwd()`
 * points; that anchors the resolution.
 *
 * Example: `loadFixture('paste-sources/word.html')`
 */
export function loadFixture(relativePath: string): string {
  const absolute = resolve(FIXTURE_DIR, relativePath);
  let content = cache.get(absolute);
  if (content === undefined) {
    content = readFileSync(absolute, 'utf8');
    cache.set(absolute, content);
  }
  return content;
}
