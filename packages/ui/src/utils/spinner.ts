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

export interface Spinner {
  readonly running: boolean;
  start(): void;
  stop(): void;
  setText(text: string): void;
  setDisplay(display: DisplayOptions): void;
  succeed(display?: string | DisplayOptions): void;
  fail(display?: string | DisplayOptions): void;
}

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

// Animated spinners only render correctly on a TTY, where ANSI cursor
// movement codes can overwrite the previous frame. On non-TTY streams (CI
// logs, files, pipes) every frame would otherwise be appended verbatim,
// spamming the output.
const isInteractiveStream = (stream: NodeJS.WriteStream): boolean => {
  if (!stream.isTTY) return false;
  if (process.env.TERM === 'dumb') return false;
  if (process.env.CI) return false;
  return true;
};

class NonInteractiveSpinner implements Spinner {
  running = false;

  private text = '';
  private prefixText = '';
  private readonly stream: NodeJS.WriteStream;
  private lastLoggedLine: string | undefined;

  constructor(display: SpinnerDisplay) {
    if (typeof display === 'string') {
      this.text = display;
      this.stream = process.stdout;
    } else {
      this.text = display.text ?? '';
      this.prefixText = display.prefixText ?? '';
      this.stream = display.stream ?? process.stdout;
    }
  }

  start(): void {
    this.running = true;
    this.log();
  }

  stop(): void {
    this.running = false;
  }

  setText(text: string): void {
    this.text = text;
    if (this.running) {
      this.log();
    }
  }

  setDisplay(display: DisplayOptions & { symbol?: string }): void {
    if (typeof display.text === 'string') {
      this.text = display.text;
    }
    const { symbol } = display;
    this.log(symbol);
    if (typeof symbol === 'string') {
      this.running = false;
    }
  }

  succeed(display?: string | DisplayOptions): void {
    this.finish('✔', display);
  }

  fail(display?: string | DisplayOptions): void {
    this.finish('✖', display);
  }

  private finish(symbol: string, display?: string | DisplayOptions): void {
    if (typeof display === 'string') {
      this.text = display;
    } else if (typeof display?.text === 'string') {
      this.text = display.text;
    }
    this.log(symbol);
    this.running = false;
  }

  private log(symbol?: string): void {
    const symbolPrefix =
      typeof symbol === 'string' && symbol.length > 0 ? `${symbol} ` : '';
    const trimmedText = this.text.replace(/\n+$/, '');
    const line = `${this.prefixText}${symbolPrefix}${trimmedText}`;
    if (line === this.lastLoggedLine) return;
    this.lastLoggedLine = line;
    this.stream.write(`${line}\n`);
  }
}

export const createSpinner = (
  display: SpinnerDisplay,
  options?: SpinnerOptions,
): Spinner => {
  const stream =
    (typeof display !== 'string' && display.stream) || process.stdout;
  if (!isInteractiveStream(stream)) {
    return new NonInteractiveSpinner(display);
  }
  return new PicoSpinner(normalizeDisplay(display), options);
};

export const stopSpinnerAndPersist = (
  spinner: Spinner | undefined,
  display: PersistDisplay,
) => {
  spinner?.setDisplay(display);
};
