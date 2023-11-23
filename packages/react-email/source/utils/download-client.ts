import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { Octokit } from '@octokit/rest';
import fse from 'fs-extra';
import shell from 'shelljs';

import { PREVIEW_CLIENT_DIR, TEMP_DIR } from './constants';

export const downloadClient = async () => {
  const octokit = new Octokit();
  const downloadRes = await octokit.repos.downloadTarballArchive({
    owner: 'resendlabs',
    repo: 'react-email',
    ref: 'v0.0.15',
  });
  if (!fs.existsSync(TEMP_DIR)) await fsp.mkdir(TEMP_DIR);

  const downloadFolder = path.join(TEMP_DIR, '.download');

  if (fs.existsSync(downloadFolder)) await fse.remove(downloadFolder);
  await fsp.mkdir(downloadFolder);

  const TAR_PATH = path.join(TEMP_DIR, 'react-email.tar.gz');
  await fsp.writeFile(TAR_PATH, Buffer.from(downloadRes.data as string));
  shell.exec(
    `tar -xzvf ${TAR_PATH} -C ${downloadFolder} --strip-components 1`,
    { silent: true },
  );
  await fse.move(
    path.join(downloadFolder, 'client'), 
    PREVIEW_CLIENT_DIR
  );

  await fse.remove(downloadFolder);
  await fse.remove(TAR_PATH);
};
