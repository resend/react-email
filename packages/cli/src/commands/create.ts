import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'path';

import chalk from 'chalk';
import mustache from 'mustache';
import { assert, boolean, object, optional, string, Infer } from 'superstruct';

import { CommandFn } from './types';

const { log } = console;

const CreateOptionsStruct = object({
  minify: optional(boolean()),
  out: optional(string()),
  plain: optional(boolean()),
  props: optional(string()),
  strip: optional(boolean())
});

type CreateOptions = Infer<typeof CreateOptionsStruct>;

export const help = chalk`
{blue email create}

Creates a new jsx-email template

{underline Usage}
  $ email create <template name> [...options]

{underline Options}
  --out   The directory to create the new template in. Defaults to the current directory.

{underline Examples}
  $ email create invite
  $ email create invite --out=src/assets
`;

export const command: CommandFn = async (argv: CreateOptions, input) => {
  if (input.length < 1) return false;

  assert(argv, CreateOptionsStruct);

  const [name] = input;
  const { out } = argv;
  const template = await readFile(join(__dirname, '../assets/email.tsx.mustache'), 'utf8');
  const newContent = mustache.render(template, { name });
  const outPath = resolve(join(out || process.cwd(), '/templates'));
  const outFile = `${name}.tsx`;

  log('Creating a new template at', outPath);

  await mkdir(outPath, { recursive: true });
  await writeFile(join(outPath, outFile), newContent);

  log(`Template ${outFile} created`);

  return true;
};
