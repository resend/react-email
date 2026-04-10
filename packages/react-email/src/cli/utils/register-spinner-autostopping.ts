import logSymbols from 'log-symbols';
import type { Ora } from 'ora';

const spinners = new Set<Ora>();

process.on('SIGINT', () => {
  spinners.forEach((spinner) => {
    if (spinner.isSpinning) {
      spinner.stop();
    }
  });
});

process.on('exit', (code) => {
  if (code !== 0) {
    spinners.forEach((spinner) => {
      if (spinner.isSpinning) {
        spinner.stopAndPersist({
          symbol: logSymbols.error,
        });
      }
    });
  }
});

export const registerSpinnerAutostopping = (spinner: Ora) => {
  spinners.add(spinner);
};
