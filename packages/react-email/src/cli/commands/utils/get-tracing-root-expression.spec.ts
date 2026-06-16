import { getTracingRootExpression } from './get-tracing-root-expression.js';

describe('getTracingRootExpression', () => {
  test('uses the user project location when running from node_modules', async () => {
    const expression = await getTracingRootExpression(
      false,
      '/home/user/project',
    );

    // Must be the project root variable, not `previewServerLocation` (the
    // `.react-email` subfolder), otherwise `vercel build` fails with ENOENT
    // because traced paths are off by the `.react-email` prefix.
    expect(expression).toBe('userProjectLocation');
    expect(expression).not.toBe('previewServerLocation');
  });

  test('resolves to the monorepo root when running from source', async () => {
    const { getPackages } = await import('@manypkg/get-packages');
    const monorepoRoot = (await getPackages(process.cwd())).rootDir.replaceAll(
      '\\',
      '/',
    );

    const expression = await getTracingRootExpression(true, process.cwd());

    // In the monorepo the expression is the resolved absolute path to the repo
    // root, single-quoted and with backslashes normalised to forward slashes.
    expect(expression).toBe(`'${monorepoRoot}'`);
  });
});
