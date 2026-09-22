import { pathToFileURL } from 'node:url';
import type { Plugin } from 'esbuild';
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
  const imported = (await import(
    /* webpackIgnore: true */ /* turbopackIgnore: true */
    pathToFileURL(modulePath).href
  )) as { default?: PluginsModuleExport };
  const exported = imported.default;
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
  userPluginsPromise ??= loadEsbuildPlugins(esbuildPluginsPath);
  return userPluginsPromise;
};
