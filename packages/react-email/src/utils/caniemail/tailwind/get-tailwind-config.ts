import fs from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';
import type { Node } from '@babel/traverse';
import { parse as parseJavascriptObject } from 'json5';
import traverse from '@babel/traverse';
import type { Config as TailwindOriginalConfig } from 'tailwindcss';
import type { AST } from '../../../actions/email-validation/check-compatibility';

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

const runConfigFile = createJiti(__filename, {
  interopDefault: true,
});
type ImportDeclaration = Node & { type: 'ImportDeclaration' };

export const getTailwindConfig = (
  sourceCode: string,
  ast: AST,
  sourcePath: string,
): TailwindConfig => {
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
        return parseJavascriptObject<TailwindConfig>(configObjectSourceCode);
      } catch (exception) {
        console.warn(exception);
        console.warn(
          `Tried reading the config defined directly in the Tailwind component but was unable to, probably because it isn't a valid javascript object by itself.`,
        );
      }
    }
  }

  return {};
};

const getConfigFromImport = (
  tailwindConfigImport: ImportDeclaration,
  sourcePath: string,
): TailwindConfig => {
  const configRelativePath = tailwindConfigImport.source.value;
  const configImportPath = path.resolve(
    path.dirname(sourcePath),
    configRelativePath,
  );
  const configFilepath = getFirstExistingFilepath([
    `${configImportPath}.ts`,
    `${configImportPath}.js`,
    `${configImportPath}.mjs`,
    `${configImportPath}.cjs`,
  ]);

  if (configFilepath === undefined) {
    throw new Error(
      `Could not find Tailwind config by inferring it's extension type (tried .ts, .js, .mjs and .cjs).`,
      {
        cause: {
          configPath: configImportPath,
          sourcePath,
        },
      },
    );
  }

  const configModule = configFilepath.endsWith('.ts')
    ? (runConfigFile(configFilepath) as unknown)
    : // eslint-disable-next-line @typescript-eslint/no-var-requires
      (require(configFilepath) as unknown);

  if (
    typeof configModule === 'object' &&
    configModule !== null &&
    'default' in configModule
  ) {
    return configModule.default as TailwindConfig;
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
