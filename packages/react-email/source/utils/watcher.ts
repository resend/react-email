import chokidar from 'chokidar';
import {
  CLIENT_EMAILS_PATH,
  CURRENT_PATH,
  EVENT_FILE_DELETED,
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

      if (file[1] === 'static' && file[2]) {
        await fs.promises.rm(
          path.join(REACT_EMAIL_ROOT, 'public', 'static', file[2]),
        );
        return;
      }

      await fs.promises.rm(path.join(REACT_EMAIL_ROOT, filename));
    } else {
      const file = filename.split(path.sep);

      if (file[1] === 'static' && file[2]) {
        await copy(
          `${CLIENT_EMAILS_PATH}/static/${file[2]}`,
          `${REACT_EMAIL_ROOT}/public/static`,
        );
        return;
      }

      await copy(
        path.join(CURRENT_PATH, filename),
        path.join(REACT_EMAIL_ROOT, file.slice(0, -1).join(path.sep)),
      );
    }
  });
