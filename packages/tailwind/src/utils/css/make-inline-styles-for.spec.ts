import { parse, type StyleSheet } from 'css-tree';
import { makeInlineStylesFor } from './make-inline-styles-for';

test('makeInlineStylesFor()', async () => {
  const tailwindStyles = parse(`
    .bg-red-500 { background-color: #f56565; }
    .w-full { width: 100%; }
  `) as StyleSheet;

  expect(
    makeInlineStylesFor(tailwindStyles.children.toArray()),
  ).toMatchSnapshot();
});
