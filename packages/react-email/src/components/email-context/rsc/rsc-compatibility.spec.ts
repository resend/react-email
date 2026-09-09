import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const packageRoot = path.resolve(__dirname, '../../../..');

test('email contexts propagate when rendering with the RSC flight renderer', {
  timeout: 30_000,
}, async () => {
  const scriptLocation = path.join(
    'src',
    'components',
    'email-context',
    'rsc',
    'render-with-flight.tsx',
  );
  const { stdout } = await promisify(execFile)(
    process.execPath,
    ['--conditions=react-server', '--import=tsx/esm', scriptLocation],
    {
      cwd: packageRoot,
      env: {
        ...process.env,
        // In development, flight payloads include debug metadata that
        // repeats component props, which would trip up the script's
        // assertion that the private context prop never gets rendered.
        NODE_ENV: 'production',
      },
    },
  );

  expect(stdout).toContain('flight rendering worked correctly');
});
