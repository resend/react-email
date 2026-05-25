import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { quickFetch } from './quick-fetch';

let server: http.Server;
let port: number;
let requestCount: number;

beforeAll(async () => {
  server = http.createServer((_req, res) => {
    requestCount += 1;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('internal-service-response');
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });
  port = (server.address() as AddressInfo).port;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

beforeEach(() => {
  requestCount = 0;
});

test('refuses to fetch loopback addresses (SSRF)', async () => {
  const url = new URL(`http://127.0.0.1:${port}/`);
  await expect(quickFetch(url)).rejects.toThrow();
  expect(requestCount).toBe(0);
});

test('refuses non-http(s) protocols', async () => {
  const url = new URL('file:///etc/passwd');
  await expect(quickFetch(url)).rejects.toThrow();
});
