import { parse, type StyleSheet } from 'css-tree';
import { inlineStyles } from './inline-styles.js';

describe('inlineStyles()', () => {
  it('inlines a single rule for a class', () => {
    const styleSheet = parse(`
      .box { border-radius: 8px; background-color: white; padding: 16px; }
    `) as StyleSheet;

    expect(inlineStyles(styleSheet, ['box'])).toMatchInlineSnapshot(`
      {
        "backgroundColor": "white",
        "borderRadius": "8px",
        "padding": "16px",
      }
    `);
  });

  it('merges declarations when the same class is defined across multiple rules', () => {
    // Mirrors a Tailwind preset defining `.box` and a child config overriding
    // only one property of the same class. CSS cascade keeps the untouched
    // declarations from the earlier rule and lets the later rule win on
    // conflicting properties.
    const styleSheet = parse(`
      .box { border-radius: 8px; background-color: white; padding: 16px; }
      .box { background-color: red; }
    `) as StyleSheet;

    expect(inlineStyles(styleSheet, ['box'])).toMatchInlineSnapshot(`
      {
        "backgroundColor": "red",
        "borderRadius": "8px",
        "padding": "16px",
      }
    `);
  });
});
