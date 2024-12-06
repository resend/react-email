'use server';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import http from 'node:http';
import { getLineAndColumnFromIndex } from './get-line-and-column-from-index';
import { parse } from 'node-html-parser';

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

  checks: {
    syntax: 'failed' | 'passed';
    security?: 'failed' | 'passed';
    responseCode?: 'failed' | 'passed';
  };
}

export const checkLinks = async (code: string) => {
  const ast = parse(code);

  const linkCheckingResults: LinkCheckingResult[] = [];

  const anchors = ast.querySelectorAll('a');
  for await (const anchor of anchors) {
    const link = anchor.attributes.href;
    if (!link) continue;
    if (link.startsWith('mailto:')) continue;

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
      checks,
    });
  }

  return linkCheckingResults;
};
