// import { readFile } from 'node:fs/promises';
import { join, resolve } from 'path';

import chalk from 'chalk';
// import findUp from 'find-up';
import globby from 'globby';
import { assert, boolean, number, object, optional, Infer } from 'superstruct';
import { createServer } from 'vite';

import { CommandFn } from '../types';

const PreviewOptionsStruct = object({
  open: optional(boolean()),
  port: optional(number())
});

type PreviewOptions = Infer<typeof PreviewOptionsStruct>;

// interface PackageJson {
//   dependencies: Record<string, string>;
//   devDependencies: Record<string, string>;
// }

// const { warn } = console;

export const help = chalk`
{blue email preview}

Starts the preview server for a directory of email templates

{underline Usage}
  $ email preview <template dir path> [...options]

{underline Options}
  --no-open   Do not open a browser tab when the preview server starts
  --port      The local port number the preview server should run on. Default: 55420

{underline Examples}
  $ email preview ./src/templates --port 55420
`;

export const command: CommandFn = async (argv: PreviewOptions, input) => {
  if (input.length < 1) return false;

  assert(argv, PreviewOptionsStruct);

  const [target] = input;
  const targetPath = resolve(target);

  // const packagePath = await findUp('package.json', { cwd: targetPath });
  // let deps: string[] = [];

  // if (packagePath) {
  //   const pkg = JSON.parse(await readFile(packagePath, 'utf8')) as PackageJson;
  //   deps = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)];
  // } else {
  //   warn(chalk`No {yellow package.json} file was found. This may impact the preview`);
  // }

  await start(targetPath, argv);
  return true;
};

export const start = async (targetPath: string, argv: PreviewOptions) => {
  const { open = true, port = 55420 } = argv;
  const config = await import('./app/vite.config');
  const componentPaths = await globby(join(targetPath, '/*.{jsx,tsx}'));

  process.env.VITE_EMAIL_COMPONENTS = componentPaths[0];

  const server = await createServer({
    configFile: false,
    ...config.default,
    root: join(__dirname, 'app'),
    server: { port }
  });

  await server.listen();

  // TODO: bind CLI shortcuts. this hasn't landed in Vite yet, will be released with 5.0
  if (open) server.openBrowser();
  server.printUrls();
};
