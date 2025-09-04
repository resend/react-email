import { parse } from 'css-tree';
import { populateParentsForNodeTree } from './populate-parents-for-node-tree';

test('populateParentsForNodeTree', () => {
  const ast = parse(`
    .foo { color: red; }
    .bar { background: blue; }

    @media (min-width: 600px) {
      .baz { margin: 10px; }
    }

    .qux:hover { 
      @media (hover: hover) {
        padding: 5px; 
      }
    }
  `);

  populateParentsForNodeTree(ast);

  expect(ast).toMatchSnapshot();
});
