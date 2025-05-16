import { parse } from '@babel/parser';

import traverseModule from '@babel/traverse';

const traverse =
  // we keep this check here so that this still works with the dev:preview
  // script's use of tsx
  typeof traverseModule === 'function'
    ? traverseModule
    : traverseModule.default;

export const getImportedModules = (contents: string) => {
  const importedPaths: string[] = [];
  const parsedContents = parse(contents, {
    sourceType: 'unambiguous',
    strictMode: false,
    errorRecovery: true,
    plugins: ['jsx', 'typescript', 'decorators'],
  });

  traverse(parsedContents, {
    ImportDeclaration({ node }) {
      importedPaths.push(node.source.value);
    },
    ExportAllDeclaration({ node }) {
      importedPaths.push(node.source.value);
    },
    ExportNamedDeclaration({ node }) {
      if (node.source) {
        importedPaths.push(node.source.value);
      }
    },
    TSExternalModuleReference({ node }) {
      importedPaths.push(node.expression.value);
    },
    CallExpression({ node }) {
      if ('name' in node.callee && node.callee.name === 'require') {
        if (node.arguments.length === 1) {
          const importPathNode = node.arguments[0]!;
          if (importPathNode!.type === 'StringLiteral') {
            importedPaths.push(importPathNode.value);
          }
        }
      }
    },
  });

  return importedPaths;
};
