import { existsSync, promises as fs } from 'node:fs';
import type http from 'node:http';
import path from 'node:path';
import type url from 'node:url';
import { lookup } from 'mime-types';

export const serveStaticFile = async (
  res: http.ServerResponse,
  parsedUrl: url.UrlWithParsedQuery,
  staticDirRelativePath: string,
) => {
  const pathname = parsedUrl.pathname!.replace('/static', './static');
  const ext = path.parse(pathname).ext;

  const staticBaseDir = path.resolve(process.cwd(), staticDirRelativePath);
  const fileAbsolutePath = path.resolve(staticBaseDir, pathname);
  if (!fileAbsolutePath.startsWith(staticBaseDir)) {
    res.statusCode = 403;
    res.end();
    return;
  }

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
        `Could not read file at %s to be served, here's the exception:`,
        sanitizedFilePath,
        exception,
      );

      res.statusCode = 500;
      res.end(
        'Could not read file to be served! Check your terminal for more information.',
      );
    }
  }
};
