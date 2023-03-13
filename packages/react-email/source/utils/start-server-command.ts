import shell from 'shelljs';

export const startDevServer = (packageManager: string, port: string) => {
  shell.exec(`${packageManager} run dev -p ${port}`, { async: true });
};
