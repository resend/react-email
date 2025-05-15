import * as walk from 'acorn-walk';
import { Parser } from '../../../../utils/parser';

export const getImportedModules = (contents: string) => {
  const importedPaths: string[] = [];
  const parsedContents = Parser.parse(contents, {
    locations: true,
    sourceType: 'module',
    ecmaVersion: 'latest',
  });

  walk.simple(parsedContents, {
    ImportDeclaration(node) {
      if (node.source.value) {
        importedPaths.push(node.source.value.toString());
      }
    },
    ExportAllDeclaration(node) {
      if (node.source.value) {
        importedPaths.push(node.source.value.toString());
      }
    },
    ExportNamedDeclaration(node) {
      if (node.source?.value) {
        importedPaths.push(node.source.value.toString());
      }
    },
    CallExpression(node) {
      if ('name' in node.callee && node.callee.name === 'require') {
        if (node.arguments.length === 1) {
          const importPathNode = node.arguments[0]!;
          if (importPathNode!.type === 'Literal' && importPathNode.value) {
            importedPaths.push(importPathNode.value.toString());
          }
        }
      }
    },
  });

  return importedPaths;
};
