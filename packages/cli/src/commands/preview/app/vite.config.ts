import { join } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const publicDir = join(__dirname, '../../../assets/preview/public');

export default defineConfig({
  plugins: [react()],
  publicDir,
  root: __dirname
});
