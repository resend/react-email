import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  server: {
    watch: {
      ignored: [path.resolve(__dirname, './integrations/**/*')],
    },
  },
});
