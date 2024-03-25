import { parse } from '@babel/parser';
import * as walk from 'babel-walk';

const importVisitor = walk.simple<string[]>({
  ImportDeclaration(node, importedPaths) {
    importedPaths.push(node.source.value);
  },
  CallExpression(node, importedPaths) {
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

export const getImportedModules = (contents: string) => {
  const importedPaths: string[] = [];
  const parsedContents = parse(contents, {
    sourceType: 'unambiguous',
    strictMode: false,
    errorRecovery: true,
    plugins: ['jsx', 'typescript'],
  });

  importVisitor(parsedContents, importedPaths);

  return importedPaths;
};
