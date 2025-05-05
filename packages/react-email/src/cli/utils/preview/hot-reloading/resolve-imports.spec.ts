import path from 'node:path';
import { resolveImports } from './resolve-imports';

test('resolveImports()', async () => {
  expect(
    resolveImports(
      ['@/some-file'],
      path.resolve(import.meta.dirname, './test'),
    ),
  ).toEqual(['./some-file']);
});
