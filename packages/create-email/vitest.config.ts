import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: ['.test/**/*', 'template/**/*', '**/node_modules'],
  },
});
