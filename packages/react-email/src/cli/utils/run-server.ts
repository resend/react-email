// import { createWatcherInstance, watcher } from './watcher';
import {
  // convertToAbsolutePath,
  startDevServer,
} from '.';

/**
 * Utility function to run init for the email previewing server
 *
 * @param emailsDirRelativePath - Directory in which the emails are located, only for dev and build, unused for start.
 * @param port - The port on which the server will run, only for dev and start, unused for build.
 */
export const setupServer = async (
  emailsDirRelativePath: string,
  port: string
) => {
  // const emailsDirAbsolutePath = convertToAbsolutePath(emailsDirRelativePath);
  // const watcherInstance = createWatcherInstance(emailsDirAbsolutePath);

  await startDevServer(emailsDirRelativePath, parseInt(port));
  // commented because we still need to tweak the next part
  // watcher(watcherInstance, emailsDirAbsolutePath);
};
