import { existsSync } from 'node:fs';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { basename, extname, join, resolve } from 'path';

import { render } from '@jsx-email/render';
import chalk from 'chalk';
import { load } from 'cheerio';
import esbuild from 'esbuild';
import globby from 'globby';
import { minify as terser } from 'html-minifier-terser';
import beautify from 'js-beautify';
import { assert, boolean, object, optional, string, Infer } from 'superstruct';

import { CommandFn, TemplateFn } from './types';

const { error, log } = console;

const BuildOptionsStruct = object({
  minify: optional(boolean()),
  out: optional(string()),
  plain: optional(boolean()),
  props: optional(string()),
  strip: optional(boolean())
});

type BuildOptions = Infer<typeof BuildOptionsStruct>;

export const help = chalk`
{blue email build}

Builds a template and saves the result

{underline Usage}
  $ email build <template path> [...options]

{underline Options}
  --minify      Minify the rendered template before saving
  --no-strip    Prevents stripping data-id attributes from output
  --out         File path to save the rendered template
  --plain       Emit template as plain text
  --props       A JSON string containing props to be passed to the email template
                This is usually only useful when building a single template, unless all of your
                templates share the same props.

{underline Examples}
  $ email build ./src/templates/Invite.tsx
  $ email build ./src/templates/Invite.tsx --props='\{"batman": "Bruce Wayne"\}'
`;

const pretty = (html: string) => {
  const defaults = {
    indent_char: ' ',
    indent_inner_html: true,
    indent_size: 2,
    sep: '\n',
    unformatted: ['code', 'pre', 'em', 'strong', 'span']
  };

  return beautify.html(html, defaults);
};

const stripHtml = (html: string) => {
  const $ = load(html);

  $('*').removeAttr('data-id');

  return $.html()!;
};

const build = async (path: string, argv: BuildOptions) => {
  const { minify, out, plain, props = {}, strip = true } = argv;
  const template = await import(path);
  const componentExport: TemplateFn = template.Template || template.default;
  const extension = plain ? '.txt' : '.html';

  if (!componentExport) {
    error(`${path} does not contain a named \`Template\` or default export of a JSX Element`);
    process.exit(1);
  }

  const component = componentExport(props);
  const writePath = join(out!, basename(path).replace(extname(path), extension));

  if (plain) {
    const plainText = render(component, { plainText: plain });
    await writeFile(writePath, plainText, 'utf8');
    return;
  }

  let html = render(component);
  if (strip) html = stripHtml(html);
  if (minify) html = await terser(html);
  else html = pretty(html);

  await mkdir(out!, { recursive: true });
  await writeFile(writePath, html, 'utf8');
};

const compile = async (files: string[], outDir: string) => {
  await esbuild.build({
    bundle: true,
    entryPoints: files,
    logLevel: 'error',
    outdir: outDir,
    platform: 'node',
    write: true
  });

  return globby([join(outDir, '*.js')]);
};

export const command: CommandFn = async (argv: BuildOptions, input) => {
  if (input.length < 1) return false;

  const [target] = input;
  const tmpdir = await realpath(os.tmpdir());
  const esbuildOutPath = join(tmpdir, 'jsx-email', Date.now().toString());

  if (!(await existsSync(target))) {
    error(`The provided build target '${target}' does not exist`);
    process.exit(1);
  }

  assert(argv, BuildOptionsStruct);

  // Note: niave check that will probably get us into some edge cases
  const isFile = target.endsWith('.tsx') || target.endsWith('.jsx');
  const { out = '.rendered' } = argv;
  const glob = isFile ? target : join(target, '*.{jsx,tsx}');
  const targetFiles = await globby([glob]);
  const outputPath = resolve(out);

  log('Found', targetFiles.length, 'files:');
  log('  ', targetFiles.join('\n  '));
  log('\nStarting build...');

  const compiledFiles = await compile(targetFiles, esbuildOutPath);

  await Promise.all(compiledFiles.map((filePath) => build(filePath, { ...argv, out: outputPath })));

  log('\nBuild complete. Files written to:', outputPath);

  return true;
};
