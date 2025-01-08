import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: [
      'node_modules',
      './src/package/tailwind/integrations/nextjs',
      './src/package/tailwind/integrations/vite',
    ],
  },
  server: {
    watch: {
      ignored: [
        path.resolve(__dirname, './src/package/tailwind/integrations/**/*'),
      ],
    },
  },
});
