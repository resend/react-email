import { type Options, Spinner } from 'cli-spinner';
import logSymbols from 'log-symbols';

let spinnersRunning = [] as OurSpinner[];

process.on('SIGINT', () => {
  for (const spinner of spinnersRunning) {
    spinner.stop(true);
  }
});

Spinner.setDefaultSpinnerString('⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁');

export class OurSpinner extends Spinner {
  title: string | undefined;

  constructor(titleOrOptions: string | Options | undefined) {
    super(titleOrOptions);

    this.title =
      typeof titleOrOptions === 'string'
        ? titleOrOptions
        : titleOrOptions?.text;
  }

  stop(clear?: boolean | undefined): this {
    super.stop(clear);

    spinnersRunning = spinnersRunning.filter((spinner) => spinner !== this);

    return this;
  }

  /**
   * Calls the base spinner's start, but also handles the event
   * for SIGINT stopping the spinner
   */
  start(): this {
    super.start();

    spinnersRunning.push(this);

    return this;
  }

  stopAndPersist(options: { symbol: string; text?: string }) {
    this.stop(true);
    console.info(`${options.symbol} ${options.text || ''}`);
  }

  succeed(text?: string) {
    this.stopAndPersist({
      symbol: logSymbols.success,
      text: text || this.title,
    });
  }
}
