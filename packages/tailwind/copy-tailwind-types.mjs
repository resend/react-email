import { promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

await fs.cp(
  path.resolve(__dirname, './node_modules/tailwindcss/types'),
  path.resolve(__dirname, './dist/tailwindcss'),
  {
    recursive: true,
  },
);
