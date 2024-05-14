/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'node:path';
import vm from 'node:vm';
import fs from 'node:fs/promises';
import { type RawSourceMap } from 'source-map-js';
import {
  type OutputFile,
  build,
  type ResolveOptions,
  type BuildFailure,
  type Loader,
} from 'esbuild';
import type { renderAsync } from '@react-email/render';
import type { EmailTemplate as EmailComponent } from './types/email-template';
import type { ErrorObject } from './types/error-object';
import { improveErrorWithSourceMap } from './improve-error-with-sourcemap';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';

export const getEmailComponent = async (
  emailPath: string,
): Promise<
  | {
      emailComponent: EmailComponent;

      renderAsync: typeof renderAsync;

      sourceMapToOriginalFile: RawSourceMap;
    }
  | { error: ErrorObject }
> => {
  let outputFiles: OutputFile[];
  try {
    const buildData = await build({
      bundle: true,
      entryPoints: [emailPath],
      plugins: [
        {
          name: 'add-export-for-render-async',
          setup(b) {
            b.onLoad(
              { filter: new RegExp(path.basename(emailPath)) },
              async () => ({
                contents: `${await fs.readFile(emailPath, 'utf8')};
                  export { renderAsync } from 'react-email-module-that-will-export-render'
                `,
                loader: path.extname(emailPath).slice(1) as Loader,
              }),
            );

            b.onResolve(
              { filter: /^react-email-module-that-will-export-render$/ },
              async (args) => {
                const options: ResolveOptions = {
                  kind: 'import-statement',
                  importer: args.importer,
                  resolveDir: args.resolveDir,
                  namespace: args.namespace,
                };
                let result = await b.resolve('@react-email/render', options);
                if (result.errors.length === 0) {
                  return result;
                }

                // If @react-email/render does not exist, resolve to @react-email/components
                result = await b.resolve('@react-email/components', options);
                if (result.errors.length > 0) {
                  result.errors[0]!.text =
                    "Failed trying to import `renderAsync` from either `@react-email/render` or `@react-email/components` to be able to render your email template.\n Maybe you don't have either of them installed?";
                }
                return result;
              },
            );
          },
        },
      ],
      platform: 'node',
      write: false,

      format: 'cjs',
      jsx: 'automatic',
      logLevel: 'silent',
      // allows for using jsx on a .js file
      loader: {
        '.js': 'jsx',
      },
      outdir: 'stdout', // just a stub for esbuild, it won't actually write to this folder
      sourcemap: 'external',
    });
    outputFiles = buildData.outputFiles;
  } catch (exception) {
    const buildFailure = exception as BuildFailure;
    return {
      error: {
        message: buildFailure.message,
        stack: buildFailure.stack,
        name: buildFailure.name,
        cause: buildFailure.cause,
      },
    };
  }

  const sourceMapFile = outputFiles[0]!;
  const bundledEmailFile = outputFiles[1]!;
  const builtEmailCode = bundledEmailFile.text;

  const fakeContext = {
    ...global,
    console,
    Buffer,
    TextDecoder,
    TextDecoderStream,
    TextEncoder,
    TextEncoderStream,
    ReadableStream,
    URL,
    URLSearchParams,
    Headers,
    module: {
      exports: {
        default: undefined as unknown,
        renderAsync: undefined as unknown,
      },
    },
    __filename: emailPath,
    __dirname: path.dirname(emailPath),
    require: (module: string) => {
      if (module in staticNodeModulesForVM) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return staticNodeModulesForVM[module];
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-useless-template-literals
      return require(`${module}`) as unknown;
      // this stupid string templating was necessary to not have
      // webpack warnings like:
      //
      // Import trace for requested module:
      // ./src/utils/get-email-component.tsx
      // ./src/app/page.tsx
      //  ⚠ ./src/utils/get-email-component.tsx
      // Critical dependency: the request of a dependency is an expression
    },
    process,
  };
  const sourceMapToEmail = JSON.parse(sourceMapFile.text) as RawSourceMap;
  // because it will have a path like <tsconfigLocation>/stdout/email.js.map
  sourceMapToEmail.sourceRoot = path.resolve(sourceMapFile.path, '../..');
  sourceMapToEmail.sources = sourceMapToEmail.sources.map((source) =>
    path.resolve(sourceMapFile.path, '..', source),
  );
  try {
    vm.runInNewContext(builtEmailCode, fakeContext, { filename: emailPath });
  } catch (exception) {
    const error = exception as Error;

    error.stack &&= error.stack.split('at Script.runInContext (node:vm')[0];

    return {
      error: improveErrorWithSourceMap(error, emailPath, sourceMapToEmail),
    };
  }

  if (fakeContext.module.exports.default === undefined) {
    return {
      error: improveErrorWithSourceMap(
        new Error(
          `The email component at ${emailPath} does not contain a default export`,
        ),
        emailPath,
        sourceMapToEmail,
      ),
    };
  }

  return {
    emailComponent: fakeContext.module.exports.default as EmailComponent,
    renderAsync: fakeContext.module.exports.renderAsync as typeof renderAsync,

    sourceMapToOriginalFile: sourceMapToEmail,
  };
};
