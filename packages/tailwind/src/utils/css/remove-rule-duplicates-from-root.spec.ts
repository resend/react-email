import { generate, parse, type StyleSheet } from 'css-tree';
import { removeRuleDuplicatesFromRoot } from './remove-rule-duplicates-from-root';

test('removeRuleDuplicatesFromRoot', () => {
  const stylesheet = parse(`
    .a { color: red; }
    .b { color: blue; }
    .a { color: green; }
  `);

  removeRuleDuplicatesFromRoot(stylesheet as StyleSheet);

  expect(generate(stylesheet)).toMatchSnapshot();
});
