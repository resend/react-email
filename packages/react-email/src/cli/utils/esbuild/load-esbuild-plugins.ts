import { pathToFileURL } from 'node:url';
import type { Plugin } from 'esbuild';
import { createJiti } from 'jiti';

type PluginsModuleExport = Plugin[] | (() => Plugin[] | Promise<Plugin[]>);

/**
 * Loads the esbuild plugins a user wants applied when their templates are
 * bundled. The module's default export is either an array of plugins or a
 * function returning one, so plugins that need setup can do it lazily.
 */
export const loadEsbuildPlugins = async (
  modulePath: string,
): Promise<Plugin[]> => {
  const jiti = createJiti(pathToFileURL(modulePath).href);
  const exported = await jiti.import<PluginsModuleExport>(modulePath, {
    default: true,
  });
  const plugins = typeof exported === 'function' ? await exported() : exported;
  if (!Array.isArray(plugins)) {
    throw new Error(
      `Expected the default export of ${modulePath} to be an array of esbuild plugins or a function returning one`,
    );
  }
  return plugins;
};
