import { Ora } from 'ora'

export const closeOraOnSIGNIT = (spinner: Ora) => {
  process.on('SIGINT', function () {
    spinner.stop()
  });
}
