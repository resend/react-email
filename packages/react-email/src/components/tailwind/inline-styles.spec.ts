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

  it("keeps a class's own cascade order when its rules are split by another class", () => {
    // The two `.box` rules are interleaved with an unrelated `.other` rule.
    // Collecting `.box`'s rules must not reorder them relative to the
    // stylesheet, so the later `.box` declaration still wins.
    const styleSheet = parse(`
      .box { color: red; }
      .other { font-weight: bold; }
      .box { color: blue; }
    `) as StyleSheet;

    expect(inlineStyles(styleSheet, ['box', 'other'])).toMatchInlineSnapshot(`
      {
        "color": "blue",
        "fontWeight": "bold",
      }
    `);
  });
});
