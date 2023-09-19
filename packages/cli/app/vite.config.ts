import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.chdir(__dirname);

export default defineConfig({
  plugins: [react()],
  root: __dirname
});
