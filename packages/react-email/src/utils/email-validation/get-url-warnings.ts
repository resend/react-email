/* eslint-disable @typescript-eslint/no-non-null-assertion */
import http from 'node:http';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { EmailValidationWarning } from '../../actions/get-warnings-for-email';
import { getLineAndColumnFromIndex } from './get-line-and-column-from-index';
import { AST } from '.';

const existantURLs = new Map<URL, boolean>();

const doesURLExist = async (url: URL) => {
  if (!existantURLs.has(url)) {
    await new Promise<void>((resolve) => {
      http.get(url, (res) => {
        if (res.statusCode && (res.statusCode < 400 || res.statusCode >= 500)) {
          existantURLs.set(url, true);
        } else {
          existantURLs.set(url, false);
        }
        resolve();
      });
    });
  }
  return existantURLs.get(url)!;
};

export const getUrlWarnings = async (ast: AST, code: string) => {
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
          line,
          column,
        });
      }
    } catch (exception) {
      warnings.push({
        message: 'Invalid URL',
        line,
        column,
      });
    }
  }

  return warnings;
};
