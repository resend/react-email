import { cpSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const src = 'src';
const dist = 'dist';

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry.endsWith('.css')) {
      const rel = relative(src, full);
      const dest = join(dist, rel);
      cpSync(full, dest, { recursive: true });
      console.log(`copied ${rel}`);
    }
  }
}

walk(src);
