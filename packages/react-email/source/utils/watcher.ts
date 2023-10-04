import chokidar, { FSWatcher } from 'chokidar';
import path from 'node:path';
import { generateEmailsPreview } from './generate-email-preview';
import {
  hotreloadPreviewServer,
  previewServerWSConnection,
} from './start-server-command';
import ora from 'ora';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { exportEmails } from './export-emails';
import { convertToAbsolutePath } from './convert-to-absolute-path';

export const createEmailsWatcherInstance = (absoluteEmailsDir: string) => {
  const watcher = chokidar.watch(absoluteEmailsDir, {
    ignoreInitial: true,
    cwd: absoluteEmailsDir.split(path.sep).slice(0, -1).join(path.sep),
    ignored: /(^|[\/\\])\../,
  });

  // Catches ctrl+c event
  const exit = () => {
    void watcher.close();
  };
  process.on('SIGINT', exit);
  process.on('uncaughtException', exit);

  return watcher;
};

export const emailPreviewGeneratorWatcher = (
  watcherInstance: FSWatcher,
  absoluteEmailsDir: string,
) => {
  watcherInstance.on('all', async (_event, filename) => {
    const file = filename.split(path.sep);
    if (file[1] === undefined) {
      return;
    }

    console.info(
      `\nChanges to the source of the email at "${chalk.cyan(
        filename,
      )}" detected`,
    );

    try {
      const startTime = performance.now();

      const spinner = ora('Adjusting email previews to changes').start();
      closeOraOnSIGNIT(spinner);

      await exportEmails(
        [convertToAbsolutePath(filename)],
        path.join(absoluteEmailsDir, '.preview'),
        {
          html: true,
          pretty: true,
          silent: true,
          plainText: true,
        },
      );
      if (previewServerWSConnection) {
        spinner.text =
          'Sending a reload message to the preview server currently running in your browser';
        spinner.render();

        // only when the communication ws server is running
        await hotreloadPreviewServer();
      }

      const endTime = performance.now();

      spinner.stopAndPersist({
        symbol: logSymbols.success,
        text: `You email changes are now live! ${(endTime - startTime).toFixed(
          1,
        )}ms`,
      });
    } catch (e) {
      throw new Error(
        `Something went wrong when trying to genreate preview for the email, ${// @ts-expect-error
e?.message}`,
      );
    }
  });
};
