import ora from 'ora';
import esbuild from 'esbuild';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import { glob } from 'glob';
import path, { normalize } from 'path';
import { render } from '@react-email/render';
import { unlink, writeFile } from 'fs-extra';

export type ExportEmailOptions = {
  /**
   * @default true
   */
  html?: boolean;
  /**
   * @default false
   */
  pretty?: boolean;
  /**
   * @default false
   */
  plainText?: boolean;

  /**
   * @default false
   */
  silent?: boolean;

  // /**
  // * @description Searches for all paths inside the emails that are of the form `"/static/*"`,
  // * and makes them absolute based on the according static folder.
  // *
  // * This is used by the preview server so it will link to static files that are local without problems.
  // *
  // * @default false
  // */
  // makeStaticFilesPathsAbsolute?: boolean;
};

export const exportEmails = async (
  src: string,
  out: string,
  {
    html = true,
    pretty = false,
    plainText = false,
    silent = false,
  }: ExportEmailOptions,
) => {
  let spinner: ora.Ora;
  if (!silent) {
    spinner = ora('Preparing files...\n').start();
    closeOraOnSIGNIT(spinner);
  }

  const emails = glob.sync(normalize(path.join(src, '*.{tsx,jsx}')));
  await esbuild.build({
    bundle: true,
    entryPoints: emails,
    platform: 'node',
    write: true,
    outdir: out,
  });

  if (!silent) {
    spinner!.succeed();
  }

  const builtEmails = glob.sync(normalize(`${out}/*.js`), {
    absolute: true,
  });

  for (const templatePath of builtEmails) {
    if (!silent) {
      spinner!.text = `rendering ${templatePath.split('/').pop()}`;
      spinner!.render();
    }

    delete require.cache[templatePath];
    // we need to use require since it has a way to programatically invalidate its cache
    const email = require(templatePath);

    const comp = email.default({});
    if (plainText) {
      const emailAsText = render(comp, {
        plainText: true,
        pretty,
      });
      const textPath = templatePath.replace('.js', '.txt');
      await writeFile(textPath, emailAsText);
    }

    if (html) {
      let emailAsHTML = render(comp, { pretty });

      // failed atempt at still allowing for local assets without copying
      //
      // if (makeStaticFilesPathsAbsolute) {
      //   emailAsHTML = emailAsHTML.replace(
      //     /src="\/static[^"]*"/g,
      //     (filePath) => filePath.replace('/static', `file://${path.join(src, '..')}/static`)
      //   );
      // }

      const htmlPath = templatePath.replace('.js', '.html');
      await writeFile(htmlPath, emailAsHTML);
    }

    await unlink(templatePath);
  }

  if (!silent) {
    if (builtEmails.length === 0) {
      spinner!.succeed('No emails were found to be render');
      return;
    }

    spinner!.succeed('Rendered all emails and exported');
  }
};
