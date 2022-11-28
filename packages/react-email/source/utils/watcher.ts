import chokidar from 'chokidar';
import {
  CLIENT_EMAILS_PATH,
  CURRENT_PATH,
  DOT_EMAIL_DEV,
  EVENT_FILE_DELETED,
  PACKAGE_EMAILS_PATH,
} from './contants';
import fs from 'fs';
import path from 'path';
import copy from 'cpy';

export const watcher = () =>
  chokidar
    .watch(CURRENT_PATH, { ignoreInitial: true, cwd: CURRENT_PATH })
    .on('all', async (event, filename) => {
      if (event === EVENT_FILE_DELETED) {
        await fs.promises.rm(path.join(DOT_EMAIL_DEV, filename));
      } else {
        await copy(CLIENT_EMAILS_PATH, PACKAGE_EMAILS_PATH);
      }
    });
