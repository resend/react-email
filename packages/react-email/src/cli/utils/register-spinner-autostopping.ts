import type { Spinner } from './spinner.js';

const spinners = new Set<Spinner>();

process.on('SIGINT', () => {
  spinners.forEach((spinner) => {
    if (spinner.running) {
      spinner.stop();
    }
  });
});

process.on('exit', (code) => {
  if (code !== 0) {
    spinners.forEach((spinner) => {
      if (spinner.running) {
        spinner.fail();
      }
    });
  }
});

export const registerSpinnerAutostopping = (spinner: Spinner) => {
  spinners.add(spinner);
};
