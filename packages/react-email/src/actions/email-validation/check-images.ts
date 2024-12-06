'use server';

import { parse } from 'node-html-parser';
import { quickFetch } from './quick-fetch';

export interface ImageCheckingResult {
  src: string;

  checks: {
    syntax: 'failed' | 'passed';
    security?: 'failed' | 'passed';
  };

  responseStatusCode?: number;
}

export const checkLinks = async (code: string) => {
  const ast = parse(code);

  const imageCheckingResults: ImageCheckingResult[] = [];

  const images = ast.querySelectorAll('mg');
  for await (const image of images) {
    const src = image.attributes.src;
    if (!src) continue;

    const result: ImageCheckingResult = {
      src,
      checks: {
        syntax: 'passed',
      },
    };

    try {
      const url = new URL(src);

      const res = await quickFetch(url);
      res.headers['content-length']
      res.on('data', (chunk) => {
      })

      result.checks.security = src.startsWith('https://')
        ? 'passed'
        : 'failed';
    } catch (exception) {
      result.checks.syntax = 'failed';
    }

    imageCheckingResults.push(result);
  }

  return imageCheckingResults;
};
