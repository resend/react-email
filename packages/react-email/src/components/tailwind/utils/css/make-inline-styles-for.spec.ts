import { parse, type StyleSheet } from 'css-tree';
import { getCustomProperties } from './get-custom-properties.js';
import { makeInlineStylesFor } from './make-inline-styles-for.js';

describe('makeInlineStylesFor()', async () => {
  it('works in simple use case', () => {
    const tailwindStyles = parse(`
      .bg-red-500 { background-color: #f56565; }
      .w-full { width: 100%; }
    `) as StyleSheet;

    expect(
      makeInlineStylesFor(
        tailwindStyles.children.toArray(),
        getCustomProperties(tailwindStyles),
      ),
    ).toMatchInlineSnapshot(`
      {
        "backgroundColor": "#f56565",
        "width": "100%",
      }
    `);
  });

  it('does basic local variable resolution', () => {
    const tailwindStyles = parse(`
      .btn {
        --btn-bg: #3490dc;
        --btn-text: #fff;
        background-color: var(--btn-bg);
        color: var(--btn-text);
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
      }
    `) as StyleSheet;

    expect(
      makeInlineStylesFor(
        tailwindStyles.children.toArray(),
        getCustomProperties(tailwindStyles),
      ),
    ).toMatchInlineSnapshot(`
      {
        "backgroundColor": "#3490dc",
        "borderRadius": "0.25rem",
        "color": "#fff",
        "padding": "0.5rem 1rem",
      }
    `);
  });

  it('strips Tailwind v4 variant-stacking var() refs with empty fallbacks', () => {
    // Tailwind v4 compiles `tabular-nums` to a font-variant-numeric value
    // where every optional variant slot is represented by an unresolved
    // var(--tw-..., ) with an empty fallback. Email clients do not support
    // CSS custom properties reliably, so these must collapse at inline time
    // (per CSS spec, an empty fallback resolves to empty string).
    const tailwindStyles = parse(`
      .tabular-nums {
        font-variant-numeric: var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) tabular-nums var(--tw-numeric-fraction,);
      }
    `) as StyleSheet;

    expect(
      makeInlineStylesFor(
        tailwindStyles.children.toArray(),
        getCustomProperties(tailwindStyles),
      ),
    ).toMatchInlineSnapshot(`
      {
        "fontVariantNumeric": "tabular-nums",
      }
    `);
  });

  it('preserves user-authored empty-fallback var() refs (non --tw- prefix)', () => {
    // The collapse is scoped to Tailwind's --tw-* variant-stacking idiom.
    // A user-authored var(--my-color,) with an empty fallback must pass
    // through unchanged even though it syntactically matches the idiom --
    // the user opted into that semantic and the render target may define
    // --my-color at a higher scope.
    const userStyles = parse(`
      .thing {
        color: var(--my-color,);
        background: var(--brand,) var(--tw-custom,);
      }
    `) as StyleSheet;

    expect(
      makeInlineStylesFor(
        userStyles.children.toArray(),
        getCustomProperties(userStyles),
      ),
    ).toMatchInlineSnapshot(`
      {
        "background": "var(--brand,)",
        "color": "var(--my-color,)",
      }
    `);
  });
});
