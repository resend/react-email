import path, { normalize, resolve } from 'node:path';
import fs from 'node:fs';
import esbuild from 'esbuild';
import { convertToAbsolutePath } from './convert-to-absolute-path';
import next from 'next';
import http from 'node:http';
import { parse } from 'node:url';

export const setupServer = (dir: string, port: string) => {
  const emailsDir = convertToAbsolutePath(dir);

  console.clear();

  const previewCompilationDir = path.join(emailsDir, '.preview');
  if (fs.existsSync(previewCompilationDir)) {
    fs.rmSync(previewCompilationDir, { recursive: true, force: true });
  }

  const emailTemplates = fs
    .readdirSync(normalize(emailsDir))
    .filter((file) => file.endsWith('.tsx') || file.endsWith('.jsx'))
    .map((file) => path.join(emailsDir, file));

  esbuild.buildSync({
    bundle: true,
    entryPoints: emailTemplates,
    platform: 'node',
    write: true,
    outdir: previewCompilationDir,
  });

  console.log('Email previews generated\n');

  const app = next({
    dev: true,
    port: Number(port),
    dir: resolve(__dirname, '../../'),
  });

  const nextHandle = app.getRequestHandler();

  void app.prepare().then(() => {
    http
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .createServer(async function (req, res) {
        if (!req.url) {
          res.end(404);
          return;
        }

        const parsedUrl = parse(req.url, true);

        res.setHeader(
          'Cache-Control',
          'no-cache, max-age=0, must-revalidate, no-store',
        );
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '-1');

        await nextHandle(req, res, parsedUrl);
      })
      .listen(port, () => {
        console.log(`running preview at http://localhost:${port}`);
      })
      .on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          console.error(
            `port ${port} is taken, is react-email already running?`,
          );
          process.exit(1);
        } else {
          console.error('preview server error:', JSON.stringify(error));
        }
      });
  });
};

const exitHandler = () => {
  process.exit(1);
};

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
