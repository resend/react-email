'use server';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import http from 'node:http';
import { promises as fs } from 'node:fs';
import traverse from '@babel/traverse';
import { Passero_One } from 'next/font/google';
import { getEmailPathFromSlug } from '../get-email-path-from-slug';
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

export interface LinkCheckingResult {
  link: string;

  line: number;
  column: number;

  checks: {
    syntax: 'failed' | 'passed';
    security?: 'failed' | 'passed';
    responseCode?: 'failed' | 'passed';
  };
}

export const checkLinks = async (emailSlug: string) => {
  const emailPath = await getEmailPathFromSlug(emailSlug);
  const code = await fs.readFile(emailPath, 'utf8');
  const ast = parseCode(code);

  const linkCheckingResults: LinkCheckingResult[] = [];

  const instancesToValidate: {
    link: string;
    line: number;
    column: number;
  }[] = [];

  traverse(ast, {
    JSXOpeningElement(nodePath) {
      if (
        nodePath.node.name.type !== 'JSXIdentifier' ||
        (nodePath.node.name.name !== 'a' && nodePath.node.name.name !== 'Link')
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

    const checks: LinkCheckingResult['checks'] = {
      syntax: 'passed',
    };

    try {
      const url = new URL(link);

      const hasSucceeded = await doesURLSucceedResponse(url);
      checks.responseCode = hasSucceeded ? 'passed' : 'failed';

      checks.security = link.startsWith('https://') ? 'passed' : 'failed';
    } catch (exception) {
      checks.syntax = 'failed';
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
