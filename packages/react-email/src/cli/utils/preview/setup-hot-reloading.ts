import type http from 'node:http';
import path from 'node:path';
import { Server as SocketServer, type Socket } from 'socket.io';
import chokidar from 'chokidar';

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

  const reload = () => {
    // we detect these using the useHotreload hook on the Next app
    clients.forEach((client) => {
      client.emit('reload');
    });
  };

  const watcher = chokidar.watch(emailDirRelativePath, {
    ignoreInitial: true,
    cwd: path.resolve(process.cwd()),
    ignored: /(^|[/\\])\../,
  });

  const exit = () => {
    void watcher.close();
  };
  process.on('SIGINT', exit);
  process.on('uncaughtException', exit);

  watcher.on('all', (_event, filename) => {
    const file = filename.split(path.sep);
    if (file.length === 0) {
      return;
    }

    reload();
  });

  return watcher;
};
