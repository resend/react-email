import { promises as fs, existsSync } from 'node:fs';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type http from 'node:http';
import path from 'node:path';
import type url from 'node:url';
import { lookup } from 'mime-types';

export const serveStaticFile = async (
  res: http.ServerResponse,
  parsedUrl: url.UrlWithParsedQuery,
  staticDirRelativePath: string,
) => {
  const staticBaseDir = path.join(process.cwd(), staticDirRelativePath);
  const pathname = parsedUrl.pathname!;
  const ext = path.parse(pathname).ext;

  const fileAbsolutePath = path.join(staticBaseDir, pathname);

  try {
    const fileHandle = await fs.open(fileAbsolutePath, 'r');
    const fileData = await fs.readFile(fileHandle);

    // if the file is found, set Content-type and send data
    res.setHeader('Content-type', lookup(ext) || 'text/plain');
    res.end(fileData);

    fileHandle.close();
  } catch (exception) {
    if (!existsSync(fileAbsolutePath)) {
      res.statusCode = 404;
      res.end();
    } else {
      const sanitizedFilePath = fileAbsolutePath.replace(/\n|\r/g, '');
      console.error(
        `Could not read file at ${sanitizedFilePath} to be served, here's the exception:`,
        exception,
      );

      res.statusCode = 500;
      res.end(
        'Could not read file to be served! Check your terminal for more information.',
      );
    }
  }
};
