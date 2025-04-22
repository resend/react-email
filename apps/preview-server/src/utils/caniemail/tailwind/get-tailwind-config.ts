import fs from 'node:fs';
import path from 'node:path';
import traverse from '@babel/traverse';
import type { Node } from '@babel/traverse';
import * as esbuild from 'esbuild';
import type { Config as TailwindOriginalConfig } from 'tailwindcss';
import type { AST } from '../../../actions/email-validation/check-compatibility';
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

const getFirstExistingFilepath = (filePaths: string[]) => {
  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
};

type ImportDeclaration = Node & { type: 'ImportDeclaration' };

export const getTailwindConfig = async (
  sourceCode: string,
  ast: AST,
  sourcePath: string,
): Promise<TailwindConfig> => {
  const configAttribute = getTailwindConfigNode(ast);

  if (configAttribute) {
    const configIdentifierName =
      configAttribute.value?.type === 'JSXExpressionContainer' &&
      configAttribute.value.expression.type === 'Identifier'
        ? configAttribute.value.expression.name
        : undefined;
    if (configIdentifierName) {
      const tailwindConfigImport = getImportWithGivenDefaultSpecifier(
        ast,
        configIdentifierName,
      );
      if (tailwindConfigImport) {
        return getConfigFromImport(tailwindConfigImport, sourcePath);
      }
    }

    const configObjectExpression =
      configAttribute.value?.type === 'JSXExpressionContainer' &&
      configAttribute.value.expression.type === 'ObjectExpression'
        ? configAttribute.value.expression
        : undefined;
    if (configObjectExpression?.start && configObjectExpression.end) {
      const configObjectSourceCode = sourceCode.slice(
        configObjectExpression.start,
        configObjectExpression.end,
      );

      try {
        const getConfig = new Function(`return ${configObjectSourceCode}`);
        return getConfig() as TailwindConfig;
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

const getConfigFromImport = async (
  tailwindConfigImport: ImportDeclaration,
  sourcePath: string,
): Promise<TailwindConfig> => {
  const configRelativePath = tailwindConfigImport.source.value;
  const sourceDirpath = path.dirname(sourcePath);
  const configFilepath = path.join(sourceDirpath, configRelativePath);

  const configBuildResult = await esbuild.build({
    bundle: true,
    stdin: {
      contents: `import tailwindConfig from "${configRelativePath}"; 
export { tailwindConfig };`,
      loader: 'tsx',
      resolveDir: path.dirname(sourcePath),
    },
    platform: 'node',
    write: false,
    format: 'cjs',
    logLevel: 'silent',
  });
  const configFile = configBuildResult.outputFiles[0];
  if (configFile === undefined) {
    throw new Error(
      'Could not build config file as it was found as undefined, this is most likely a bug, please open an issue.',
    );
  }
  const configModule = runBundledCode(configFile.text, configFilepath);
  if (isErr(configModule)) {
    throw new Error(
      `Error when trying to run the config file: ${configModule.error}`,
    );
  }

  if (
    typeof configModule.value === 'object' &&
    configModule.value !== null &&
    'tailwindConfig' in configModule.value
  ) {
    return configModule.value.tailwindConfig as TailwindConfig;
  }

  throw new Error(
    `Could not read Tailwind config at ${configFilepath} because it doesn't have a default export in it.`,
    {
      cause: {
        configModule,
        configFilepath,
      },
    },
  );
};

const getImportWithGivenDefaultSpecifier = (
  ast: AST,
  specifierName: string,
) => {
  let importNode: ImportDeclaration | undefined;
  traverse(ast, {
    ImportDeclaration(nodePath) {
      if (
        nodePath.node.specifiers.some(
          (specifier) =>
            specifier.type === 'ImportDefaultSpecifier' &&
            specifier.local.name === specifierName,
        )
      ) {
        importNode = nodePath.node;
      }
    },
  });
  return importNode;
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
