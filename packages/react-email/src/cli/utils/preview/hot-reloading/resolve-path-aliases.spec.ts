import path from 'node:path';
import { resolvePathAliases } from './resolve-path-aliases.js';

test('resolveImports()', async () => {
  expect(
    resolvePathAliases(
      ['@/some-file'],
      path.resolve(import.meta.dirname, './test'),
    ),
  ).toEqual(['./some-file']);
});
