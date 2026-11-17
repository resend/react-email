import { createRequire } from 'node:module';
import type { PluginBuild } from 'esbuild';

const require = createRequire(import.meta.url);

// css-tree stays out of the template bundles, which are written to --outDir
// and then required from there. A bare `css-tree` specifier only resolves
// when --outDir is inside the project, so this points the external import at
// the absolute path of the css-tree the template itself resolves.
export const externalCssTree = () => ({
  name: 'external-css-tree',
  setup(build: PluginBuild) {
    build.onResolve({ filter: /^css-tree($|\/)/ }, (args) => {
      try {
        return {
          path: require.resolve(args.path, { paths: [args.resolveDir] }),
          external: true,
        };
      } catch {
        return { path: args.path, external: true };
      }
    });
  },
});
