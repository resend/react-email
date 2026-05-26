import { generate, parse, type StyleSheet, walk } from 'css-tree';
import { sanitizeStyleSheet } from '../../sanitize-stylesheet.js';
import { setupTailwind } from '../tailwindcss/setup-tailwind.js';
import { isRuleInlinable } from './is-rule-inlinable.js';
import { sanitizeNonInlinableRules } from './sanitize-non-inlinable-rules.js';
import { stripEmptyTailwindVars } from './strip-empty-tailwind-vars.js';

describe('stripEmptyTailwindVars()', () => {
  it('removes empty-fallback var(--tw-*,) refs from declaration values', () => {
    const stylesheet = parse(`
      .tabular-nums {
        font-variant-numeric: var(--tw-ordinal,) var(--tw-slashed-zero,) tabular-nums var(--tw-numeric-fraction,);
      }
    `) as StyleSheet;

    const declaration = stylesheet.children.first!.block!.children.first!;
    stripEmptyTailwindVars(declaration.value);

    expect(generate(declaration.value)).toBe('tabular-nums');
  });

  it('does not remove var() refs with non-empty fallbacks or non --tw- names', () => {
    const stylesheet = parse(`
      .thing {
        line-height: var(--tw-leading, var(--text-lg--line-height));
        color: var(--my-color,);
      }
    `) as StyleSheet;

    const block = stylesheet.children.first!.block!;
    const leading = block.children.first!;
    const color = block.children.last!;

    stripEmptyTailwindVars(leading.value);
    stripEmptyTailwindVars(color.value);

    expect(generate(leading.value)).toBe(
      'var(--tw-leading, var(--text-lg--line-height))',
    );
    expect(generate(color.value)).toBe('var(--my-color,)');
  });

  it('does not remove --tw-* custom property declarations (only var() usages in values)', () => {
    const stylesheet = parse(`
      .print_border-solid {
        @media print {
          --tw-border-style: solid;
          border-style: var(--tw-border-style,);
        }
      }
    `) as StyleSheet;

    const atrule = stylesheet.children.first!.block!.children.first!;
    const twDeclaration = atrule.block!.children.first!;
    const borderDeclaration = atrule.block!.children.last!;

    stripEmptyTailwindVars(borderDeclaration.value);

    expect(twDeclaration.property).toBe('--tw-border-style');
    expect(generate(twDeclaration.value).trim()).toBe('solid');
    expect(generate(borderDeclaration.value)).toBe('');
    expect(generate(stylesheet)).toContain('--tw-border-style: solid');
  });
});

describe('stripEmptyTailwindVars() with non-inlinable print: rules', () => {
  it('print:border-solid still leaves --tw-* declarations if only stripEmptyTailwindVars runs', async () => {
    const tailwind = await setupTailwind({});
    tailwind.addUtilities(['print:border-solid']);
    const stylesheet = tailwind.getStyleSheet();

    sanitizeStyleSheet(stylesheet);

    walkDeclarationsInNonInlinableRules(stylesheet, (declaration) => {
      stripEmptyTailwindVars(declaration.value);
    });

    const result = generate(stylesheet);

    expect(result).not.toMatch(/var\(--tw-[^,()]+,\s*\)/);
    expect(result).toMatch(/--tw-[^:]+:/);
  });

  it('print:border-solid is clean after sanitizeNonInlinableRules removes resolved --tw-* declarations', async () => {
    const tailwind = await setupTailwind({});
    tailwind.addUtilities(['print:border-solid']);
    const stylesheet = tailwind.getStyleSheet();

    sanitizeStyleSheet(stylesheet);
    sanitizeNonInlinableRules(stylesheet);
    const result = generate(stylesheet);

    expect(result).not.toMatch(/var\(--tw-[^,()]+,\s*\)/);
    expect(result).not.toMatch(/--tw-[^:]+:/);
    expect(result).toMatchInlineSnapshot(
      `"/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer theme,base,components,utilities;@layer utilities{.print_border-solid{@media print{border-style:solid!important}}}"`,
    );
  });
});

function walkDeclarationsInNonInlinableRules(
  node: StyleSheet,
  onDeclaration: (declaration: { property: string; value: unknown }) => void,
) {
  walk(node, {
    visit: 'Rule',
    enter(rule) {
      if (!isRuleInlinable(rule)) {
        walk(rule, {
          visit: 'Declaration',
          enter(declaration) {
            onDeclaration(declaration);
          },
        });
      }
    },
  });
}
