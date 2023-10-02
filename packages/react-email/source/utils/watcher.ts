import chokidar, { FSWatcher } from 'chokidar';
import path from 'path';
import { generateEmailsPreview } from './generate-email-preview';

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
  absoluteEmailsDir: string
) => {
  watcherInstance.on('all', async (_event, filename) => {
    const file = filename.split(path.sep);
    if (file[1] === undefined || file[1] === '.preview') {
      return;
    }

    try {
      await generateEmailsPreview(absoluteEmailsDir);
    } catch (e) {
      throw new Error(
        `Something went wrong when trying to genreate previews for the emails, ${// @ts-expect-error
e?.message}`,
      );
    }
  });
};
