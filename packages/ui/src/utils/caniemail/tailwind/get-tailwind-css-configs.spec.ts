import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import { inlineStyles, sanitizeStyleSheet } from 'react-email';
import { getTailwindCSSConfigs } from './get-tailwind-config.js';
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

const cssConfigsFor = async (fixtureFile: string) => {
  const { sourcePath, sourceCode, ast } = await parseFixture(fixtureFile);
  return getTailwindCSSConfigs(sourceCode, ast, sourcePath);
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

describe('getTailwindCSSConfigs', () => {
  describe('theme prop', () => {
    it('extracts an inline string literal', async () => {
      const cfg = await cssConfigsFor('dummy-email-template-theme-inline.tsx');
      expect(cfg.theme).toContain('--color-brand: #00ff00');
      expect(cfg.utility).toBeUndefined();
    });

    it('extracts a string variable reference', async () => {
      const cfg = await cssConfigsFor(
        'dummy-email-template-theme-variable.tsx',
      );
      expect(cfg.theme).toContain('--color-brand: #00ff00');
      expect(cfg.utility).toBeUndefined();
    });

    it('extracts a ?inline CSS file import', async () => {
      const cfg = await cssConfigsFor('dummy-email-template-theme-import.tsx');
      expect(cfg.theme).toContain('--color-brand: #00ff00');
      expect(cfg.utility).toBeUndefined();
    });
  });

  describe('utility prop', () => {
    it('extracts an inline string literal', async () => {
      const cfg = await cssConfigsFor(
        'dummy-email-template-utility-inline.tsx',
      );
      expect(cfg.utility).toContain('.badge');
      expect(cfg.theme).toBeUndefined();
    });

    it('extracts a string variable reference', async () => {
      const cfg = await cssConfigsFor(
        'dummy-email-template-utility-variable.tsx',
      );
      expect(cfg.utility).toContain('.badge');
      expect(cfg.theme).toBeUndefined();
    });

    it('extracts a ?inline CSS file import', async () => {
      const cfg = await cssConfigsFor(
        'dummy-email-template-utility-import.tsx',
      );
      expect(cfg.utility).toContain('.badge');
      expect(cfg.theme).toBeUndefined();
    });
  });

  it('returns {} when neither theme nor utility is set', async () => {
    const cfg = await cssConfigsFor('dummy-email-template.tsx');
    expect(cfg).toEqual({});
  });

  it('returns both theme and utility when set together', async () => {
    const cfg = await cssConfigsFor('dummy-email-template-combined.tsx');
    expect(cfg.theme).toContain('--color-brand: #00ff00');
    expect(cfg.utility).toContain('.badge');
  });

  it('warns and returns {} when the expression cannot be resolved', async () => {
    const warnings: unknown[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args);
    };
    try {
      const cfg = await cssConfigsFor('dummy-email-template-unresolvable.tsx');
      expect(cfg).toEqual({});
      expect(warnings.length).toBeGreaterThan(0);
    } finally {
      console.warn = originalWarn;
    }
  });
});

describe('caniemail integration: styles produced by theme/utility reach the checker', () => {
  it('compiles theme tokens into resolved Tailwind classes', async () => {
    const styles = await styleFor(
      'dummy-email-template-theme-inline.tsx',
      'bg-brand',
    );
    expect(styles).toEqual({ backgroundColor: 'rgb(0,255,0)' });
  });

  it('compiles custom utility classes', async () => {
    const styles = await styleFor(
      'dummy-email-template-utility-inline.tsx',
      'badge',
    );
    expect(styles).toMatchObject({
      background: expect.stringContaining('254'),
    });
  });

  it('combines config, theme, and utility together', async () => {
    const themeStyles = await styleFor(
      'dummy-email-template-combined.tsx',
      'bg-brand',
    );
    expect(themeStyles).toEqual({ backgroundColor: 'rgb(0,255,0)' });

    const configStyles = await styleFor(
      'dummy-email-template-combined.tsx',
      'bg-primary',
    );
    expect(configStyles).toEqual({ backgroundColor: 'rgb(255,0,0)' });

    const utilityStyles = await styleFor(
      'dummy-email-template-combined.tsx',
      'badge',
    );
    expect(utilityStyles).toMatchObject({
      background: expect.stringContaining('254'),
    });
  });
});
