import { tree } from './tree.js';

test('tree(__dirname, 2)', async () => {
  expect(await tree(__dirname, 2)).toMatchSnapshot();
});
