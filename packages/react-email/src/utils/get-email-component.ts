/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'node:path';
import vm from 'node:vm';
import { type RawSourceMap } from 'source-map-js';
import { type OutputFile, build, type BuildFailure } from 'esbuild';
import type { EmailTemplate as EmailComponent } from './types/email-template';
import type { ErrorObject } from './types/error-object';
import { improveErrorWithSourceMap } from './improve-error-with-sourcemap';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';

export const getEmailComponent = async (
  emailPath: string,
): Promise<
  | {
      emailComponent: EmailComponent;

      sourceMapToOriginalFile: RawSourceMap;
    }
  | { error: ErrorObject }
> => {
  let outputFiles: OutputFile[];
  try {
    const buildData = await build({
      bundle: true,
      entryPoints: [emailPath],
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
    URL,
    module: { exports: { default: undefined as unknown } },
    __filanem: emailPath,
    __dirname: path.dirname(emailPath),
    require: (module: string) => {
      if (module in staticNodeModulesForVM) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return staticNodeModulesForVM[module];
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires
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
  try {
    vm.runInNewContext(builtEmailCode, fakeContext, { filename: emailPath });
  } catch (exception) {
    const error = exception as Error;

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
    sourceMapToOriginalFile: sourceMapToEmail,
  };
};
