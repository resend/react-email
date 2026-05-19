import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import { inlineStyles, sanitizeStyleSheet } from 'react-email';
import { getTailwindMetadata } from './get-tailwind-metadata.js';

const parseFixture = async (fixtureFile: string) => {
  const sourcePath = path.resolve(__dirname, './tests', fixtureFile);
  const sourceCode = await fs.readFile(sourcePath, 'utf8');
  const ast = parse(sourceCode, {
    strictMode: false,
    errorRecovery: true,
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators'],
  });
  return { sourcePath, sourceCode, ast };
};

const styleFor = async (fixtureFile: string, className: string) => {
  const { sourcePath, sourceCode, ast } = await parseFixture(fixtureFile);
  const meta = await getTailwindMetadata(ast, sourceCode, sourcePath);
  if (!meta.hasTailwind) throw new Error('expected hasTailwind=true');

  meta.tailwindSetup.addUtilities([className]);
  const styleSheet = meta.tailwindSetup.getStyleSheet();
  sanitizeStyleSheet(styleSheet);
  return inlineStyles(styleSheet as Parameters<typeof inlineStyles>[0], [
    className,
  ]);
};

describe('caniemail checker sees styles from <Tailwind> CSS props', () => {
  it('resolves theme prop given as an inline string literal', async () => {
    const styles = await styleFor(
      'dummy-email-template-theme-inline.tsx',
      'bg-brand',
    );
    expect(styles).toEqual({ backgroundColor: 'rgb(0,255,0)' });
  });

  it('resolves theme prop given as a string variable reference', async () => {
    const styles = await styleFor(
      'dummy-email-template-theme-variable.tsx',
      'bg-brand',
    );
    expect(styles).toEqual({ backgroundColor: 'rgb(0,255,0)' });
  });

  it('resolves theme prop given as a ?inline CSS file import', async () => {
    const styles = await styleFor(
      'dummy-email-template-theme-import.tsx',
      'bg-brand',
    );
    expect(styles).toEqual({ backgroundColor: 'rgb(0,255,0)' });
  });
});
