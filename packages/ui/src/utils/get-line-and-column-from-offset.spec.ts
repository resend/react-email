import { getLineAndColumnFromOffset } from './get-line-and-column-from-offset';

test('getLineAndColumnFromOffset()', () => {
  const content = `export default function MyEmail() {
  return <div className="testing classes to make sure this is not removed" id="my-div" aria-label="my beautiful div">
    inside the div, should also stay unchanged
  </div>;
}`;
  const offset = content.indexOf('className');
  expect(getLineAndColumnFromOffset(offset, content)).toEqual([2, 15]);
});
