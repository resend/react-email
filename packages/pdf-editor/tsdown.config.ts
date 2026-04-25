import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'react-email-compat': 'src/react-email-compat.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  deps: {
    neverBundle: [
      '@asym/pdf-template-schema',
      '@react-email/editor',
      '@react-email/editor/core',
      '@react-email/editor/extensions',
      '@react-email/editor/plugins',
      '@react-email/editor/ui',
      /^react($|\/)/,
      /^react-dom($|\/)/,
    ],
  },
});
