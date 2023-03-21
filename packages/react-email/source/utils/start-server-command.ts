import shell from 'shelljs';

export const startDevServer = (packageManager: string, port: string) => {
  shell.exec(`${packageManager} run dev -- -p ${port}`, { async: true });
};

export const startProdServer = (packageManager: string, port: string) => {
  shell.exec(`${packageManager} run start -- -p ${port}`, { async: true });
};

export const buildProdServer = (packageManager: string) => {
  const process = shell.exec(`${packageManager} run build`, { async: true });

  // if build fails for whatever reason, make sure the shell actually exits
  process.on('close', (code) => {
    shell.exit(code ?? undefined);
  });
};
