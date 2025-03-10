import path from 'node:path';
import { type BuildFailure, type OutputFile, build } from 'esbuild';
import type { RawSourceMap } from 'source-map-js';
import { renderingUtilitiesExporter } from './esbuild/renderring-utilities-exporter';
import { type Result, err, ok } from './result';
import type { ErrorObject } from './types/error-object';

export const buildEmailIntoRunnableCode = async (
  emailPath: string,
): Promise<
  Result<{ runnableCode: string; sourceMap: RawSourceMap }, ErrorObject>
> => {
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
    return err({
      name: buildFailure.name,
      message: buildFailure.message,
      stack: buildFailure.stack,
      cause: buildFailure.cause,
    });
  }

  const sourceMapFile = outputFiles[0]!;
  const bundledEmailFile = outputFiles[1]!;

  const builtEmailCode = bundledEmailFile.text;

  const sourceMapText = sourceMapFile.text;
  const sourceMapPath = sourceMapFile.path;

  const sourceMapToEmail = JSON.parse(sourceMapText) as RawSourceMap;
  // because itawill have a path like <tsconfigLocation>/stdout/email.js.map
  sourceMapToEmail.sourceRoot = path.resolve(sourceMapPath, '../..');
  sourceMapToEmail.sources = sourceMapToEmail.sources.map((source) =>
    path.resolve(sourceMapPath, '..', source),
  );

  return ok({
    runnableCode: builtEmailCode,
    sourceMap: sourceMapToEmail,
  });
};
