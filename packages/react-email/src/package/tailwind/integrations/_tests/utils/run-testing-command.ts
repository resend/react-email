import path from 'node:path';
import shell from 'shelljs';

/**
 * Just a function that runs `shell.exec` and expects it returns code 0, i.e. expects command not to fail
 *
 * Defaults the CWD to the @react-email/tailwind project's directory
 */
export const $ = (
  command: string,
  cwd: string = path.resolve(__dirname, '..'),
) => {
  expect(
    shell.exec(command, { cwd, fatal: true }).code,
    `Expected command "${command}" to work properly but it returned a non-zero exit code`,
  ).toBe(0);
};
