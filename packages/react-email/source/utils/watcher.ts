import chokidar from 'chokidar';
import {
  CLIENT_EMAILS_PATH,
  CURRENT_PATH,
  EVENT_FILE_DELETED,
  PACKAGE_EMAILS_PATH,
  REACT_EMAIL_ROOT,
} from './constants';
import fs from 'fs';
import path from 'path';
import copy from 'cpy';

export const watcherInstance = chokidar.watch(CLIENT_EMAILS_PATH, {
  ignoreInitial: true,
  cwd: CURRENT_PATH,
  ignored: /(^|[\/\\])\../,
});

export const watcher = () =>
  watcherInstance.on('all', async (event, filename) => {
    if (event === EVENT_FILE_DELETED) {
      const file = filename.split(path.sep);

      if (file[1] === 'static') {
        if (file[2]) {
          await fs.promises.rm(
            path.join(REACT_EMAIL_ROOT, 'public', 'static', file[2]),
          );
          return;
        }
      }

      await fs.promises.rm(path.join(REACT_EMAIL_ROOT, filename));
    } else {
      const file = filename.split(path.sep);

      if (file[1] === 'static') {
        await copy(
          `${CLIENT_EMAILS_PATH}/static/${file[2]}`,
          `${REACT_EMAIL_ROOT}/public/static`,
        );
        return;
      }

      await copy(`${CLIENT_EMAILS_PATH}/${file[1]}`, PACKAGE_EMAILS_PATH);
    }
  });
