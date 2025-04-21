import child_process from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
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

const waitForServer = async (url: string, timeout: number) => {
  const start = Date.now();
  const isServerUp = (url: string) => {
    return new Promise<boolean>((resolve) => {
      http
        .get(url, { timeout: 100 }, (response) => {
          if (
            response.statusCode &&
            response.statusCode >= 200 &&
            response.statusCode < 300
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .on('timeout', () => {
          resolve(false);
        })
        .on('error', () => {
          resolve(false);
        });
    });
  };
  while (Date.now() - start < timeout) {
    if (await isServerUp(url)) {
      return;
    }
  }
  throw new Error(`Server at ${url} did not respond within ${timeout}ms`);
};

const startWebServer = async (command: string, url: string, cwd: string) => {
  const argsv = command.split(' ');
  const child = child_process.spawn(argsv[0], argsv.slice(1), {
    shell: true,
    cwd,
    stdio: 'pipe',
  });

  process.on('exit', () => {
    child.kill();
  });

  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });

  await waitForServer(url, 15_000);

  return child;
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

  describe('nextjs', () => {
    const nextLocation = path.resolve(import.meta.dirname, './nextjs/');

    beforeAll(() => {
      $('npm install', nextLocation);
    }, 30_000);

    describe('dev', () => {
      let devServer: child_process.ChildProcess | undefined;

      beforeAll(async () => {
        devServer = await startWebServer(
          'npm run dev',
          'http://localhost:3000',
          nextLocation,
        );
      }, 20_000);

      afterAll(async () => {
        devServer?.kill();
      });

      it('should not error when rendering in node api route', async () => {
        const response = await fetch('http://localhost:3000/api');

        if (response.status !== 200) {
          console.log(await response.text());
        }
        expect(response.status).toBe(200);
      });

      it('should not error when rendering in edge api route', async () => {
        const response = await fetch('http://localhost:3000/edge');

        if (response.status !== 200) {
          console.log(await response.text());
        }
        expect(response.status).toBe(200);
      });

      it('should not error when rendering in the browser', async () => {
        await page.goto('http://localhost:3000');

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

    describe('build', () => {
      let server: child_process.ChildProcess | undefined;

      beforeAll(async () => {
        $('npm run build', nextLocation);
        server = await startWebServer(
          'npm run start',
          'http://localhost:3001',
          nextLocation,
        );
      }, 50_000);

      afterAll(async () => {
        server?.kill();
      });

      it('should not error when rendering in node api route', async () => {
        const response = await fetch('http://localhost:3001/api');

        if (response.status !== 200) {
          console.log(await response.text());
        }
        expect(response.status).toBe(200);
      });

      it('should not error when rendering in edge api route', async () => {
        const response = await fetch('http://localhost:3001/edge');

        if (response.status !== 200) {
          console.log(await response.text());
        }
        expect(response.status).toBe(200);
      });

      it('should not error when rendering in the browser', async () => {
        await page.goto('http://localhost:3001');

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

  describe('vite', () => {
    const viteLocation = path.resolve(import.meta.dirname, './vite/');

    beforeAll(() => {
      $('npm install', viteLocation);
    }, 30_000);

    // The code being run after build has been modified by Vite and might run differently
    it('should not error when rendering in vite preview', async () => {
      $('npm run build', viteLocation);
      const previewServer = await startWebServer(
        'npm run preview',
        'http://localhost:4173',
        viteLocation,
      );
      await page.goto('http://localhost:4173');

      await expect(() =>
        page.waitForSelector('[data-testid="rendered-error"]', {
          timeout: 500,
        }),
      ).rejects.toThrow();
      await page.waitForSelector('[data-testid="rendered-html"]', {
        timeout: 500,
      });

      previewServer.kill();
    });

    it('should not error when rendering in vite dev', async () => {
      const devServer = await startWebServer(
        'npm run dev',
        'http://localhost:5173',
        viteLocation,
      );
      await page.goto('http://localhost:5173');

      await expect(() =>
        page.waitForSelector('[data-testid="rendered-error"]', {
          timeout: 500,
        }),
      ).rejects.toThrow();
      await page.waitForSelector('[data-testid="rendered-html"]', {
        timeout: 500,
      });

      devServer.kill();
    });
  });
});
