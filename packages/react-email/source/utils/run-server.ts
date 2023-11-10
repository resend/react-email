import path, { normalize, resolve } from 'node:path';
import fs, { writeFileSync } from 'node:fs';
import { convertToAbsolutePath } from './convert-to-absolute-path';
import next from 'next';
import http from 'node:http';
import { parse } from 'node:url';

export const setupServer = (dir: string, port: string) => {
  const emailsDir = convertToAbsolutePath(dir);

  console.clear();

  process.env.REACT_EMAILS_DIR = emailsDir;

  const previews = fs
    .readdirSync(normalize(emailsDir))
    .filter((file) => file.endsWith('.tsx') || file.endsWith('.jsx'));

  const previewsFolder = path.join(__dirname, '../../src/app', 'emails');
  console.log(path.join(__dirname, '../../src/app', 'emails'));
  if (!fs.existsSync(previewsFolder)) {
    fs.mkdirSync(previewsFolder);
  }

  for (const preview of previews) {
    writeFileSync(
      path.join(previewsFolder, preview),
      `export * as default from '${emailsDir}/${preview
        .replace('.tsx', '')
        .replace('.jsx', '')}';`,
    );
  }

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
