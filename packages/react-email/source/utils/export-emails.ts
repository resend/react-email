import ora from 'ora';
import esbuild from 'esbuild';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import { normalize } from 'path';
import { render } from '@react-email/render';
import { unlink, writeFile, readdir } from 'fs-extra';
import { convertToAbsolutePath } from './convert-to-absolute-path';

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
};

export const exportEmails = async (
  emails: string[],
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

  const bundledEmailSources = await readdir(normalize(out)).then((files) =>
    files
      .filter((f) => f.endsWith('.js'))
      .map((f) => convertToAbsolutePath(`${out}/${f}`)),
  );

  for (const templatePath of bundledEmailSources) {
    if (!silent) {
      spinner!.text = `rendering ${templatePath.split('/').pop()}`;
      spinner!.render();
    }

    delete require.cache[templatePath];
    // we need to use require since it has a way to programatically invalidate its cache
    const email = require(templatePath);

    const comp = email.default(email.default.PreviewProps ?? {});
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

      const htmlPath = templatePath.replace('.js', '.html');
      await writeFile(htmlPath, emailAsHTML);
    }

    await unlink(templatePath);
  }

  if (!silent) {
    if (bundledEmailSources.length === 0) {
      spinner!.succeed('No emails were found to be render');
      return;
    }

    spinner!.succeed('Rendered all emails and exported');
  }
};
