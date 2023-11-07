/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type http from 'node:http';
import path from 'node:path';
import { promises as fs, existsSync } from 'node:fs';
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

  let fileAbsolutePath = path.join(staticBaseDir, pathname);

  const doesFileExist = existsSync(fileAbsolutePath);
  if (!doesFileExist) {
    res.statusCode = 404;
    res.end(`File ${pathname} not found!`);
  } else {
    const fileStat = await fs.stat(fileAbsolutePath);
    if (fileStat.isDirectory()) {
      fileAbsolutePath += `/index${ext}`;
    }

    const fileData = await fs.readFile(fileAbsolutePath);
    // if the file is found, set Content-type and send data
    res.setHeader('Content-type', lookup(ext) || 'text/plain');
    res.end(fileData);
  }
};
