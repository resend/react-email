import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@asym/pdf-editor/react-email-compat',
        replacement: resolve(currentDirectory, 'src/react-email-compat.ts'),
      },
      {
        find: '@asym/pdf-editor',
        replacement: resolve(currentDirectory, 'src/index.ts'),
      },
      {
        find: '@asym/pdf-template-schema',
        replacement: resolve(
          currentDirectory,
          '../pdf-template-schema/src/index.ts',
        ),
      },
    ],
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
