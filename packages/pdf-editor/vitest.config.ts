import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@asym/pdf-editor': resolve(currentDirectory, 'src/index.ts'),
      '@asym/pdf-editor/react-email-compat': resolve(
        currentDirectory,
        'src/react-email-compat.ts',
      ),
      '@asym/pdf-template-schema': resolve(
        currentDirectory,
        '../pdf-template-schema/src/index.ts',
      ),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
