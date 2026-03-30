import { parse, type StyleSheet } from 'css-tree';
import { makeInlineStylesFor } from './make-inline-styles-for';

describe('makeInlineStylesFor()', async () => {
  it('works in simple use case', () => {
    const tailwindStyles = parse(`
      .bg-red-500 { background-color: #f56565; }
      .w-full { width: 100%; }
    `) as StyleSheet;

    expect(
      makeInlineStylesFor(tailwindStyles.children.toArray()),
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
      makeInlineStylesFor(tailwindStyles.children.toArray()),
    ).toMatchInlineSnapshot(`
      {
        "backgroundColor": " #3490dc",
        "borderRadius": "0.25rem",
        "color": " #fff",
        "padding": "0.5rem 1rem",
      }
    `);
  });
});
