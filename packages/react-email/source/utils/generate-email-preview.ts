import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import shell from 'shelljs';
import logSymbols from 'log-symbols';
import fse from 'fs-extra';
import { sync } from 'glob';
import {
  CURRENT_PATH,
  PACKAGE_EMAILS_PATH,
  PACKAGE_PUBLIC_PATH,
} from './constants';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';

/**
 * Node.js and imports are requiring all imports to be /, while some functions (like glob) return paths with \\ for path separation on windows
 */
function osIndependentPath(p: string) {
  return p.split(path.sep).join('/');
}

export const generateEmailsPreview = async (
  emailDir: string,
  type: 'all' | 'static' | 'templates' = 'all',
) => {
  try {
    const spinner = ora('Generating emails preview').start();
    closeOraOnSIGNIT(spinner);

    if (type === 'all' || type === 'templates') {
      createEmailPreviews(emailDir);
    }
    if (type === 'all' || type === 'static') {
      await createStaticFiles();
    }

    spinner.stopAndPersist({
      symbol: logSymbols.success,
      text: 'Emails preview generated',
    });
  } catch (error) {
    console.log({ error });
  }
};

const packageEmailsPath = osIndependentPath(PACKAGE_EMAILS_PATH);

const createEmailPreviews = (emailDir: string) => {
  if (fs.existsSync(PACKAGE_EMAILS_PATH)) {
    fs.rmSync(PACKAGE_EMAILS_PATH, { recursive: true });
  }

  fs.mkdirSync(packageEmailsPath);

  const list = sync(osIndependentPath(path.join(emailDir, '/*.{jsx,tsx}')), {
    absolute: true,
  });

  /**
   * instead of copying all files, which would break and js/ts imports,
   * we create placeholder files which just contain the following code:
   *
   * import Mail from `../../path/to/emails/my-template.tsx`
   * export default Mail
   */
  for (const _absoluteSrcFilePath of list) {
    const absoluteSrcFilePath = osIndependentPath(_absoluteSrcFilePath);
    const fileName = absoluteSrcFilePath.split('/').pop();

    if (fileName === undefined) {
      throw new Error(`Could not get file name from ${absoluteSrcFilePath}`);
    }

    const targetFile = path.join(
      packageEmailsPath,
      absoluteSrcFilePath.replace(osIndependentPath(emailDir), ''),
    );

    const dirWithTargetFile = path.dirname(targetFile);

    const importPath = path.relative(
      dirWithTargetFile,
      path.dirname(absoluteSrcFilePath),
    );

    const importFile = osIndependentPath(path.join(importPath, fileName));

    // if this import is changed, you also need to update `client/src/app/preview/[slug]/page.tsx`
    const sourceCode = `import Mail from '${importFile}';\nexport default Mail;\n`;

    fs.writeFileSync(targetFile, sourceCode);
  }
};

const createStaticFiles = async () => {
  const hasPublicDirectory = fs.existsSync(PACKAGE_PUBLIC_PATH);

  if (hasPublicDirectory) {
    await fs.promises.rm(PACKAGE_PUBLIC_PATH, { recursive: true });
  }

  await fse.ensureDir(path.join(PACKAGE_PUBLIC_PATH, 'static'));
  const userHasStaticDirectory = fs.existsSync(
    path.join(CURRENT_PATH, 'static'),
  );

  if (userHasStaticDirectory) {
    const result = shell.cp(
      '-r',
      path.join(CURRENT_PATH, 'static'),
      path.join(PACKAGE_PUBLIC_PATH),
    );

    if (result.code > 0) {
      throw new Error(
        `Something went wrong while copying the file to ${path.join(
          CURRENT_PATH,
          'static',
        )}, ${result.cat()}`,
      );
    }
  }
};
