'use server';

import { parse } from 'node-html-parser';
import { quickFetch } from './quick-fetch';

type Check = { passed: boolean } & (
  | {
      type: 'fetch_attempt';
      metadata: {
        fetchStatusCode: number | undefined;
      };
    }
  | {
      type: 'syntax';
    }
  | {
      type: 'security';
    }
);

export interface LinkCheckingResult {
  status: 'success' | 'warning' | 'error';
  link: string;
  checks: Check[];
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
      checks: [],
    };

    try {
      const url = new URL(link);

      const res = await quickFetch(url);
      const hasntSucceeded =
        res.statusCode === undefined ||
        !res.statusCode.toString().startsWith('2');
      result.checks.push({
        type: 'fetch_attempt',
        passed: hasntSucceeded,
        metadata: {
          fetchStatusCode: res.statusCode,
        },
      });
      if (hasntSucceeded) {
        result.status = res.statusCode?.toString().startsWith('3')
          ? 'warning'
          : 'error';
      }

      if (link.startsWith('https://')) {
        result.checks.push({
          passed: true,
          type: 'security',
        });
      } else {
        result.checks.push({
          passed: false,
          type: 'security',
        });
        result.status = 'warning';
      }
    } catch (exception) {
      result.checks.push({
        passed: false,
        type: 'syntax',
      });
      result.status = 'error';
    }

    linkCheckingResults.push(result);
  }

  return linkCheckingResults;
};
