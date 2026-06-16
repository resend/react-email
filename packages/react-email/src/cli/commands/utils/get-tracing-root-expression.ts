import { getPackages } from '@manypkg/get-packages';

/**
 * Returns the JavaScript expression used for `outputFileTracingRoot` and
 * `turbopack.root` inside the generated `.react-email/next.config.mjs`.
 *
 * The generated config defines two location variables:
 *
 * - `userProjectLocation` — the user's project root, which is the parent of the
 *   `.react-email` build folder.
 * - `previewServerLocation` — the `.react-email` build folder itself.
 *
 * Next.js' file tracing (and `@vercel/next` during `vercel build`) expects the
 * tracing root to be the project root, not a subfolder of it. Pointing it at
 * `.react-email` makes every traced server-function path off by the
 * `.react-email` prefix, so `@vercel/next` fails with `ENOENT` on
 * `vercel build`. Using `userProjectLocation` mirrors the monorepo layout that
 * already deploys.
 *
 * @param isInReactEmailMonorepo - whether the CLI runs from the react-email
 *   monorepo (source) rather than from a user's `node_modules`.
 * @param usersProjectLocation - absolute path to the user's project root, used
 *   to resolve the monorepo root in the monorepo case.
 */
export const getTracingRootExpression = async (
  isInReactEmailMonorepo: boolean,
  usersProjectLocation: string,
): Promise<string> => {
  if (isInReactEmailMonorepo) {
    const monorepoRoot = await getPackages(usersProjectLocation).then((p) =>
      p.rootDir.replaceAll('\\', '/'),
    );
    return `'${monorepoRoot}'`;
  }

  return 'userProjectLocation';
};
