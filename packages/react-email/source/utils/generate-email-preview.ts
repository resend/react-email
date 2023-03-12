import logSymbols from 'log-symbols';
import { PACKAGE_EMAILS_PATH, REACT_EMAIL_ROOT } from './constants';
import fs from 'fs';
import ora from 'ora';
import shell from 'shelljs';
import path from 'path';
import fse from 'fs-extra';

export const generateEmailsPreview = async (emailDir: string) => {
  try {
    const spinner = ora('Generating emails preview').start();

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
  const hasPackageEmailsDirectory = fs.existsSync(PACKAGE_EMAILS_PATH);

  if (hasPackageEmailsDirectory) {
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
  const reactEmailPublicFolder = path.join(REACT_EMAIL_ROOT, 'public');
  fse.ensureDir(reactEmailPublicFolder);
  const hasPackageStaticDirectory = fs.existsSync(reactEmailPublicFolder);
  if (hasPackageStaticDirectory) {
    await fs.promises.rm(reactEmailPublicFolder, {
      recursive: true,
    });
  }

  // Make sure that the "static" folder does not exists in .react-email/emails
  // since it should only exists in .react-email/public, but the "createEmailPreviews"-function will blindly copy the complete emails folder
  const reactEmailEmailStaticFolder = path.join(
    REACT_EMAIL_ROOT,
    'emails',
    'static',
  );
  const hasPackageStaticDirectoryInEmails = fs.existsSync(
    reactEmailEmailStaticFolder,
  );
  if (hasPackageStaticDirectoryInEmails) {
    await fs.promises.rm(reactEmailEmailStaticFolder, {
      recursive: true,
    });
  }

  const staticDir = path.join(emailDir, 'static');
  const hasStaticDirectory = fs.existsSync(staticDir);

  if (hasStaticDirectory) {
    const result = shell.cp('-r', staticDir, reactEmailPublicFolder);
    if (result.code > 0) {
      throw new Error(
        `Something went wrong while copying the file to ${reactEmailPublicFolder}, ${result.cat()}`,
      );
    }
  }
};
