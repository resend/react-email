import {
  createEmailsWatcherInstance,
  emailPreviewGeneratorWatcher,
} from './watcher';
import {
  convertToAbsolutePath,
  generateEmailsPreview,
  startPreviewServer,
} from '.';
import ora from 'ora';
import { closeOraOnSIGNIT } from './close-ora-on-sigint';
import logSymbols from 'log-symbols';

/**
 * Utility function to run init/sync for the server in dev, build or start mode.
 *
 * @param emailsDir Directory in which the emails are located, only for dev and build, unused for start.
 * @param port The port on which the server will run, only for dev and start, unused for build.
 */
export const setupServer = async (emailsDir: string, port: string) => {
  const absoluteEmailsDir = convertToAbsolutePath(emailsDir);

  const watcherInstance = createEmailsWatcherInstance(absoluteEmailsDir);

  const spinner = ora();
  closeOraOnSIGNIT(spinner);
  await generateEmailsPreview(absoluteEmailsDir, true);
  spinner.stopAndPersist({
    symbol: logSymbols.success,
    text: 'Initial email previews generated'
  });

  console.clear();

  console.info('\n');

  startPreviewServer(absoluteEmailsDir, port);

  emailPreviewGeneratorWatcher(watcherInstance, absoluteEmailsDir);
};
