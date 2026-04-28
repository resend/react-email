import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

/**
 * Stub for `@react-email/render` in the browser test environment.
 * The render package depends on Node-only modules (`prettier`) that
 * Vite cannot resolve in the browser. Only the render package is
 * stubbed — components are resolved from the real `react-email` source.
 */
const renderStub = resolve(__dirname, 'src/__tests__/stub-module.ts');

export default defineConfig({
  plugins: [react({})],
  optimizeDeps: {
    include: [
      '@floating-ui/react-dom',
      '@radix-ui/react-popover',
      '@radix-ui/react-slot',
      '@tiptap/core',
      '@tiptap/extension-blockquote',
      '@tiptap/extension-bold',
      '@tiptap/extension-bullet-list',
      '@tiptap/extension-code',
      '@tiptap/extension-code-block',
      '@tiptap/extension-hard-break',
      '@tiptap/extension-heading',
      '@tiptap/extension-horizontal-rule',
      '@tiptap/extension-italic',
      '@tiptap/extension-link',
      '@tiptap/extension-list-item',
      '@tiptap/extension-ordered-list',
      '@tiptap/extension-paragraph',
      '@tiptap/extension-placeholder',
      '@tiptap/extension-strike',
      '@tiptap/extension-superscript',
      '@tiptap/extension-text',
      '@tiptap/extension-underline',
      '@tiptap/extensions',
      '@tiptap/html',
      '@tiptap/pm/state',
      '@tiptap/pm/view',
      '@tiptap/react',
      '@tiptap/react/menus',
      '@tiptap/starter-kit',
      '@tiptap/suggestion',
      'hast-util-from-html',
      'prismjs',
      'react',
      'react-dom',
      'react-dom/client',
      'vitest-browser-react',
    ],
    noDiscovery: true,
  },
  resolve: {
    alias: {
      '@react-email/render': renderStub,
      'use-sync-external-store/shim/index.js': resolve(
        __dirname,
        'src/__tests__/use-sync-external-store.ts',
      ),
      'use-sync-external-store/shim/with-selector.js': resolve(
        __dirname,
        'src/__tests__/use-sync-external-store-with-selector.ts',
      ),
    },
  },
  test: {
    globals: true,
    name: 'browser',
    include: ['src/**/*.browser.spec.tsx'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: true,
    },
  },
});
