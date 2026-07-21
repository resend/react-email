import fs from 'node:fs';
import type http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { serveStaticFile } from './serve-static-file.js';

const mkTempDir = () =>
  fs.mkdtempSync(path.join(os.tmpdir(), 'serve-static-file-'));

const createResponse = () => {
  let body = '';
  const response = {
    statusCode: 200,
    setHeader: vi.fn(),
    end: vi.fn((chunk?: string | Buffer) => {
      if (chunk) body += chunk.toString();
    }),
  } as unknown as http.ServerResponse;

  return { response, getBody: () => body };
};

test('serves static files with URL-encoded characters in their names', async () => {
  const projectDir = mkTempDir();
  const staticDir = path.join(projectDir, 'emails', 'static');
  const contents = 'asset contents';
  const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(projectDir);
  const { response, getBody } = createResponse();

  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(path.join(staticDir, 'company logo.txt'), contents);

  await serveStaticFile(response, '/static/company%20logo.txt', 'emails');

  expect(response.statusCode).toBe(200);
  expect(getBody()).toBe(contents);

  cwdSpy.mockRestore();
  fs.rmSync(projectDir, { recursive: true });
});

test('does not serve URL-encoded paths outside the static directory', async () => {
  const projectDir = mkTempDir();
  const staticDir = path.join(projectDir, 'emails', 'static');
  const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(projectDir);
  const { response } = createResponse();

  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'secret.txt'), 'secret contents');

  await serveStaticFile(
    response,
    '/static/%2e%2e%2f%2e%2e%2fsecret.txt',
    'emails',
  );

  expect(response.statusCode).toBe(403);

  cwdSpy.mockRestore();
  fs.rmSync(projectDir, { recursive: true });
});

test('returns a bad request for malformed URL encoding', async () => {
  const { response } = createResponse();

  await serveStaticFile(response, '/static/image%E0%A4%A.png', 'emails');

  expect(response.statusCode).toBe(400);
});
