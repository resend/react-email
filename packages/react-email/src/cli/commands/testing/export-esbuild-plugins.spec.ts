import { spawnSync } from 'node:child_process';
import path from 'node:path';

test('email export reports a plugins module that fails to load', {
  timeout: 30_000,
}, () => {
  const cli = path.resolve(__dirname, '../../index.ts');
  const result = spawnSync(
    'pnpm',
    [
      'tsx',
      cli,
      'export',
      '--dir',
      path.resolve(__dirname, './emails'),
      '--outDir',
      path.resolve(__dirname, './out-esbuild-plugins'),
      '--esbuild-plugins',
      './does-not-exist.mjs',
    ],
    { cwd: __dirname, encoding: 'utf8' },
  );

  expect(result.status).toBe(1);
  expect(result.stderr + result.stdout).toContain('Failed to build emails');
  expect(result.stderr).toContain('does-not-exist.mjs');
});
