import logSymbols from 'log-symbols';
import ora from 'ora';
import path, { normalize } from 'node:path';
import { exists, rm } from 'fs-extra';

import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import { exportEmails } from './export-emails';
import { getAllEmails } from './get-all-emails';

export const generateEmailsPreview = async (
  emailsDir: string,
  silent: boolean = false,
) => {
  try {
    let spinner;
    if (!silent) {
      spinner = ora('Generating emails preview').start();
      closeOraOnSIGNIT(spinner);
    }

    await createEmailPreviews(emailsDir, silent);

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
  emailsDir: string,
  silent: boolean = false,
) => {
  const previewCompilationDir = path.join(emailsDir, '.preview');

  if (await exists(previewCompilationDir)) {
    await rm(previewCompilationDir, { recursive: true, force: true });
  }

  const emails = await getAllEmails(emailsDir);
  await exportEmails(emails, previewCompilationDir, {
    html: true,
    plainText: true,
    pretty: true,
    silent,
  });
};
