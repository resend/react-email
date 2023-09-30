import { Ora } from 'ora';

const spinenrsToStop: Ora[] = [];
let hasSetSigintEvent: boolean = false;

/**
  * @description Stops spinner when pressing "Ctrl + C" or "CMD + C"
  */
export const closeOraOnSIGNIT = (spinner: Ora) => {
  spinenrsToStop.push(spinner);
  if (!hasSetSigintEvent) {
    process.on('SIGINT', () => {
      spinenrsToStop.forEach(spinner => spinner.stopAndPersist());
    });
    hasSetSigintEvent = true;
  }
};
