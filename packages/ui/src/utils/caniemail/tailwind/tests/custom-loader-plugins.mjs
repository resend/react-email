// Fixture for the `--esbuild-plugins` option: loads `.custom` files as text.
export default [
  {
    name: 'custom-loader',
    setup(build) {
      build.onLoad({ filter: /\.custom$/ }, async (args) => {
        const { readFile } = await import('node:fs/promises');
        return {
          contents: await readFile(args.path, 'utf8'),
          loader: 'text',
        };
      });
    },
  },
];
