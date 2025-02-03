'use server';

import type { IncomingMessage } from 'node:http';
import { headers } from 'next/headers';
import { parse } from 'node-html-parser';
import { quickFetch } from './quick-fetch';

type Check = { passed: boolean } & (
  | {
      type: 'accessibility';
      metadata: {
        alt: string | undefined;
      };
    }
  | {
      type: 'fetch_attempt';
      metadata: {
        fetchStatusCode: number | undefined;
      };
    }
  | {
      type: 'image_size';
      metadata: {
        byteCount: number | undefined;
      };
    }
  | {
      type: 'syntax';
    }
  | {
      type: 'security';
    }
);

export interface ImageCheckingResult {
  status: 'success' | 'warning' | 'error';
  source: string;
  checks: Check[];
}

const getResponseSizeInBytes = async (res: IncomingMessage) => {
  let totalBytes = 0;
  for await (const chunk of res) {
    totalBytes += chunk.byteLength;
  }
  return totalBytes;
};

export const checkImages = async (code: string, base: string) => {
  const ast = parse(code);

  const imageCheckingResults: ImageCheckingResult[] = [];

  const images = ast.querySelectorAll('img');
  for await (const image of images) {
    const rawSource = image.attributes.src;
    if (!rawSource) continue;
    if (imageCheckingResults.some((result) => result.source === rawSource))
      continue;

    const source = rawSource?.startsWith('/')
      ? `${base}${rawSource}`
      : rawSource;

    const result: ImageCheckingResult = {
      source: rawSource,
      status: 'success',
      checks: [],
    };

    const alt = image.attributes.alt;
    result.checks.push({
      passed: alt !== undefined,
      type: 'accessibility',
      metadata: {
        alt,
      },
    });
    if (alt === undefined) {
      result.status = 'warning';
    }

    try {
      const url = new URL(source);
      result.checks.push({
        passed: true,
        type: 'syntax',
      });

      if (source.startsWith('https://')) {
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

      const res = await quickFetch(url);
      const hasSucceeded = res.statusCode?.toString().startsWith('2') ?? false;

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

      const responseSizeBytes = await getResponseSizeInBytes(res);
      result.checks.push({
        type: 'image_size',
        passed: responseSizeBytes < 1_048_576, // 1024 x 1024 bytes
        metadata: {
          byteCount: responseSizeBytes,
        },
      });
      if (responseSizeBytes > 1_048_576) {
        result.status = 'warning';
      }
    } catch (exception) {
      result.checks.push({
        passed: false,
        type: 'syntax',
      });
      result.status = 'error';
    }

    imageCheckingResults.push(result);
  }

  return imageCheckingResults;
};
