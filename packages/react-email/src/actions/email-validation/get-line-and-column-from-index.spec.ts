import { getLineAndColumnFromIndex } from './get-line-and-column-from-index';

test('getLineAndColumnFromIndex()', () => {
  const code = `import { SomethingElse } from 'somewhere';

const myConstant = 'what';

const MyComponent = () => {
  return <SomethingElse>
    <div>
      <a>Hello World!</a>{' '}
      {myConstant}
    </div>
  </SomethingElse>;
}`;
  const [line, column] = getLineAndColumnFromIndex(
    code,
    code.indexOf('Hello World!'),
  );
  expect(line).toBe(8);
  expect(column).toBe(10);
});
