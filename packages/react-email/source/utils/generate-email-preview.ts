import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import shell from 'shelljs';
import logSymbols from 'log-symbols';
// import {
  // CURRENT_PATH,
  // PACKAGE_EMAILS_PATH,
  // PACKAGE_PUBLIC_PATH,
// } from './constants';
import fs from 'fs';
import ora from 'ora';
// import shell from 'shelljs';
import path from 'path';
import fse from 'fs-extra';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import { exportEmails } from './export-emails';

export const generateEmailsPreview = async (
  absoluteEmailsDir: string
) => {
  try {
    const spinner = ora('Generating emails preview').start();
    closeOraOnSIGNIT(spinner);

    await createEmailPreviews(absoluteEmailsDir);

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async (absoluteEmailsDir: string) => {
  const previewCompilationDir = path.join(absoluteEmailsDir, '.preview');

  if (fs.existsSync(previewCompilationDir)) {
    await fse.rm(previewCompilationDir, { recursive: true, force: true });
  }

  await exportEmails(
    absoluteEmailsDir,
    previewCompilationDir,
    { html: true, plainText: true, pretty: true, makeStaticFilesPathsAbsolute: true }
  );
};

