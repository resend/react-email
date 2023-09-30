import { createEmailsWatcherInstance, emailPreviewGeneratorWatcher } from './watcher';
import {
  convertToAbsolutePath,
  generateEmailsPreview,
  startPreviewServer,
} from '.';

/**
 * Utility function to run init/sync for the server in dev, build or start mode.
 *
 * @param emailsDir Directory in which the emails are located, only for dev and build, unused for start.
 * @param port The port on which the server will run, only for dev and start, unused for build.
 */
export const setupServer = async (
  emailsDir: string,
  port: string
) => {
  const absoluteEmailsDir = convertToAbsolutePath(emailsDir);

  const watcherInstance = createEmailsWatcherInstance(absoluteEmailsDir);

  console.clear();
  await generateEmailsPreview(absoluteEmailsDir);
  console.info('\n');
  startPreviewServer(absoluteEmailsDir, port);

  emailPreviewGeneratorWatcher(watcherInstance, absoluteEmailsDir);
};
