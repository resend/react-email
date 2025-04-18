import path from 'node:path';
import child_process from 'node:child_process';
import * as playwright from 'playwright';
import shell from 'shelljs';

const $ = (command: string, cwd: string = path.resolve(__dirname, '..')) => {
  const executionResult = shell.exec(command, {
    cwd,
    fatal: true,
    silent: true,
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
  let page!: playwright.Page;
  let browser!: playwright.Browser;

  beforeAll(async () => {
    const packageLocation = path.resolve(import.meta.dirname, '../');
    $('yalc installations clean @react-email/render', packageLocation);
    $('yalc publish', packageLocation);

    browser = await playwright.chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    browser.close();
  });

  describe('vite', () => {
    let devServer: child_process.ChildProcess;
    beforeAll(async () => {
      const viteLocation = path.resolve(import.meta.dirname, './vite/');
      $('npm install', viteLocation);
      devServer = child_process.spawn('npm', ['run', 'dev'], {
        shell: true,
        cwd: viteLocation,
        stdio: 'pipe',
      });
      const waitForServer = async (url: string, timeout: number) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
          try {
            await page.goto(url, { timeout: 1000 });
            return;
          } catch (e) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
        throw new Error(`Server at ${url} did not respond within ${timeout}ms`);
      };

      await waitForServer('http://localhost:5173', 1000);
    });

    afterAll(() => {
      devServer.kill();
    });

    it('should not error when rendering', async () => {
      await expect(() =>
        page.waitForSelector('[data-testid="rendered-error"]', {
          timeout: 500,
        }),
      ).rejects.toThrow();
      await page.waitForSelector('[data-testid="rendered-html"]', {
        timeout: 500,
      });
    });
  });
});
