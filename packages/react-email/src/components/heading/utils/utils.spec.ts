import type { Margin } from './spaces.js';
import { withMargin, withSpace } from './spaces.js';

describe('withMargin', () => {
  it('returns an empty object for empty input', () => {
    const marginProps: Margin = {};
    const result = withMargin(marginProps);
    expect(result).toEqual({});
  });

  it('applies margin to the top', () => {
    const marginProps: Margin = { mt: '10' };
    const result = withMargin(marginProps);
    expect(result).toEqual({ marginTop: '10px' });
  });

  it('applies margin to the left and right', () => {
    const marginProps: Margin = { mx: '20' };
    const result = withMargin(marginProps);
    expect(result).toEqual({ marginLeft: '20px', marginRight: '20px' });
  });

  it('applies margin to the top and bottom', () => {
    const marginProps: Margin = { my: '15' };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      marginBottom: '15px',
      marginTop: '15px',
    });
  });

  it('applies margin to all sides', () => {
    const marginProps: Margin = { m: '25' };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      margin: '25px',
    });
  });

  it('applies margin to specified sides when provided', () => {
    const marginProps: Margin = { mt: '5', mr: '10', mb: '15', ml: '20' };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      marginBottom: '15px',
      marginLeft: '20px',
      marginRight: '10px',
      marginTop: '5px',
    });
  });

  it('ignores invalid margin values', () => {
    const marginProps: Margin = { m: 'invalid', mt: '5', mx: 'valid' };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      marginTop: '5px',
    });
  });
});

describe('withSpace', () => {
  it('returns an empty object for undefined value', () => {
    const result = withSpace(undefined, ['margin']);
    expect(result).toEqual({});
  });

  it('applies space to the specified properties', () => {
    const result = withSpace(15, ['marginTop', 'marginLeft']);
    expect(result).toEqual({ marginTop: '15px', marginLeft: '15px' });
  });

  it('keeps units that are already present in the value', () => {
    expect(withSpace('1.5rem', ['marginTop'])).toEqual({
      marginTop: '1.5rem',
    });
    expect(withSpace('10px', ['marginTop'])).toEqual({ marginTop: '10px' });
    expect(withSpace('10%', ['marginTop'])).toEqual({ marginTop: '10%' });
    expect(withSpace('-2em', ['marginTop'])).toEqual({ marginTop: '-2em' });
  });

  it('appends px to numeric strings and decimals', () => {
    expect(withSpace('10', ['margin'])).toEqual({ margin: '10px' });
    expect(withSpace('0.5', ['margin'])).toEqual({ margin: '0.5px' });
    expect(withSpace(-4, ['margin'])).toEqual({ margin: '-4px' });
    expect(withSpace(0, ['margin'])).toEqual({ margin: '0px' });
  });

  it('supports the auto keyword and multi-value shorthands', () => {
    expect(withSpace('auto', ['marginLeft'])).toEqual({ marginLeft: 'auto' });
    expect(withSpace('0 auto', ['margin'])).toEqual({ margin: '0px auto' });
    expect(withSpace('10px 2rem 5', ['margin'])).toEqual({
      margin: '10px 2rem 5px',
    });
  });

  it('ignores values that are not valid spacing', () => {
    expect(withSpace('10px;color:red', ['margin'])).toEqual({});
    expect(withSpace('', ['margin'])).toEqual({});
    expect(withSpace(Number.NaN, ['margin'])).toEqual({});
    expect(withSpace(Number.POSITIVE_INFINITY, ['margin'])).toEqual({});
  });
});
