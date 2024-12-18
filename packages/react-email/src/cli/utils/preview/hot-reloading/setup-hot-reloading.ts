import type http from 'node:http';
import path from 'node:path';
import { watch } from 'chokidar';
import debounce from 'debounce';
import { type Socket, Server as SocketServer } from 'socket.io';
import type { HotReloadChange } from '../../../../utils/types/hot-reload-change';
import { createDependencyGraph } from './create-dependency-graph';

export const setupHotreloading = async (
  devServer: http.Server,
  emailDirRelativePath: string,
) => {
  let clients: Socket[] = [];
  const io = new SocketServer(devServer);

  io.on('connection', (client) => {
    clients.push(client);

    client.on('disconnect', () => {
      clients = clients.filter((item) => item !== client);
    });
  });

  // used to keep track of all changes
  // and send them at once to the preview app through the web socket
  let changes = [] as HotReloadChange[];

  const reload = debounce(() => {
    // we detect these using the useHotreload hook on the Next app
    clients.forEach((client) => {
      client.emit('reload', changes);
    });

    changes = [];
  }, 150);

  const absolutePathToEmailsDirectory = path.resolve(
    process.cwd(),
    emailDirRelativePath,
  );

  const [dependencyGraph, updateDependencyGraph, { resolveDependentsOf }] =
    await createDependencyGraph(absolutePathToEmailsDirectory);

  const watcher = watch('', {
    ignoreInitial: true,
    cwd: absolutePathToEmailsDirectory,
  });

  const getFilesOutsideEmailsDirectory = () =>
    Object.keys(dependencyGraph).filter((p) =>
      path.relative(absolutePathToEmailsDirectory, p).startsWith('..'),
    );
  let filesOutsideEmailsDirectory = getFilesOutsideEmailsDirectory();
  // adds in to be watched separately all of the files that are outside of
  // the user's emails directory
  for (const p of filesOutsideEmailsDirectory) {
    watcher.add(p);
  }

  const exit = async () => {
    await watcher.close();
  };
  process.on('SIGINT', exit);
  process.on('uncaughtException', exit);

  watcher.on('all', async (event, relativePathToChangeTarget) => {
    const file = relativePathToChangeTarget.split(path.sep);
    if (file.length === 0) {
      return;
    }
    const pathToChangeTarget = path.resolve(
      absolutePathToEmailsDirectory,
      relativePathToChangeTarget,
    );

    await updateDependencyGraph(event, pathToChangeTarget);

    const newFilesOutsideEmailsDirectory = getFilesOutsideEmailsDirectory();
    // updates the files outside of the user's emails directory by unwatching
    // the inexistant ones and watching the new ones
    //
    // this is necessary to avoid the issue mentioned here https://github.com/resend/react-email/issues/1433#issuecomment-2177515290
    for (const p of filesOutsideEmailsDirectory) {
      if (!newFilesOutsideEmailsDirectory.includes(p)) {
        watcher.unwatch(p);
      }
    }
    for (const p of newFilesOutsideEmailsDirectory) {
      if (!filesOutsideEmailsDirectory.includes(p)) {
        watcher.add(p);
      }
    }
    filesOutsideEmailsDirectory = newFilesOutsideEmailsDirectory;

    changes.push({
      event,
      filename: relativePathToChangeTarget,
    });

    // These dependents are dependents resolved recursively, so even dependents of dependents
    // will be notified of this change so that we ensure that things are updated in the preview.
    for (const dependentPath of resolveDependentsOf(pathToChangeTarget)) {
      changes.push({
        event: 'change' as const,
        filename: path.relative(absolutePathToEmailsDirectory, dependentPath),
      });
    }
    reload();
  });

  return watcher;
};
