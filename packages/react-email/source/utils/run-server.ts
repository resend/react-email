import { createWatcherInstance, watcher } from './watcher';
import {
  convertToAbsolutePath,
  startDevServer,
} from '.';

/**
 * Utility function to run init/sync for the server in dev, build or start mode.
 *
 * @param type dev | build | start
 * @param dir Directory in which the emails are located, only for dev and build, unused for start.
 * @param port The port on which the server will run, only for dev and start, unused for build.
 */
export const setupServer = async (
  _type: 'dev' | 'build' | 'start',
  dir: string,
  port: string
) => {
  const emailDir = convertToAbsolutePath(dir);

  const watcherInstance = createWatcherInstance(emailDir);

  startDevServer(port);
  watcher(watcherInstance, emailDir);
};
