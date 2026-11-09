// Fixture for the `--esbuild-plugins` option: rewrites a marker in template sources.
export default [
  {
    name: 'replace-marker',
    setup(build) {
      build.onLoad({ filter: /vercel-invite-user\.tsx$/ }, async (args) => {
        const { readFile } = await import('node:fs/promises');
        const contents = await readFile(args.path, 'utf8');
        return {
          contents: contents.replaceAll('on Vercel', 'on Resend'),
          loader: 'tsx',
        };
      });
    },
  },
];
