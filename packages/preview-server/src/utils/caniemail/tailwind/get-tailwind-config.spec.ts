import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import { pixelBasedPreset } from '@react-email/components';
import { getTailwindConfig } from './get-tailwind-config';

describe('getTailwindConfig()', () => {
  it('works with email templates that import the tailwind config', async () => {
    const sourcePath = path.resolve(
      __dirname,
      './tests/dummy-email-template.tsx',
    );
    const sourceCode = await fs.readFile(sourcePath, 'utf8');
    const ast = parse(sourceCode, {
      strictMode: false,
      errorRecovery: true,
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'decorators'],
    });

    expect(await getTailwindConfig(sourceCode, ast, sourcePath)).toEqual({
      theme: {},
      presets: [pixelBasedPreset],
    });
  });
});
