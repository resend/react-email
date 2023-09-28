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
  emailDir: string,
  type: 'all' | 'static' | 'templates' = 'all',
) => {
  try {
    const spinner = ora('Generating emails preview').start();
    closeOraOnSIGNIT(spinner);

    if (type === 'all' || type === 'templates') {
      await createEmailPreviews(emailDir);
    }
    // if (type === 'all' || type === 'static') {
    //   await createStaticFiles();
    // }

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const createEmailPreviews = async (emailDir: string) => {
  const previewCompilationDir = path.join(emailDir, '.react-email');

  if (fs.existsSync(previewCompilationDir)) {
    await fse.rm(previewCompilationDir, { recursive: true, force: true });
  }

  await exportEmails(
    emailDir,
    previewCompilationDir,
    { html: true, plainText: true, pretty: true }
  );
};

// const createStaticFiles = async () => {
//   const hasPublicDirectory = fs.existsSync(PACKAGE_PUBLIC_PATH);
//
//   if (hasPublicDirectory) {
//     await fs.promises.rm(PACKAGE_PUBLIC_PATH, { recursive: true });
//   }
//
//   await fse.ensureDir(path.join(PACKAGE_PUBLIC_PATH, 'static'));
//   const userHasStaticDirectory = fs.existsSync(
//     path.join(CURRENT_PATH, 'static'),
//   );
//
//   if (userHasStaticDirectory) {
//     const result = shell.cp(
//       '-r',
//       path.join(CURRENT_PATH, 'static'),
//       path.join(PACKAGE_PUBLIC_PATH),
//     );
//
//     if (result.code > 0) {
//       throw new Error(
//         `Something went wrong while copying the file to ${path.join(
//           CURRENT_PATH,
//           'static',
//         )}, ${result.cat()}`,
//       );
//     }
//   }
// };
