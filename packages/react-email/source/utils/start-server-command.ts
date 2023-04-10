import { ChildProcess } from 'child_process';
import shell from 'shelljs';

let processesToKill: ChildProcess[] = [];

function execAsync(command: string) {
  const process = shell.exec(command, { async: true });
  processesToKill.push(process);
  process.on('close', () => {
    processesToKill = processesToKill.filter((p) => p !== process);
  });
}

export const startDevServer = (packageManager: string, port: string) => {
  execAsync(`${packageManager} run dev -- -p ${port}`);
};

export const startProdServer = (packageManager: string, port: string) => {
  execAsync(`${packageManager} run start -- -p ${port}`);
};

export const buildProdServer = (packageManager: string) => {
  execAsync(`${packageManager} run build`);

  // if build fails for whatever reason, make sure the shell actually exits
  process.on('close', (code) => {
    shell.exit(code ?? undefined);
  });
};

// based on https://stackoverflow.com/a/14032965
function exitHandler() {
  if (processesToKill.length > 0) {
    console.log('shutting down %d subprocesses', processesToKill.length);
  }
  processesToKill.forEach((p) => {
    if (p.connected) {
      p.kill();
    }
  });
}

// do something when app is closing
process.on('exit', exitHandler);

// catches ctrl+c event
process.on('SIGINT', exitHandler);

//  catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

// catches uncaught exceptions
process.on('uncaughtException', exitHandler);
