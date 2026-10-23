import path from 'node:path';
import {
  resolveAliasedDirectoryPrefix,
  resolvePathAliases,
} from './resolve-path-aliases.js';

test('resolveImports()', async () => {
  expect(
    resolvePathAliases(
      ['@/some-file'],
      path.resolve(import.meta.dirname, './test'),
    ),
  ).toEqual(['./some-file']);
});

test('resolveAliasedDirectoryPrefix() accepts platform-normalized separators', () => {
  const sourceDirectory = path.resolve(
    import.meta.dirname,
    './test/aliased-import-graph/src',
  );
  const localesDirectory = path.join(sourceDirectory, 'locales');

  expect(resolveAliasedDirectoryPrefix('@/locales', sourceDirectory)).toEqual(
    localesDirectory,
  );

  // On Windows, `path.normalize()` turns the specifier's forward slashes into
  // backslashes before the prefix reaches this function.
  expect(resolveAliasedDirectoryPrefix('@\\locales', sourceDirectory)).toEqual(
    localesDirectory,
  );
});
