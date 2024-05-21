import type http from 'node:http';
import path from 'node:path';
import { Server as SocketServer, type Socket } from 'socket.io';
import { watch } from 'chokidar';
import debounce from 'debounce';
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

  const watcher = watch(emailDirRelativePath, {
    ignoreInitial: true,
    cwd: path.resolve(process.cwd()),
    // eslint-disable-next-line prefer-named-capture-group
    ignored: /(^|[/\\])\../,
  });

  const exit = () => {
    void watcher.close();
  };
  process.on('SIGINT', exit);
  process.on('uncaughtException', exit);

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
  const [dependencyGraph, updateDependencyGraph] = await createDependencyGraph(
    absolutePathToEmailsDirectory,
  );

  const resolveDependentsOf = (pathToChangeTarget: string) => {
    const moduleEntry = dependencyGraph[pathToChangeTarget];
    const dependentPaths: Array<string> = [];

    if (moduleEntry) {
      for (const dependentPath of moduleEntry.dependentPaths) {
        const dependentsOfDependent = resolveDependentsOf(dependentPath);
        dependentPaths.push(...dependentsOfDependent);
        dependentPaths.push(dependentPath);
      }
    }

    return dependentPaths;
  };

  watcher.on('all', async (event, relativePathToChangeTarget) => {
    const file = relativePathToChangeTarget.split(path.sep);
    if (file.length === 0) {
      return;
    }
    const pathToChangeTarget = path.resolve(
      process.cwd(),
      relativePathToChangeTarget,
    );
    await updateDependencyGraph(event, pathToChangeTarget);

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
