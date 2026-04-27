import { statSync } from 'node:fs';
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

const isExistingDirectory = (candidate: string): boolean => {
  try {
    return statSync(candidate).isDirectory();
  } catch (_) {
    return false;
  }
};

/**
 * Resolves a tsconfig path alias prefix (e.g. `@/messages/`) to an absolute
 * directory on disk. Unlike {@link resolvePathAliases}, this does not require
 * the target to exist as a real file — it's meant for dynamic-import glob
 * prefixes that point at a directory containing runtime-resolved files.
 *
 * When an alias maps to multiple candidate replacements (e.g.
 * `"@/*": ["src/*", "lib/*"]`), the existence check below lets `matchPath`
 * fall through to the first candidate that actually exists as a directory.
 * Passing a blanket `() => true` would short-circuit on the first candidate
 * regardless of whether it exists.
 *
 * Returns `undefined` when the prefix isn't an alias defined in the closest
 * tsconfig (i.e. it's a true bare module specifier) or none of the candidates
 * resolve to an existing directory.
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
  const resolved = matchPath(prefix, undefined, isExistingDirectory, [
    '.tsx',
    '.ts',
    '.js',
    '.jsx',
    '.cjs',
    '.mjs',
  ]);
  return resolved ?? undefined;
};
