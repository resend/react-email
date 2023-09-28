import ora from "ora";
import esbuild from "esbuild";
import shell from 'shelljs';
import { closeOraOnSIGNIT } from "./close-ora-on-sigint";
import { glob } from "glob";
import path, { normalize } from "path";
import { render } from "@react-email/render";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import logSymbols from "log-symbols";
import tree from "tree-node-cli";

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
};

export const exportEmails = async (
  src: string,
  out: string,
  { html = true, pretty = false, plainText = false }: ExportEmailOptions
) => {
  const spinner = ora('Preparing files...\n').start();
  closeOraOnSIGNIT(spinner);

  const emails = glob.sync(normalize(path.join(src, '*.{tsx,jsx}')));
  esbuild.buildSync({
    bundle: true,
    entryPoints: emails,
    platform: 'node',
    write: true,
    outdir: out,
  });
  spinner.succeed();

  const builtEmails = glob.sync(normalize(`${out}/*.js`), {
    absolute: true,
  });

  for (const template of builtEmails) {
    spinner.text = `rendering ${template.split('/').pop()}`;
    spinner.render();
    const email = await import(template);
    if (plainText) {
      const emailAsText = render(
        email.default({}),
        {
          plainText: true,
          pretty
        }
      );
      const textPath = template.replace('.js', '.txt');
      writeFileSync(textPath, emailAsText);
    }

    if (html) {
      const emailAsHTML = render(
        email.default({}),
        { pretty }
      );
      const htmlPath = template.replace('.js', '.html');
      writeFileSync(htmlPath, emailAsHTML);
    }

    unlinkSync(template);
  }
  if (builtEmails.length === 0) {
    spinner.succeed('No emails to render');
    return;
  }
  spinner.succeed('Rendered all files');
  spinner.text = `Copying static files`;
  spinner.render();

  const staticDir = path.join(src, 'static');
  const hasStaticDirectory = existsSync(staticDir);

  if (hasStaticDirectory) {
    const result = shell.cp('-r', staticDir, path.join(out, 'static'));
    if (result.code > 0) {
      throw new Error(
        `Something went wrong while copying the file to ${out}/static, ${result.cat()}`,
      );
    }
  }
  spinner.succeed();

  const fileTree = tree(out, {
    allFiles: true,
    maxDepth: 4,
  });

  console.log(fileTree);

  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Successfully exported emails',
  });
};
