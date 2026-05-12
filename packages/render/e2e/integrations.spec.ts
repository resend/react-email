import child_process from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
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
      let settled = false;
      const settle = (value: boolean) => {
        if (!settled) {
          settled = true;
          resolve(value);
        }
      };
      const request = http
        .get(url, { timeout: 1000 }, (response) => {
          response.resume();
          settle(
            response.statusCode !== undefined &&
              response.statusCode >= 200 &&
              response.statusCode < 300,
          );
        })
        .on('timeout', () => {
          request.destroy();
          settle(false);
        })
        .on('error', () => {
          settle(false);
        });
    });
  };
  while (Date.now() - start < timeout) {
    if (await isServerUp(url)) {
      return;
    }
    await sleep(100);
  }
  throw new Error(`Server at ${url} did not respond within ${timeout}ms`);
};

const getStatus = async (url: string) => {
  return new Promise<{ body: string; status: number }>((resolve, reject) => {
    http
      .get(url, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          resolve({ body, status: response.statusCode ?? 0 });
        });
      })
      .on('error', reject);
  });
};

const stopWebServer = (child: child_process.ChildProcess | undefined) => {
  if (!child || child.killed) {
    return;
  }

  if (process.platform !== 'win32' && child.pid !== undefined) {
    try {
      process.kill(-child.pid);
      return;
    } catch {}
  }

  child.kill();
};

const startWebServer = async (command: string, url: string, cwd: string) => {
  const output: string[] = [];
  const appendOutput = (source: 'stdout' | 'stderr', chunk: Buffer) => {
    output.push(`[${source}] ${chunk.toString()}`);
    output.splice(0, Math.max(0, output.length - 40));
  };
  const formatOutput = () =>
    output.length === 0
      ? 'No server output was captured.'
      : output.join('').trim();
  const child = child_process.spawn(command, {
    shell: true,
    cwd,
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout?.on('data', (chunk) => appendOutput('stdout', chunk));
  child.stderr?.on('data', (chunk) => appendOutput('stderr', chunk));

  const childExit = new Promise<never>((_, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      reject(
        new Error(
          `Command "${command}" exited before ${url} became available. Exit code: ${code}; signal: ${signal}.\n\n${formatOutput()}`,
        ),
      );
    });
  });

  try {
    await Promise.race([waitForServer(url, 30_000), childExit]);
  } catch (error) {
    stopWebServer(child);
    if (error instanceof Error) {
      throw new Error(`${error.message}\n\n${formatOutput()}`);
    }
    throw error;
  }

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
    await browser.close();
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
          'http://127.0.0.1:3000',
          nextLocation,
        );
      }, 30_000);

      afterAll(async () => {
        stopWebServer(devServer);
      });

      it('works when rendering in node api route', async () => {
        const response = await getStatus('http://127.0.0.1:3000/api');

        if (response.status !== 200) {
          console.log(response.body);
        }
        expect(response.status).toBe(200);
      });

      it.skip('works when rendering in edge api route', async () => {
        const response = await getStatus('http://127.0.0.1:3000/edge');

        if (response.status !== 200) {
          console.log(response.body);
        }
        expect(response.status).toBe(200);
      });

      it('works when rendering in the browser', async () => {
        await page.goto('http://127.0.0.1:3000');

        await expect(() =>
          page.waitForSelector('[data-testid="rendering-error"]', {
            timeout: 1000,
          }),
        ).rejects.toThrow();
        await page.waitForSelector('[data-testid="rendered-html"]', {
          timeout: 1000,
        });
      });
    });

    describe('build', () => {
      let server: child_process.ChildProcess | undefined;

      beforeAll(async () => {
        $('npm run build', nextLocation);
        server = await startWebServer(
          'npm run start',
          'http://127.0.0.1:3001',
          nextLocation,
        );
      }, 50_000);

      afterAll(async () => {
        stopWebServer(server);
      });

      it('works when rendering in node api route', async () => {
        const response = await getStatus('http://127.0.0.1:3001/api');

        if (response.status !== 200) {
          console.log(response.body);
        }
        expect(response.status).toBe(200);
      });

      it.skip('works when rendering in edge api route', async () => {
        const response = await getStatus('http://127.0.0.1:3001/edge');

        if (response.status !== 200) {
          console.log(response.body);
        }
        expect(response.status).toBe(200);
      });

      it('works when rendering in the browser', async () => {
        await page.goto('http://127.0.0.1:3001');

        await expect(() =>
          page.waitForSelector('[data-testid="rendering-error"]', {
            timeout: 1000,
          }),
        ).rejects.toThrow();
        await page.waitForSelector('[data-testid="rendered-html"]', {
          timeout: 1000,
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
    it('works when rendering in vite preview', async () => {
      $('npm run build', viteLocation);
      const previewServer = await startWebServer(
        'npm run preview',
        'http://127.0.0.1:4173',
        viteLocation,
      );
      try {
        await page.goto('http://127.0.0.1:4173');

        await expect(() =>
          page.waitForSelector('[data-testid="rendering-error"]', {
            timeout: 1000,
          }),
        ).rejects.toThrow();
        await page.waitForSelector('[data-testid="rendered-html"]', {
          timeout: 1000,
        });
      } finally {
        stopWebServer(previewServer);
      }
    });

    it('works when rendering in vite dev', async () => {
      const devServer = await startWebServer(
        'npm run dev',
        'http://127.0.0.1:5173',
        viteLocation,
      );
      try {
        await page.goto('http://127.0.0.1:5173');

        await expect(() =>
          page.waitForSelector('[data-testid="rendering-error"]', {
            timeout: 1000,
          }),
        ).rejects.toThrow();
        await page.waitForSelector('[data-testid="rendered-html"]', {
          timeout: 1000,
        });
      } finally {
        stopWebServer(devServer);
      }
    });
  });
});
