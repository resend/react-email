import http from 'node:http';
import type { IncomingMessage } from 'node:http';
import https from 'node:https';

export const quickFetch = (url: URL) => {
  return new Promise<IncomingMessage>((resolve, reject) => {
    const caller = url.protocol === 'https:' ? https : http;
    caller
      .get(url, (res) => {
        resolve(res);
      })
      .on('error', (error) => reject(error));
  });
};
