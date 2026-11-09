import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import type { Plugin } from 'esbuild';
import { createJiti } from 'jiti';
import { esbuildPluginsPath } from '../../app/env';

type PluginsModuleExport = Plugin[] | (() => Plugin[] | Promise<Plugin[]>);

/**
 * Loads the esbuild plugins a user wants applied when their templates are
 * bundled. The module's default export is either an array of plugins or a
 * function returning one, so plugins that need setup can do it lazily.
 */
export const loadEsbuildPlugins = async (
  modulePath: string,
): Promise<Plugin[]> => {
  // jiti rather than `import()` so a TypeScript plugins module loads on every
  // supported Node version, the same way the CLI's `export` loads it.
  const jiti = createJiti(pathToFileURL(modulePath).href, {
    moduleCache: false,
  });
  // Evaluating the source instead of `jiti.import()`, which hands `.mjs` and
  // `.cjs` to Node's own loaders: their caches never evict, so a retry after
  // a failed load would get the broken module back.
  const evaluated = (await jiti.evalModule(
    await fs.promises.readFile(modulePath, 'utf8'),
    { filename: modulePath, async: true, forceTranspile: true },
  )) as { default?: PluginsModuleExport } | PluginsModuleExport;
  const exported =
    evaluated && 'default' in evaluated ? evaluated.default : evaluated;
  const plugins = typeof exported === 'function' ? await exported() : exported;
  if (!Array.isArray(plugins)) {
    throw new Error(
      `Expected the default export of ${modulePath} to be an array of esbuild plugins or a function returning one`,
    );
  }
  return plugins;
};

let userPluginsPromise: Promise<Plugin[]> | undefined;

/**
 * The plugins configured through the CLI's `--esbuild-plugins` option, loaded
 * once per process. Resolves to an empty array when the option is not set.
 */
export const getUserEsbuildPlugins = (): Promise<Plugin[]> => {
  if (!esbuildPluginsPath) return Promise.resolve([]);
  userPluginsPromise ??= loadEsbuildPlugins(esbuildPluginsPath).catch(
    (exception: unknown) => {
      // Only a successful load is kept, so fixing the plugins module takes
      // effect on the next render without restarting the preview server.
      userPluginsPromise = undefined;
      throw exception;
    },
  );
  return userPluginsPromise;
};
