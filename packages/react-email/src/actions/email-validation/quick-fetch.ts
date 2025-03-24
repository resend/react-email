import type { IncomingMessage } from 'node:http';
import http from 'node:http';
import https from 'node:https';

export const quickFetch = (url: URL) => {
  return new Promise<IncomingMessage>((resolve) => {
    const caller = url.protocol === 'https:' ? https : http;
    caller.get(url, (res) => {
      resolve(res);
    });
  });
};
