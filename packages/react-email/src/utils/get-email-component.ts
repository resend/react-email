import fs from 'node:fs';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'node:path';
import vm from 'node:vm';
import type { render } from '@react-email/render';
import { type BuildFailure, type OutputFile, build } from 'esbuild';
import type React from 'react';
import type { RawSourceMap } from 'source-map-js';
import { renderingUtilitiesExporter } from './esbuild/renderring-utilities-exporter';
import { improveErrorWithSourceMap } from './improve-error-with-sourcemap';
import { staticNodeModulesForVM } from './static-node-modules-for-vm';
import type { EmailTemplate as EmailComponent } from './types/email-template';
import type { ErrorObject } from './types/error-object';

export type GetEmailComponentResult =
  | {
      fileContents: string;
      emailComponent: EmailComponent;
      createElement: typeof React.createElement;
      render: typeof render;
      sourceMapToOriginalFile: RawSourceMap;
    }
  | { error: ErrorObject };

export const getEmailComponent = async (
  emailPath: string,
): Promise<GetEmailComponentResult> => {
  let outputFiles: OutputFile[];
  try {
    const buildData = await build({
      bundle: true,
      entryPoints: [emailPath],
      plugins: [renderingUtilitiesExporter([emailPath])],
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
    AbortSignal,
    Event,
    EventTarget,
    TextDecoder,
    Request,
    Response,
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
        render: undefined as unknown,
        reactEmailCreateReactElement: undefined as unknown,
      },
    },
    __filename: emailPath,
    __dirname: path.dirname(emailPath),
    require: (specifiedModule: string) => {
      let m = specifiedModule;
      if (specifiedModule.startsWith('node:')) {
        m = m.split(':')[1]!;
      }

      if (m in staticNodeModulesForVM) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return staticNodeModulesForVM[m];
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-useless-template-literals
      return require(`${specifiedModule}`) as unknown;
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

  const fileContents = await fs.promises.readFile(emailPath, 'utf-8');

  return {
    fileContents,

    emailComponent: fakeContext.module.exports.default as EmailComponent,
    render: fakeContext.module.exports.render as typeof render,
    createElement: fakeContext.module.exports
      .reactEmailCreateReactElement as typeof React.createElement,

    sourceMapToOriginalFile: sourceMapToEmail,
  };
};
