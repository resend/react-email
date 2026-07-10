import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { PluginBuild } from 'esbuild';

// Mirrors Vite's `?inline` / `?raw` suffix: returns the file's raw text as the default export.
// Lets `import theme from './theme.css?inline'` work in the preview, export, and caniemail pipelines.
export const inlineCssLoader = () => ({
  name: 'inline-css-loader',
  setup(build: PluginBuild) {
    const namespace = 'inline-css';

    build.onResolve({ filter: /\?(inline|raw)(&|$)/ }, (args) => {
      const [pathWithoutSuffix] = args.path.split('?');
      if (!pathWithoutSuffix) return null;
      const resolved = path.isAbsolute(pathWithoutSuffix)
        ? pathWithoutSuffix
        : path.resolve(args.resolveDir, pathWithoutSuffix);
      return { path: resolved, namespace };
    });

    build.onLoad({ filter: /.*/, namespace }, async (args) => {
      const contents = await fs.readFile(args.path, 'utf8');
      return {
        contents: `export default ${JSON.stringify(contents)};`,
        loader: 'js',
        watchFiles: [args.path],
      };
    });
  },
});
