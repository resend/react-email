import { spawnSync } from 'node:child_process';
import path from 'node:path';

const $ = (command: string, cwd: string = path.resolve(__dirname, '..')) => {
  process.stderr.write(`${cwd} $ ${command}\n`);
  const returns = spawnSync(command, {
    shell: true,
    cwd,
    stdio: 'inherit',
  });
  expect(
    returns.status,
    `Expected command "${command}" to work properly but it returned a non-zero exit code`,
  ).toBe(0);
};

describe('integrations', { timeout: 15_000 }, () => {
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
