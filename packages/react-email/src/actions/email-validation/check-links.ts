'use server';

import { parse } from 'node-html-parser';
import { quickFetch } from './quick-fetch';

export interface LinkCheckingResult {
  link: string;

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
      checks: {
        syntax: 'passed',
      },
    };

    try {
      const url = new URL(link);

      const res = await quickFetch(url);
      result.responseStatusCode = res.statusCode;

      result.checks.security = link.startsWith('https://')
        ? 'passed'
        : 'failed';
    } catch (exception) {
      result.checks.syntax = 'failed';
    }

    linkCheckingResults.push(result);
  }

  return linkCheckingResults;
};
