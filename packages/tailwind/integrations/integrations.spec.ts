import path from 'node:path';
import shell from 'shelljs';

const $ = (command: string, cwd: string = path.resolve(__dirname, '..')) => {
  console.info(`${cwd} $ ${command}`);
  const executionResult = shell.exec(command, {
    cwd,
    fatal: true,
  });
  if (executionResult.code !== 0) {
    process.stdout.write(executionResult.stderr);
    process.stderr.write(executionResult.stderr);
  }
  expect(
    executionResult.code,
    `Expected command "${command}" to work properly but it returned a non-zero exit code`,
  ).toBe(0);
};

describe('integrations', () => {
  beforeAll(() => {
    const packageLocation = path.resolve(__dirname, '../');
    $('yalc installations clean @react-email/tailwind', packageLocation);
    $('yalc publish', packageLocation);
  });

  const integrationsLocation = __dirname;

  test("Tailwind works on the Next App's build process", () => {
    const nextAppLocation = path.resolve(integrationsLocation, 'nextjs');
    $('npm install', nextAppLocation);
    $('npm run build', nextAppLocation);
  });

  test("Tailwind works on the Vite App's build process", () => {
    const viteAppLocation = path.resolve(integrationsLocation, 'vite');
    $('npm install', viteAppLocation);
    $('npm run build', viteAppLocation);
  });
});
