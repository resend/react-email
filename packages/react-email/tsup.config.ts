import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsup';
import { adjustPackageIndex } from './scripts/adjust-package-index';

const componentDirectories = fs
  .readdirSync('./src/package', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.join(dirent.parentPath, dirent.name));

const componentEntries: Record<string, string> = {};

for (const componentDirectory of componentDirectories) {
  const componentName = path.basename(componentDirectory);
  if (componentName === 'render') {
    componentEntries[`${componentName}.browser`] = path.resolve(
      componentDirectory,
      'browser/index.ts',
    );
    componentEntries[`${componentName}.node`] = path.resolve(
      componentDirectory,
      'node/index.ts',
    );
  } else {
    componentEntries[componentName] = path.resolve(
      componentDirectory,
      'index.ts',
    );
  }
}

export default defineConfig([
  {
    dts: false,
    entry: ['./src/cli/index.ts'],
    format: ['cjs'],
    outDir: 'dist/cli',
  },
  {
    dts: true,
    entry: componentEntries,
    tsconfig: './src/package/tsconfig.json',
    treeshake: true,
    noExternal: [
      /patched-tailwindcss\/.*/,
      /patched-postcss\/.*/,
      /postcss\/.*/,
      'dlv',
      'didyoumean',
      '@alloc/quick-lru',
      'patched-postcss-selector-parser',
      'postcss-selector-parser',
      'postcss-js',
      'postcss-nested',
      'cssesc',
      'camelcase-css',
    ],
    format: ['cjs', 'esm'],
    outDir: `dist`,
  },
  {
    dts: true,
    tsconfig: './src/package/tsconfig.json',
    entry: ['./src/package/index.browser.ts', './src/package/index.node.ts'],
    onSuccess: async () => {
      await adjustPackageIndex();
    },
    bundle: false,
    format: ['cjs', 'esm'],
    outDir: 'dist',
  },
]);
