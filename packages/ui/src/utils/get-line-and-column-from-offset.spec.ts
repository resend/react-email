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

test('getLineAndColumnFromOffset() counts a CRLF as a single line break', () => {
  const content = 'first line\r\nsecond line\r\nthird line';

  expect(
    getLineAndColumnFromOffset(content.indexOf('second'), content),
  ).toEqual([2, 1]);
  expect(getLineAndColumnFromOffset(content.indexOf('third'), content)).toEqual(
    [3, 1],
  );
  expect(
    getLineAndColumnFromOffset(content.indexOf('line', 12), content),
  ).toEqual([2, 8]);
});

test('getLineAndColumnFromOffset() handles a lone carriage return', () => {
  const content = 'first line\rsecond line';

  expect(
    getLineAndColumnFromOffset(content.indexOf('second'), content),
  ).toEqual([2, 1]);
});

test('getLineAndColumnFromOffset() does not split a CRLF when the offset is between the carriage return and the line feed', () => {
  const content = 'a\r\nb';

  // Offset of the `\n` itself: the CRLF has not been fully passed, so this is
  // still on line 1 rather than being treated as a lone carriage return.
  expect(getLineAndColumnFromOffset(2, content)).toEqual([1, 2]);
  // Offset of `b`, the first character after the CRLF.
  expect(getLineAndColumnFromOffset(3, content)).toEqual([2, 1]);
});
