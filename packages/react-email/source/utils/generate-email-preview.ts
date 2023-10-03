import logSymbols from 'log-symbols';
import ora from 'ora';
import path from 'node:path';
import { exists, rm } from 'fs-extra';

import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import { exportEmails } from './export-emails';

export const generateEmailsPreview = async (
  absoluteEmailsDir: string,
  silent: boolean = false,
) => {
  try {
    let spinner;
    if (!silent) {
      spinner = ora('Generating emails preview').start();
      closeOraOnSIGNIT(spinner);
    }

    await createEmailPreviews(absoluteEmailsDir, silent);

    if (!silent) {
      spinner!.stopAndPersist({
        symbol: logSymbols.success,
        text: 'Emails preview generated',
      });
    }
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async (
  absoluteEmailsDir: string,
  silent: boolean = false,
) => {
  const previewCompilationDir = path.join(absoluteEmailsDir, '.preview');

  if (await exists(previewCompilationDir)) {
    await rm(previewCompilationDir, { recursive: true, force: true });
  }

  await exportEmails(absoluteEmailsDir, previewCompilationDir, {
    html: true,
    plainText: true,
    pretty: true,
    silent,
  });
};
