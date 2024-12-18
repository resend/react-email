'use server';

import { parse } from 'node-html-parser';
import { quickFetch } from './quick-fetch';

export interface LinkCheckingResult {
  link: string;

  status: 'success' | 'warning' | 'error';

  checks: {
    syntax: 'failed' | 'passed';
    security?: 'failed' | 'passed';
  };

  responseStatusCode?: number;
}

export const checkLinks = async (code: string) => {
  const ast = parse(code);

  const linkCheckingResults: LinkCheckingResult[] = [];

  const anchors = ast.querySelectorAll('a');
  for await (const anchor of anchors) {
    const link = anchor.attributes.href;
    if (!link) continue;
    if (link.startsWith('mailto:')) continue;

    const result: LinkCheckingResult = {
      link,
      status: 'success',
      checks: {
        syntax: 'passed',
      },
    };

    try {
      const url = new URL(link);

      const res = await quickFetch(url);
      result.responseStatusCode = res.statusCode;
      if (
        result.responseStatusCode === undefined ||
        !result.responseStatusCode.toString().startsWith('2')
      ) {
        result.status = 'error';
      }

      if (link.startsWith('https://')) {
        result.checks.security = 'passed';
      } else {
        result.checks.security = 'failed';
        result.status = 'warning';
      }
    } catch (exception) {
      result.checks.syntax = 'failed';
      result.status = 'error';
    }

    linkCheckingResults.push(result);
  }

  return linkCheckingResults;
};
