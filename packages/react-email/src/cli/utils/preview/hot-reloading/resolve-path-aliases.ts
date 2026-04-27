import path from 'node:path';
import { createMatchPath, loadConfig } from 'tsconfig-paths';

export const resolvePathAliases = (
  importPaths: string[],
  projectPath: string,
) => {
  const configLoadResult = loadConfig(projectPath);

  if (configLoadResult.resultType === 'success') {
    const matchPath = createMatchPath(
      configLoadResult.absoluteBaseUrl,
      configLoadResult.paths,
    );
    return importPaths.map((importedPath) => {
      const unaliasedPath = matchPath(importedPath, undefined, undefined, [
        '.tsx',
        '.ts',
        '.js',
        '.jsx',
        '.cjs',
        '.mjs',
      ]);
      if (unaliasedPath) {
        return `./${path.relative(projectPath, unaliasedPath)}`;
      }
      return importedPath;
    });
  }

  return importPaths;
};

/**
 * Resolves a tsconfig path alias prefix (e.g. `@/messages/`) to an absolute
 * directory on disk. Unlike {@link resolvePathAliases}, this does not require
 * the target to exist as a real file — it's meant for dynamic-import glob
 * prefixes that point at a directory containing runtime-resolved files.
 *
 * Returns `undefined` when the prefix isn't an alias defined in the closest
 * tsconfig (i.e. it's a true bare module specifier).
 */
export const resolveAliasedDirectoryPrefix = (
  prefix: string,
  projectPath: string,
): string | undefined => {
  const configLoadResult = loadConfig(projectPath);
  if (configLoadResult.resultType !== 'success') return undefined;

  const matchPath = createMatchPath(
    configLoadResult.absoluteBaseUrl,
    configLoadResult.paths,
  );
  // Pass `() => true` so matchPath resolves directories (which don't have a
  // file extension to probe).
  const resolved = matchPath(prefix, undefined, () => true, [
    '.tsx',
    '.ts',
    '.js',
    '.jsx',
    '.cjs',
    '.mjs',
  ]);
  return resolved ?? undefined;
};
