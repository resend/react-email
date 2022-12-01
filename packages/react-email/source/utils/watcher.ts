import chokidar from 'chokidar';
import {
  CLIENT_EMAILS_PATH,
  CURRENT_PATH,
  EVENT_FILE_DELETED,
  PACKAGE_EMAILS_PATH,
  REACT_EMAIL_ROOT,
} from './contants';
import fs from 'fs';
import path from 'path';
import copy from 'cpy';

export const watcher = () =>
  chokidar
    .watch(CURRENT_PATH, { ignoreInitial: true, cwd: CURRENT_PATH })
    .on('all', async (event, filename) => {
      if (event === EVENT_FILE_DELETED) {
        await fs.promises.rm(path.join(REACT_EMAIL_ROOT, filename));
      } else {
        await copy(CLIENT_EMAILS_PATH, PACKAGE_EMAILS_PATH);
      }
    });
