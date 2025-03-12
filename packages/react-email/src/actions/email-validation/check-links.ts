'use server';

import { parse } from 'node-html-parser';
import { quickFetch } from './quick-fetch';

export type LinkCheck = { passed: boolean } & (
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
  intendedFor: string;
  checks: LinkCheck[];
}

export const checkLinks = async (code: string) => {
  const ast = parse(code);

  const readableStream = new ReadableStream<LinkCheckingResult>({
    async start(controller) {
      const anchors = ast.querySelectorAll('a');
      for await (const anchor of anchors) {
        const link = anchor.attributes.href;
        if (!link) continue;
        if (link.startsWith('mailto:')) continue;

        const result: LinkCheckingResult = {
          intendedFor: link,
          status: 'success',
          checks: [],
        };

        try {
          const url = new URL(link);
          result.checks.push({
            passed: true,
            type: 'syntax',
          });

          if (link.startsWith('http://')) {
            result.checks.push({
              passed: false,
              type: 'security',
            });
            result.status = 'warning';
          } else {
            result.checks.push({
              passed: true,
              type: 'security',
            });
          }

          const res = await quickFetch(url);
          const hasSucceeded =
            res.statusCode?.toString().startsWith('2') ?? false;
          result.checks.push({
            type: 'fetch_attempt',
            passed: hasSucceeded,
            metadata: {
              fetchStatusCode: res.statusCode,
            },
          });
          if (!hasSucceeded) {
            result.status = res.statusCode?.toString().startsWith('3')
              ? 'warning'
              : 'error';
          }
        } catch (exception) {
          result.checks.push({
            passed: false,
            type: 'syntax',
          });
          result.status = 'error';
        }

        controller.enqueue(result);
      }
      controller.close();
    },
  });

  return readableStream;
};
