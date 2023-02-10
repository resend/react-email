import chokidar, { FSWatcher } from 'chokidar';
import {
  CURRENT_PATH,
  EVENT_FILE_DELETED,
  PACKAGE_EMAILS_PATH,
  REACT_EMAIL_ROOT,
} from './constants';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

export const createWatcherInstance = (watchDir: string) =>
  chokidar.watch(watchDir, {
    ignoreInitial: true,
    cwd: CURRENT_PATH,
    ignored: /(^|[\/\\])\../,
  });

export const watcher = (watcherInstance: FSWatcher, watchDir: string) => {
  watcherInstance.on('all', async (event, filename) => {
    const file = filename.split(path.sep);
    if (file[1] === undefined) {
      return;
    }

    if (event === EVENT_FILE_DELETED) {
      if (file[1] === 'static' && file[2]) {
        await fs.promises.rm(
          path.join(REACT_EMAIL_ROOT, 'public', 'static', file[2]),
        );
        return;
      }

      await fs.promises.rm(path.join(REACT_EMAIL_ROOT, filename));
      return;
    }

    if (file[1] === 'static' && file[2]) {
      const srcPath = path.join(watchDir, 'static', file[2]);
      const result = shell.cp(
        '-r',
        srcPath,
        path.join(REACT_EMAIL_ROOT, 'public', 'static'),
      );
      if (result.code > 0) {
        throw new Error(
          `Something went wrong while copying the file to ${PACKAGE_EMAILS_PATH}, ${result.cat()}`,
        );
      }
      return;
    }

    const result = shell.cp(
      '-r',
      path.join(watchDir, ...file.slice(1)),
      path.join(PACKAGE_EMAILS_PATH, ...file.slice(1, -1)),
    );
    if (result.code > 0) {
      throw new Error(
        `Something went wrong while copying the file to ${PACKAGE_EMAILS_PATH}, ${result.cat()}`,
      );
    }
  });
};
