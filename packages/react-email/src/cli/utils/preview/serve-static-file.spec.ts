import fs from 'node:fs';
import type http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { serveStaticFile } from './serve-static-file.js';

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

const countOpenFileDescriptors = () => fs.readdirSync('/dev/fd').length;

let projectDir: string;
let staticDir: string;

beforeEach(() => {
  projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'serve-static-file-'));
  staticDir = path.join(projectDir, 'emails', 'static');
  fs.mkdirSync(staticDir, { recursive: true });
  vi.spyOn(process, 'cwd').mockReturnValue(projectDir);
});

afterEach(() => {
  vi.restoreAllMocks();
  fs.rmSync(projectDir, { recursive: true });
});

test('serves static files with URL-encoded characters in their names', async () => {
  const contents = 'asset contents';
  const { response, getBody } = createResponse();

  fs.writeFileSync(path.join(staticDir, 'company logo.txt'), contents);

  await serveStaticFile(response, '/static/company%20logo.txt', 'emails');

  expect(response.statusCode).toBe(200);
  expect(getBody()).toBe(contents);
});

test('does not serve URL-encoded paths outside the static directory', async () => {
  const { response } = createResponse();

  fs.writeFileSync(path.join(projectDir, 'secret.txt'), 'secret contents');

  await serveStaticFile(
    response,
    '/static/%2e%2e%2f%2e%2e%2fsecret.txt',
    'emails',
  );

  expect(response.statusCode).toBe(403);
});

test('returns not found for a missing file', async () => {
  const { response } = createResponse();

  await serveStaticFile(response, '/static/missing.png', 'emails');

  expect(response.statusCode).toBe(404);
});

test.each([
  '/static/',
  '/static/nested',
])('returns not found for the directory %s', async (pathname) => {
  const { response } = createResponse();

  fs.mkdirSync(path.join(staticDir, 'nested'));

  await serveStaticFile(response, pathname, 'emails');

  expect(response.statusCode).toBe(404);
});

// Node.js 25+ exits when a FileHandle that was never closed is garbage
// collected, so a failed read must not leave its descriptor open.
test.skipIf(process.platform === 'win32')(
  'does not leave a file descriptor open when the read fails',
  async () => {
    const { response } = createResponse();
    const openBefore = countOpenFileDescriptors();

    await serveStaticFile(response, '/static/', 'emails');

    expect(countOpenFileDescriptors()).toBe(openBefore);
  },
);

test('returns a bad request for malformed URL encoding', async () => {
  const { response } = createResponse();

  await serveStaticFile(response, '/static/image%E0%A4%A.png', 'emails');

  expect(response.statusCode).toBe(400);
});
