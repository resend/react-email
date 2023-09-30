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
  emailDir: string
) => {
  try {
    const spinner = ora('Generating emails preview').start();
    closeOraOnSIGNIT(spinner);

    await createEmailPreviews(emailDir);

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async (emailDir: string) => {
  const previewCompilationDir = path.join(emailDir, '.preview');

  if (fs.existsSync(previewCompilationDir)) {
    await fse.rm(previewCompilationDir, { recursive: true, force: true });
  }

  await exportEmails(
    emailDir,
    previewCompilationDir,
    { html: true, plainText: true, pretty: true }
  );
};

