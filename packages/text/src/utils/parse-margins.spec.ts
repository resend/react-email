import { parseMargin } from "./parse-margins";

describe('parseMargins()', () => {
  it('should give priority for constituent properties', () => {
    expect(parseMargin({
      margin: 0,
      marginBottom: '1rem'
    })).toEqual({
      mt: 0,
      mr: 0,
      ml: 0,
      mb: '1rem'
    });
  });
});
