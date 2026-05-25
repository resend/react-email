import dns from 'node:dns/promises';
import type { IncomingMessage, RequestOptions } from 'node:http';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { isPrivateOrReservedIp } from './is-private-ip';

export const quickFetch = async (url: URL): Promise<IncomingMessage> => {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(
      `Refusing to fetch ${url.href}: only http and https protocols are allowed`,
    );
  }

  const literalFamily = net.isIP(url.hostname);
  const resolved: Array<{ address: string; family: number }> =
    literalFamily === 0
      ? await dns.lookup(url.hostname, { all: true, verbatim: true })
      : [{ address: url.hostname, family: literalFamily }];

  for (const { address } of resolved) {
    if (isPrivateOrReservedIp(address)) {
      throw new Error(
        `Refusing to fetch ${url.href}: resolves to a private or reserved address (${address})`,
      );
    }
  }

  if (resolved.length === 0) {
    throw new Error(`Refusing to fetch ${url.href}: hostname did not resolve`);
  }
  const safe = resolved[0]!;

  // Pin the vetted address into the actual TCP connect so a hostile
  // nameserver cannot rebind to a private IP between our preflight
  // resolution and the socket connect (DNS rebinding). Node's net module
  // invokes lookup with either `{ all: true }` (multi-address connect) or
  // `{ all: false }`; the callback shape differs by mode.
  const pinnedLookup = (
    _hostname: string,
    opts: { all?: boolean } | undefined,
    callback: (
      err: NodeJS.ErrnoException | null,
      addressOrAddresses: string | typeof resolved,
      family?: number,
    ) => void,
  ): void => {
    if (opts?.all) {
      callback(null, resolved);
    } else {
      callback(null, safe.address, safe.family);
    }
  };

  return new Promise<IncomingMessage>((resolve, reject) => {
    const caller = url.protocol === 'https:' ? https : http;
    caller
      .get(url, { lookup: pinnedLookup } as RequestOptions, (res) => {
        resolve(res);
      })
      .on('error', (error) => reject(error));
  });
};
