import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@asym/pdf-renderer': resolve(currentDirectory, 'src/index.ts'),
      '@asym/pdf-template-schema': resolve(
        currentDirectory,
        '../pdf-template-schema/src/index.ts',
      ),
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
});
