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
