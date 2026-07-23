import { parsePreviewPropsJson } from './parse-preview-props-json';

describe('parsePreviewPropsJson()', () => {
  it('parses a JSON object', () => {
    expect(
      parsePreviewPropsJson('{ "userName": "alan", "itemCount": 3 }'),
    ).toEqual({
      value: { userName: 'alan', itemCount: 3 },
    });
  });

  it('parses an empty object', () => {
    expect(parsePreviewPropsJson('{}')).toEqual({ value: {} });
  });

  it('rejects valid JSON that is not an object', () => {
    for (const text of ['[1, 2]', 'null', '3', '"props"', 'true']) {
      expect(parsePreviewPropsJson(text)).toEqual({
        error: 'Props must be a JSON object',
      });
    }
  });

  it('returns the syntax error message for malformed JSON', () => {
    const result = parsePreviewPropsJson('{ "userName": ');
    expect(result).toHaveProperty('error');
    expect((result as { error: string }).error).not.toHaveLength(0);
  });
});
