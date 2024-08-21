import type { Ora } from 'ora';

const spinners = new Set<Ora>();

process.on('SIGINT', () => {
  spinners.forEach((spinner) => {
    if (spinner.isSpinning) {
      spinner.stop();
    }
  });
});

export const closeOraOnSIGNIT = (spinner: Ora) => {
  spinners.add(spinner);
};
