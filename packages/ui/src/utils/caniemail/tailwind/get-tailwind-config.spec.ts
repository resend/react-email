import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import { pixelBasedPreset } from 'react-email';
import { getTailwindConfig } from './get-tailwind-config';

const parseSource = (sourceCode: string) =>
  parse(sourceCode, {
    strictMode: false,
    errorRecovery: true,
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators'],
  });

describe('getTailwindConfig()', () => {
  it('works with email templates that import the tailwind config', async () => {
    const sourcePath = path.resolve(
      __dirname,
      './tests/dummy-email-template.tsx',
    );
    const sourceCode = await fs.readFile(sourcePath, 'utf8');
    const ast = parseSource(sourceCode);

    expect(await getTailwindConfig(sourceCode, ast, sourcePath)).toEqual({
      theme: {},
      presets: [pixelBasedPreset],
    });
  });

  it('works with email templates that define the tailwind config inline as a variable', async () => {
    const sourcePath = path.resolve(
      __dirname,
      './tests/dummy-email-template-inline-config.tsx',
    );
    const sourceCode = await fs.readFile(sourcePath, 'utf8');
    const ast = parseSource(sourceCode);

    expect(await getTailwindConfig(sourceCode, ast, sourcePath)).toEqual({
      theme: {},
      presets: [pixelBasedPreset],
    });
  });

  it('works with email templates that define an empty tailwind config inline as a variable', async () => {
    const sourcePath = path.resolve(
      __dirname,
      './tests/dummy-email-template-empty-config.tsx',
    );
    const sourceCode = await fs.readFile(sourcePath, 'utf8');
    const ast = parseSource(sourceCode);

    expect(await getTailwindConfig(sourceCode, ast, sourcePath)).toEqual({});
  });
});
