import { join } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const publicDir = join(__dirname, '../../../assets/preview/public');

export default defineConfig({
  build: {
    rollupOptions: {
      input: join(__dirname, 'index.html')
    }
  },
  plugins: [react()],
  publicDir,
  root: __dirname
});
