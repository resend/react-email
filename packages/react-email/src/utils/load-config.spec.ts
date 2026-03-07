import path from 'node:path';
import { loadReactEmailConfig } from './load-config.js';

const fixturesRoot = path.resolve(__dirname, '__fixtures__');

test('loadReactEmailConfig returns undefined when no config file exists', async () => {
  const dir = path.join(fixturesRoot, 'no-config');
  const config = await loadReactEmailConfig(dir);

  expect(config).toBeUndefined();
});

test('loadReactEmailConfig reads JSON config', async () => {
  const dir = path.join(fixturesRoot, 'config-json');
  const config = await loadReactEmailConfig(dir);

  expect(config).toEqual({
    emailsDir: './src/emails',
    preview: {
      port: 4000,
    },
  });
});

test('loadReactEmailConfig reads ESM config with default export', async () => {
  const dir = path.join(fixturesRoot, 'config-mjs');
  const config = await loadReactEmailConfig(dir);

  expect(config).toEqual({
    emailsDir: './emails-from-esm',
    preview: {
      port: 3100,
    },
  });
});

test('loadReactEmailConfig reads CJS config exporting an object', async () => {
  const dir = path.join(fixturesRoot, 'config-cjs');
  const config = await loadReactEmailConfig(dir);

  expect(config).toEqual({
    emailsDir: './emails-from-cjs',
    preview: {
      port: 4200,
    },
  });
});

test('loadReactEmailConfig reads .js config with default export (ESM)', async () => {
  const dir = path.join(fixturesRoot, 'config-js');
  const config = await loadReactEmailConfig(dir);

  expect(config).toEqual({
    emailsDir: './emails-from-js',
    preview: {
      port: 3500,
    },
  });
});
