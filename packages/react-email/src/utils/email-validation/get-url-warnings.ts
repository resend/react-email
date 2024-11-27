/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { EmailValidationWarning } from '../../actions/get-warnings-for-emails';
import { getLineAndColumnFromIndex } from './get-line-and-column-from-index';

const existantURLs = new Map<URL, boolean>();

const doesURLExist = async (url: URL) => {
  if (!existantURLs.has(url)) {
    try {
      await fetch(url, {
        cache: "no-cache" 
      });
      existantURLs.set(url, true);
    } catch (_) {
      existantURLs.set(url, false);
    }
  }
  return existantURLs.get(url)!;
};

export const getUrlWarnings = async (code: string, emailPath: string) => {
  const ast = parse(code, {
    plugins: ['jsx', 'typescript', 'decorators'],
    strictMode: false,
    ranges: true,
    sourceType: 'unambiguous',
  });

  const warnings: EmailValidationWarning[] = [];

  const instancesToValidate: {
    url: string;
    line: number;
    column: number;
  }[] = [];

  traverse(ast, {
    JSXAttribute(path) {
      if (!path.node.value) return;

      if (path.node.name.type === 'JSXIdentifier') {
        const name = path.node.name.name;
        if (/src|href|cite/.test(name)) {
          let url: string | undefined;
          if (path.node.value.type === 'StringLiteral') {
            url = path.node.value.value;
          } else if (
            path.node.value.type === 'JSXExpressionContainer' &&
            path.node.value.expression.type === 'StringLiteral'
          ) {
            url = path.node.value.expression.value;
          }
          if (url) {
            const [line, column] = getLineAndColumnFromIndex(
              code,
              path.node.start!,
            );
            instancesToValidate.push({
              url,
              line,
              column,
            });
          }
        }
      }
    },
  });

  for await (const { url, line, column } of instancesToValidate) {
    if (url.startsWith('mailto:')) {
      continue;
    }

    try {
      const urlClass = new URL(url);
      const exists = await doesURLExist(urlClass);
      if (!exists) {
        warnings.push({
          message: 'URL does not exist',
          emailPath,
          line,
          column,
        });
      }
    } catch (exception) {
      warnings.push({
        message: 'Invalid URL',
        emailPath,
        line,
        column,
      });
    }
  }

  return warnings;
};
