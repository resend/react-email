import path from 'node:path';
import { tree } from './tree.js';

test('tree(__dirname, 2)', async () => {
  expect(
    await tree(path.resolve(import.meta.dirname, './preview'), 2),
  ).toMatchSnapshot();
});
