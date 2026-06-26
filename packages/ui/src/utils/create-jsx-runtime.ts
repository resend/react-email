import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';

let jsxRuntimePromiseCache: Promise<string> | undefined;

/**
 * Bundles the JSX runtime with the specified {@link cwd}. This is needed because the JSX runtime
 * imports React's which is forcefully the production one if the `NODE_ENV` is set to `production`,
 * even though we want to use the development one.
 *
 * It bundles into `/node_modules/.react-email-jsx-runtime` with the root being the {@link cwd}.
 */
export const createJsxRuntime = (
  cwd: string,
  originalJsxRuntimePath: string,
): Promise<string> => {
  if (!jsxRuntimePromiseCache) {
    jsxRuntimePromiseCache = (async () => {
      const jsxRuntimePath = path.join(
        cwd,
        'node_modules',
        '.react-email-jsx-runtime',
      );
      if (!fs.existsSync(jsxRuntimePath)) {
        await fs.promises.mkdir(jsxRuntimePath, {
          recursive: true,
        });
        await fs.promises.writeFile(
          path.join(jsxRuntimePath, 'package.json'),
          '{"type": "commonjs"}',
          'utf8',
        );
      }
      // `next build` prerenders pages across multiple worker processes, each building this
      // shared `jsx-dev-runtime.js` (the promise cache only dedupes within a process). An
      // in-place write isn't atomic, so a process can read a half-written runtime whose `jsxDEV`
      // is `undefined`, throwing `(void 0) is not a function`. Write to a temp file and rename
      // it into place atomically instead.
      const finalRuntimeFilePath = path.join(
        jsxRuntimePath,
        'jsx-dev-runtime.js',
      );
      const temporaryRuntimeFilePath = `${finalRuntimeFilePath}.${Math.random()
        .toString(36)
        .slice(2)}.tmp`;
      await esbuild.build({
        bundle: true,
        outfile: temporaryRuntimeFilePath,
        format: 'cjs',
        logLevel: 'silent',
        stdin: {
          resolveDir: cwd,
          sourcefile: 'jsx-dev-runtime.js',
          loader: 'js',
          contents: await fs.promises.readFile(
            path.join(originalJsxRuntimePath, 'jsx-dev-runtime.js'),
          ),
        },
      });
      await fs.promises.rename(temporaryRuntimeFilePath, finalRuntimeFilePath);

      return jsxRuntimePath;
    })();
  }

  return jsxRuntimePromiseCache!;
};
