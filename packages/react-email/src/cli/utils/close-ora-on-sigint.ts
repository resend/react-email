import type { Ora } from 'ora';

export const closeOraOnSIGNIT = (spinner: Ora) => {
  process.on('SIGINT', () => {
    spinner.stop();
  });
};
