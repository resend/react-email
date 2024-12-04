'use server';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import http from 'node:http';
import traverse from '@babel/traverse';
import { getLineAndColumnFromIndex } from './get-line-and-column-from-index';
import { parseCode } from './parse-code';

const succeedingURLs = new Map<URL, boolean>();

const doesURLSucceedResponse = async (url: URL) => {
  if (!succeedingURLs.has(url)) {
    await new Promise<void>((resolve) => {
      http.get(url, (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          succeedingURLs.set(url, true);
        } else {
          succeedingURLs.set(url, false);
        }
        resolve();
      });
    });
  }
  return succeedingURLs.get(url)!;
};

interface LinkCheck {
  type: 'syntax' | 'security' | 'response-code';
  status: 'failed' | 'passed';
}

interface LinkCheckingResult {
  link: string;

  line: number;
  column: number;

  checks: LinkCheck[];
}

export const checkLinks = async (code: string) => {
  const ast = parseCode(code);

  const linkCheckingResults: LinkCheckingResult[] = [];

  const instancesToValidate: {
    link: string;
    line: number;
    column: number;
  }[] = [];

  traverse(ast, {
    // <a href="...">
    JSXOpeningElement(nodePath) {
      if (
        nodePath.node.name.type !== 'JSXIdentifier' ||
        nodePath.node.name.name !== 'a'
      )
        return;

      for (const attribute of nodePath.node.attributes) {
        if (attribute.type !== 'JSXAttribute') continue;
        if (!attribute.value) return;

        if (attribute.name.type === 'JSXIdentifier') {
          const name = attribute.name.name;
          if (name === 'href') {
            let link: string | undefined;
            if (attribute.value.type === 'StringLiteral') {
              link = attribute.value.value;
            } else if (
              attribute.value.type === 'JSXExpressionContainer' &&
              attribute.value.expression.type === 'StringLiteral'
            ) {
              link = attribute.value.expression.value;
            }
            if (link) {
              const [line, column] = getLineAndColumnFromIndex(
                code,
                attribute.start!,
              );
              instancesToValidate.push({
                link,
                line,
                column,
              });
            }
          }
        }
      }
    },
  });

  for await (const { link, line, column } of instancesToValidate) {
    if (link.startsWith('mailto:')) {
      continue;
    }

    if (link.startsWith('/')) {
      continue;
    }

    const checks: LinkCheck[] = [];

    try {
      const url = new URL(link);
      checks.push({
        type: 'syntax',
        status: 'passed',
      });

      const hasSucceeded = await doesURLSucceedResponse(url);
      checks.push({
        type: 'response-code',
        status: hasSucceeded ? 'passed' : 'failed',
      });

      checks.push({
        type: 'security',
        status: link.startsWith('https://') ? 'passed' : 'failed',
      });
    } catch (exception) {
      checks.push({
        type: 'syntax',
        status: 'failed',
      });
    }

    linkCheckingResults.push({
      link,
      line,
      column,
      checks,
    });
  }

  return linkCheckingResults;
};
