import logSymbols from 'log-symbols';
import { PACKAGE_EMAILS_PATH, PACKAGE_PUBLIC_PATH } from './constants';
import fs from 'fs';
import ora from 'ora';
import shell from 'shelljs';
import path from 'path';
import fse from 'fs-extra';

import { closeOraOnSIGNIT } from './close-ora-on-sigint';

export const generateEmailsPreview = async (emailDir: string) => {
  try {
    const spinner = ora('Generating emails preview').start();
    closeOraOnSIGNIT(spinner)

    await createEmailPreviews(emailDir);
    await createStaticFiles(emailDir);

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async (emailDir: string) => {
  const hasEmailsDirectory = fs.existsSync(PACKAGE_EMAILS_PATH);

  if (hasEmailsDirectory) {
    await fs.promises.rm(PACKAGE_EMAILS_PATH, { recursive: true });
  }

  const result = shell.cp('-r', emailDir, PACKAGE_EMAILS_PATH);

  if (result.code > 0) {
    throw new Error(
      `Something went wrong while copying the file to ${PACKAGE_EMAILS_PATH}, ${result.cat()}`,
    );
  }
};

const createStaticFiles = async (emailDir: string) => {
  const hasPublicDirectory = fs.existsSync(PACKAGE_PUBLIC_PATH);

  if (hasPublicDirectory) {
    await fs.promises.rm(PACKAGE_PUBLIC_PATH, { recursive: true });
  }

  await fse.ensureDir(path.join(PACKAGE_PUBLIC_PATH, 'static'));

  const result = shell.cp(
    '-r',
    path.join('static'),
    path.join(PACKAGE_PUBLIC_PATH),
  );
  if (result.code > 0) {
    throw new Error(
      `Something went wrong while copying the file to ${path.join(
        emailDir,
        'static',
      )}, ${result.cat()}`,
    );
  }
};
