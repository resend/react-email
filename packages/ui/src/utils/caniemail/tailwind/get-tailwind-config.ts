import path from 'node:path';
import type { Node } from '@babel/traverse';
import traverse from '@babel/traverse';
import * as esbuild from 'esbuild';
import type { TailwindConfig } from 'react-email';
import type { RawSourceMap } from 'source-map-js';
import type { AST } from '../../../actions/email-validation/check-compatibility';
import { convertStackWithSourceMap } from '../../convert-stack-with-sourcemap';
import { inlineCssLoader } from '../../esbuild/inline-css-loader';
import { isErr } from '../../result';
import { runBundledCode } from '../../run-bundled-code';

export interface TailwindCSSConfigs {
  theme?: string;
  utility?: string;
}

export const getTailwindConfig = async (
  sourceCode: string,
  ast: AST,
  sourcePath: string,
): Promise<TailwindConfig> => {
  const { config: configAttribute } = getTailwindAttributes(ast);

  if (configAttribute) {
    const configExpressionValue =
      configAttribute.value?.type === 'JSXExpressionContainer'
        ? configAttribute.value.expression
        : undefined;
    if (configExpressionValue?.start && configExpressionValue.end) {
      let configSourceValue = sourceCode.slice(
        configExpressionValue.start,
        configExpressionValue.end,
      );

      if (configExpressionValue.type === 'Identifier') {
        const initSource = findVariableInitializer(
          ast,
          sourceCode,
          configExpressionValue.name,
        );

        if (initSource !== undefined) {
          configSourceValue = initSource;
        }
      }

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
    plugins: [inlineCssLoader()],
    platform: 'node',
    sourcemap: 'external',
    jsx: 'automatic',
    outdir: 'stdout', // just a stub for esbuild, it won't actually write to this folder
    write: false,
    format: 'esm',
    logLevel: 'silent',
  });
  const sourceMapFile = configBuildResult.outputFiles[0]!;
  const configFile = configBuildResult.outputFiles[1];
  if (configFile === undefined) {
    throw new Error(
      'Could not build config file as it was found as undefined, this is most likely a bug, please open an issue.',
    );
  }

  const configModule = await runBundledCode(configFile.text, filepath);
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

const findVariableInitializer = (
  ast: AST,
  sourceCode: string,
  name: string,
): string | undefined => {
  let initSource: string | undefined;

  traverse(ast, {
    JSXOpeningElement(nodePath) {
      if (
        nodePath.node.name.type === 'JSXIdentifier' &&
        nodePath.node.name.name === 'Tailwind'
      ) {
        const binding = nodePath.scope.getBinding(name);
        if (binding?.path.isVariableDeclarator()) {
          const { init } = binding.path.node;
          if (init?.start != null && init.end != null) {
            initSource = sourceCode.slice(init.start, init.end);
          }
        }
        nodePath.stop();
      }
    },
  });

  return initSource;
};

type JSXAttribute = Node & { type: 'JSXAttribute' };

interface TailwindAttributes {
  config?: JSXAttribute;
  theme?: JSXAttribute;
  utility?: JSXAttribute;
}

const RECOGNIZED_ATTRIBUTES = new Set(['config', 'theme', 'utility'] as const);

const getTailwindAttributes = (ast: AST): TailwindAttributes => {
  const result: TailwindAttributes = {};
  traverse(ast, {
    JSXOpeningElement(nodePath) {
      if (
        nodePath.node.name.type === 'JSXIdentifier' &&
        nodePath.node.name.name === 'Tailwind'
      ) {
        for (const attribute of nodePath.node.attributes) {
          if (
            attribute.type !== 'JSXAttribute' ||
            attribute.name.type !== 'JSXIdentifier'
          ) {
            continue;
          }
          const name = attribute.name.name;
          if (
            (RECOGNIZED_ATTRIBUTES as Set<string>).has(name) &&
            !result[name as keyof TailwindAttributes]
          ) {
            result[name as keyof TailwindAttributes] =
              attribute as JSXAttribute;
          }
        }
      }
    },
  });
  return result;
};

export const getTailwindCSSConfigs = async (
  sourceCode: string,
  ast: AST,
  sourcePath: string,
): Promise<TailwindCSSConfigs> => {
  const attrs = getTailwindAttributes(ast);
  if (!attrs.theme && !attrs.utility) {
    return {};
  }

  // Direct string-literal values (e.g. theme="@theme {...}") never need bundling.
  // Anything inside braces — variables, template literals, ?inline imports — does.
  const themeLiteral = stringAttributeLiteral(attrs.theme);
  const utilityLiteral = stringAttributeLiteral(attrs.utility);
  const themeExpr =
    themeLiteral === undefined
      ? expressionSource(attrs.theme, sourceCode)
      : undefined;
  const utilityExpr =
    utilityLiteral === undefined
      ? expressionSource(attrs.utility, sourceCode)
      : undefined;

  if (themeExpr === undefined && utilityExpr === undefined) {
    return {
      ...(themeLiteral !== undefined ? { theme: themeLiteral } : {}),
      ...(utilityLiteral !== undefined ? { utility: utilityLiteral } : {}),
    };
  }

  try {
    const resolved = await getStringsFromCode(
      `${sourceCode}

const reactEmailTailwindThemeInternal = ${themeExpr ?? 'undefined'};
const reactEmailTailwindUtilityInternal = ${utilityExpr ?? 'undefined'};`,
      sourcePath,
    );
    return {
      ...(themeLiteral !== undefined
        ? { theme: themeLiteral }
        : resolved.theme !== undefined
          ? { theme: resolved.theme }
          : {}),
      ...(utilityLiteral !== undefined
        ? { utility: utilityLiteral }
        : resolved.utility !== undefined
          ? { utility: resolved.utility }
          : {}),
    };
  } catch (exception) {
    console.warn(exception);
    console.warn(
      'Could not resolve the theme/utility props on <Tailwind>. The caniemail compatibility check will not see styles produced by these props.',
    );
    return themeLiteral !== undefined || utilityLiteral !== undefined
      ? {
          ...(themeLiteral !== undefined ? { theme: themeLiteral } : {}),
          ...(utilityLiteral !== undefined ? { utility: utilityLiteral } : {}),
        }
      : {};
  }
};

const stringAttributeLiteral = (
  attr: JSXAttribute | undefined,
): string | undefined => {
  if (!attr?.value) return undefined;
  // Bare attribute form: `theme="..."` — `value` is the StringLiteral itself.
  if (attr.value.type === 'StringLiteral') return attr.value.value;
  return undefined;
};

const expressionSource = (
  attr: JSXAttribute | undefined,
  sourceCode: string,
): string | undefined => {
  if (!attr?.value || attr.value.type !== 'JSXExpressionContainer') {
    return undefined;
  }
  const expr = attr.value.expression;
  if (expr.start == null || expr.end == null) return undefined;
  return sourceCode.slice(expr.start, expr.end);
};

const getStringsFromCode = async (
  code: string,
  filepath: string,
): Promise<{ theme?: string; utility?: string }> => {
  const dirpath = path.dirname(filepath);

  const buildResult = await esbuild.build({
    bundle: true,
    stdin: {
      contents: `${code}
export { reactEmailTailwindThemeInternal, reactEmailTailwindUtilityInternal };`,
      sourcefile: filepath,
      loader: 'tsx',
      resolveDir: dirpath,
    },
    plugins: [inlineCssLoader()],
    platform: 'node',
    sourcemap: 'external',
    jsx: 'automatic',
    outdir: 'stdout',
    write: false,
    format: 'esm',
    logLevel: 'silent',
  });
  const sourceMapFile = buildResult.outputFiles[0]!;
  const codeFile = buildResult.outputFiles[1];
  if (codeFile === undefined) {
    throw new Error(
      'Could not build the theme/utility resolution bundle; this is most likely a bug, please open an issue.',
    );
  }

  const moduleResult = await runBundledCode(codeFile.text, filepath);
  if (isErr(moduleResult)) {
    const sourceMap = JSON.parse(sourceMapFile.text) as RawSourceMap;
    sourceMap.sourceRoot = path.resolve(sourceMapFile.path, '../..');
    sourceMap.sources = sourceMap.sources.map((source) =>
      path.resolve(sourceMapFile.path, '..', source),
    );
    const error = moduleResult.error as Error;
    error.stack = convertStackWithSourceMap(error.stack, filepath, sourceMap);
    throw error;
  }

  const value = moduleResult.value as Record<string, unknown>;
  return {
    theme:
      typeof value.reactEmailTailwindThemeInternal === 'string'
        ? value.reactEmailTailwindThemeInternal
        : undefined,
    utility:
      typeof value.reactEmailTailwindUtilityInternal === 'string'
        ? value.reactEmailTailwindUtilityInternal
        : undefined,
  };
};
