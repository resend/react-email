import fs from 'node:fs';
import path from 'node:path';
import { Octokit } from '@octokit/rest';
import fse from 'fs-extra';
import shell from 'shelljs';

export const downloadClient = async () => {
  const octokit = new Octokit();
  const downloadRes = await octokit.repos.downloadTarballArchive({
    owner: 'resendlabs',
    repo: 'react-email',
    ref: 'v0.0.14',
  });
  fs.mkdirSync('.react-email-temp');
  const TAR_PATH = path.join('.react-email-temp', 'react-email.tar.gz');
  fs.writeFileSync(TAR_PATH, Buffer.from(downloadRes.data as string));
  shell.exec(
    `tar -xzvf .react-email-temp/react-email.tar.gz -C .react-email-temp --strip-components 1`,
    { silent: true },
  );

  fse.moveSync(
    path.join('.react-email-temp', 'client'),
    path.join('.react-email'),
  );

  fse.removeSync('.react-email-temp');
};
