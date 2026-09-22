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

  test('rejects a module without an array of plugins', async () => {
    await expect(
      loadEsbuildPlugins(
        path.resolve(__dirname, '../testing/esbuild-plugins-invalid.mjs'),
      ),
    ).rejects.toThrow(/array of esbuild plugins/);
  });
});
