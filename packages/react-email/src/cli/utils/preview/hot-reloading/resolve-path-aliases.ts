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

  // `paths` patterns are always written with forward slashes, but the prefix may
  // have been normalized with the platform separator (backslashes on Windows) by
  // `path.normalize()`. Restore import specifier separators so patterns match.
  const importPrefix = prefix.replace(/\\/g, '/');

  const resolved = matchPath(importPrefix, undefined, isExistingDirectory, [
    '.tsx',
    '.ts',
    '.js',
    '.jsx',
    '.cjs',
    '.mjs',
  ]);
  return resolved ?? undefined;
};
