import { Writable } from 'node:stream';
import { afterEach, beforeEach } from 'vitest';
import { createSpinner, stopSpinnerAndPersist } from './spinner.js';

const createNonTTYStream = () => {
  const chunks: string[] = [];
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(chunk.toString());
      callback();
    },
  }) as Writable & { isTTY?: boolean };
  stream.isTTY = false;
  return { stream: stream as unknown as NodeJS.WriteStream, chunks };
};

const previousCI = process.env.CI;

beforeEach(() => {
  // Force the non-TTY codepath even if a developer happens to run the test
  // suite on a real TTY where process.stdout.isTTY is true.
  process.env.CI = 'true';
});

afterEach(() => {
  if (previousCI === undefined) {
    delete process.env.CI;
  } else {
    process.env.CI = previousCI;
  }
});

test('non-TTY spinner only logs each unique line once', () => {
  const { stream, chunks } = createNonTTYStream();

  const spinner = createSpinner({
    text: 'Installing dependencies on `.react-email`',
    prefixText: '  ',
    stream,
  });

  spinner.start();
  // simulate the picospinner ticking many times with the same text
  for (let i = 0; i < 20; i += 1) {
    spinner.setText('Installing dependencies on `.react-email`');
  }
  stopSpinnerAndPersist(spinner, {
    text: 'Successfully prepared `.react-email` for `next build`',
    symbol: '✔',
  });

  expect(chunks).toEqual([
    '  Installing dependencies on `.react-email`\n',
    '  ✔ Successfully prepared `.react-email` for `next build`\n',
  ]);
});

test('non-TTY spinner logs each new text exactly once', () => {
  const { stream, chunks } = createNonTTYStream();

  const spinner = createSpinner({
    text: 'Step one',
    prefixText: '  ',
    stream,
  });

  spinner.start();
  spinner.setText('Step two');
  spinner.setText('Step two');
  spinner.setText('Step three');
  spinner.succeed('All done');

  expect(chunks).toEqual([
    '  Step one\n',
    '  Step two\n',
    '  Step three\n',
    '  ✔ All done\n',
  ]);
});

test('non-TTY spinner stops cleanly without crashing', () => {
  const { stream, chunks } = createNonTTYStream();

  const spinner = createSpinner({ text: 'Working', stream });

  spinner.start();
  expect(spinner.running).toBe(true);

  spinner.stop();
  expect(spinner.running).toBe(false);

  // setText after stop should not log anything new
  spinner.setText('Should not be logged');
  expect(chunks).toEqual(['Working\n']);
});

test('non-TTY spinner trims trailing newlines from the rendered text', () => {
  const { stream, chunks } = createNonTTYStream();

  const spinner = createSpinner({
    text: 'Getting things ready...\n',
    prefixText: ' ',
    stream,
  });

  spinner.start();

  expect(chunks).toEqual([' Getting things ready...\n']);
});
