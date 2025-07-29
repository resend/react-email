import path from 'node:path';
import type { Node } from '@babel/traverse';
import traverse from '@babel/traverse';
import * as esbuild from 'esbuild';
import type { RawSourceMap } from 'source-map-js';
import type { Config as TailwindOriginalConfig } from 'tailwindcss';
import type { AST } from '../../../actions/email-validation/check-compatibility';
import { convertStackWithSourceMap } from '../../convert-stack-with-sourcemap';
import { isErr } from '../../result';
import { runBundledCode } from '../../run-bundled-code';

export type TailwindConfig = Pick<
  TailwindOriginalConfig,
  | 'important'
  | 'prefix'
  | 'separator'
  | 'safelist'
  | 'blocklist'
  | 'presets'
  | 'future'
  | 'experimental'
  | 'darkMode'
  | 'theme'
  | 'corePlugins'
  | 'plugins'
>;

export const getTailwindConfig = async (
  sourceCode: string,
  ast: AST,
  sourcePath: string,
): Promise<TailwindConfig> => {
  const configAttribute = getTailwindConfigNode(ast);

  if (configAttribute) {
    const configExpressionValue =
      configAttribute.value?.type === 'JSXExpressionContainer'
        ? configAttribute.value.expression
        : undefined;
    if (configExpressionValue?.start && configExpressionValue.end) {
      const configSourceValue = sourceCode.slice(
        configExpressionValue.start,
        configExpressionValue.end,
      );

      try {
        return getConfigFromCode(
          `${sourceCode}

const reactEmailTailwindConfigInternal = ${configSourceValue};`,
          sourcePath,
        );
      } catch (exception) {
        console.warn(exception);
        console.warn(
          `Tried reading the config defined directly in the Tailwind component but was unable to, probably because it can't run by itself.`,
        );
      }
    }
  }

  return {};
};

const getConfigFromCode = async (
  code: string,
  filepath: string,
): Promise<TailwindConfig> => {
  const configDirpath = path.dirname(filepath);

  const configBuildResult = await esbuild.build({
    bundle: true,
    stdin: {
      contents: `${code} 
export { reactEmailTailwindConfigInternal };`,
      sourcefile: filepath,
      loader: 'tsx',
      resolveDir: configDirpath,
    },
    platform: 'node',
    sourcemap: 'external',
    jsx: 'automatic',
    outdir: 'stdout', // just a stub for esbuild, it won't actually write to this folder
    write: false,
    format: 'cjs',
    logLevel: 'silent',
  });
  const sourceMapFile = configBuildResult.outputFiles[0]!;
  const configFile = configBuildResult.outputFiles[1];
  if (configFile === undefined) {
    throw new Error(
      'Could not build config file as it was found as undefined, this is most likely a bug, please open an issue.',
    );
  }

  const configModule = runBundledCode(configFile.text, filepath);
  if (isErr(configModule)) {
    const sourceMap = JSON.parse(sourceMapFile.text) as RawSourceMap;
    // because it will have a path like <tsconfigLocation>/stdout/email.js.map
    sourceMap.sourceRoot = path.resolve(sourceMapFile.path, '../..');
    sourceMap.sources = sourceMap.sources.map((source) =>
      path.resolve(sourceMapFile.path, '..', source),
    );

    const error = configModule.error as Error;
    error.stack = convertStackWithSourceMap(error.stack, filepath, sourceMap);
    throw error;
  }

  if (
    typeof configModule.value === 'object' &&
    configModule.value !== null &&
    'reactEmailTailwindConfigInternal' in configModule.value
  ) {
    return configModule.value
      .reactEmailTailwindConfigInternal as TailwindConfig;
  }

  throw new Error(
    'Could not get the Tailwind config, this is likely a bug, please file an issue.',
    {
      cause: {
        configModule,
        configFilepath: filepath,
      },
    },
  );
};

type JSXAttribute = Node & { type: 'JSXAttribute' };

const getTailwindConfigNode = (ast: AST) => {
  let tailwindConfigNode: JSXAttribute | undefined;
  traverse(ast, {
    JSXOpeningElement(nodePath) {
      if (
        nodePath.node.name.type === 'JSXIdentifier' &&
        nodePath.node.name.name === 'Tailwind'
      ) {
        const configAttribute = nodePath.node.attributes.find(
          (
            attribute,
          ): attribute is Node & {
            type: 'JSXAttribute';
          } =>
            attribute.type === 'JSXAttribute' &&
            attribute.name.type === 'JSXIdentifier' &&
            attribute.name.name === 'config',
        );
        if (configAttribute) {
          tailwindConfigNode = configAttribute;
        }
      }
    },
  });
  return tailwindConfigNode;
};
