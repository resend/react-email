import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadEsbuildPlugins } from './load-esbuild-plugins';

describe('loadEsbuildPlugins()', () => {
  test('loads the array exported by a plugins module', async () => {
    const plugins = await loadEsbuildPlugins(
      path.resolve(__dirname, '../testing/esbuild-plugins.mjs'),
    );
    expect(plugins).toHaveLength(1);
    expect(plugins[0]?.name).toBe('replace-marker');
  });

  test('loads a TypeScript plugins module', async () => {
    const plugins = await loadEsbuildPlugins(
      path.resolve(__dirname, '../testing/esbuild-plugins.ts'),
    );
    expect(plugins.map((plugin) => plugin.name)).toEqual(['typed-plugin']);
  });

  test('rejects a module without an array of plugins', async () => {
    await expect(
      loadEsbuildPlugins(
        path.resolve(__dirname, '../testing/esbuild-plugins-invalid.mjs'),
      ),
    ).rejects.toThrow(/array of esbuild plugins/);
  });
});

describe('getUserEsbuildPlugins()', () => {
  let temporaryDirectory: string;
  let pluginsPath: string;

  beforeEach(async () => {
    temporaryDirectory = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'react-email-esbuild-plugins-'),
    );
    pluginsPath = path.join(temporaryDirectory, 'plugins.mjs');
    vi.stubEnv('REACT_EMAIL_INTERNAL_ESBUILD_PLUGINS_PATH', pluginsPath);
    vi.resetModules();
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await fs.promises.rm(temporaryDirectory, { recursive: true, force: true });
  });

  test('loads the plugins again once a broken module is fixed', async () => {
    const { getUserEsbuildPlugins } = await import('./load-esbuild-plugins');

    await fs.promises.writeFile(pluginsPath, 'export default {};', 'utf8');
    await expect(getUserEsbuildPlugins()).rejects.toThrow(
      /array of esbuild plugins/,
    );

    await fs.promises.writeFile(
      pluginsPath,
      "export default [{ name: 'fixed', setup() {} }];",
      'utf8',
    );
    const plugins = await getUserEsbuildPlugins();
    expect(plugins.map((plugin) => plugin.name)).toEqual(['fixed']);
  });
});
