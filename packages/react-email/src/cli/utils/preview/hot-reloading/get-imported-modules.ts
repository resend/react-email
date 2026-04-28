import { parse } from '@babel/parser';

import traverseModule from '@babel/traverse';

const traverse =
  typeof traverseModule === 'function'
    ? traverseModule
    : // @ts-expect-error we keep this check here so that this still works with the dev:preview script's use of tsx
      traverseModule.default;

export interface ImportedModules {
  staticImports: string[];
  dynamicImportPrefixes: string[];
}

export const getImportedModules = (contents: string): ImportedModules => {
  const staticImports: string[] = [];
  const dynamicImportPrefixes: string[] = [];
  const parsedContents = parse(contents, {
    sourceType: 'unambiguous',
    strictMode: false,
    errorRecovery: true,
    plugins: ['jsx', 'typescript', 'decorators'],
  });

  traverse(parsedContents, {
    ImportDeclaration({ node }) {
      staticImports.push(node.source.value);
    },
    ExportAllDeclaration({ node }) {
      staticImports.push(node.source.value);
    },
    ExportNamedDeclaration({ node }) {
      if (node.source) {
        staticImports.push(node.source.value);
      }
    },
    TSExternalModuleReference({ node }) {
      staticImports.push(node.expression.value);
    },
    CallExpression({ node }) {
      if ('name' in node.callee && node.callee.name === 'require') {
        if (node.arguments.length === 1) {
          const importPathNode = node.arguments[0]!;
          if (importPathNode!.type === 'StringLiteral') {
            staticImports.push(importPathNode.value);
          }
        }
        return;
      }

      if (node.callee.type === 'Import' && node.arguments.length === 1) {
        const argument = node.arguments[0]!;
        if (argument.type === 'StringLiteral') {
          staticImports.push(argument.value);
          return;
        }
        if (argument.type === 'TemplateLiteral' && argument.quasis.length > 0) {
          if (argument.expressions.length === 0) {
            const onlyQuasi = argument.quasis[0]!;
            const staticPath = onlyQuasi.value.cooked ?? onlyQuasi.value.raw;
            if (staticPath.length > 0) {
              staticImports.push(staticPath);
            }
            return;
          }
          const firstQuasi = argument.quasis[0]!;
          const leadingStatic = firstQuasi.value.cooked ?? firstQuasi.value.raw;
          if (leadingStatic.length > 0) {
            dynamicImportPrefixes.push(leadingStatic);
          }
        }
      }
    },
  });

  return { staticImports, dynamicImportPrefixes };
};
