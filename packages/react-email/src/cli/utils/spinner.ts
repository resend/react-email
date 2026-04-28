import {
  type DisplayOptions,
  type Formatter,
  Spinner as PicoSpinner,
  type SpinnerOptions,
} from 'picospinner';

type SpinnerDisplay =
  | string
  | (DisplayOptions & {
      prefixText?: string;
      stream?: NodeJS.WriteStream;
    });

type PersistDisplay = DisplayOptions & {
  symbol: string;
};

export type Spinner = PicoSpinner;

const withPrefixText = (
  prefixText: string | undefined,
  symbolFormatter: Formatter | undefined,
) => {
  if (typeof prefixText === 'undefined') {
    return symbolFormatter;
  }

  return (symbol: string) =>
    `${prefixText}${symbolFormatter?.(symbol) ?? symbol}`;
};

const normalizeDisplay = (display: SpinnerDisplay): DisplayOptions | string => {
  if (typeof display === 'string') {
    return display;
  }

  const { prefixText, stream, symbolFormatter, ...spinnerDisplay } = display;
  void stream;

  return {
    ...spinnerDisplay,
    symbolFormatter: withPrefixText(prefixText, symbolFormatter),
  };
};

export const createSpinner = (
  display: SpinnerDisplay,
  options?: SpinnerOptions,
) => new PicoSpinner(normalizeDisplay(display), options);

export const stopSpinnerAndPersist = (
  spinner: Spinner | undefined,
  display: PersistDisplay,
) => {
  spinner?.setDisplay(display);
};
