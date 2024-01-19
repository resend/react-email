import type http from 'node:http';
import path from 'node:path';
import { Server as SocketServer, type Socket } from 'socket.io';
import { watch } from 'chokidar';
import debounce from 'debounce';
import type { HotReloadChange } from '../../../utils/types/hot-reload-change';

export const setupHotreloading = (
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

  watcher.on('all', (event, filename) => {
    const file = filename.split(path.sep);
    if (file.length === 0) {
      return;
    }

    changes.push({
      event,
      filename,
    });
    reload();
  });

  return watcher;
};
