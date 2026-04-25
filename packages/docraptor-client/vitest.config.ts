import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@asym/docraptor-client': resolve(currentDirectory, 'src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
