import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

const src = 'src';
const dist = 'dist';

const themeProcessor = postcss([postcssImport()]);

async function processTheme(full: string, dest: string) {
  const css = readFileSync(full, 'utf8');
  const result = await themeProcessor.process(css, { from: full, to: dest });
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, result.css);
  console.log(`processed ${relative(src, full)}`);
}

async function main() {
  const themeFiles: { full: string; dest: string }[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.css')) {
        const rel = relative(src, full).split(sep).join('/');
        const dest = join(dist, rel);
        if (rel.startsWith('ui/themes/')) {
          themeFiles.push({ full, dest });
        } else {
          cpSync(full, dest, { recursive: true });
          console.log(`copied ${rel}`);
        }
      }
    }
  }

  walk(src);

  for (const { full, dest } of themeFiles) {
    await processTheme(full, dest);
  }
}

main();
