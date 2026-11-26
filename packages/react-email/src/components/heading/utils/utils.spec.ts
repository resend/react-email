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

  it('passes through values that already carry a unit', () => {
    expect(withMargin({ mt: '1.5rem' })).toEqual({ marginTop: '1.5rem' });
    expect(withMargin({ m: '10%' })).toEqual({ margin: '10%' });
    expect(withMargin({ mb: '10px' })).toEqual({ marginBottom: '10px' });
  });

  it('passes through auto and multi-value shorthands', () => {
    expect(withMargin({ m: 'auto' })).toEqual({ margin: 'auto' });
    expect(withMargin({ m: '0 auto' })).toEqual({ margin: '0px auto' });
    expect(withMargin({ m: '10px 20px' })).toEqual({ margin: '10px 20px' });
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

  it('appends px to numeric strings', () => {
    expect(withSpace('10', ['margin'])).toEqual({ margin: '10px' });
    expect(withSpace('-5', ['marginTop'])).toEqual({ marginTop: '-5px' });
  });

  it('emits values with units unchanged', () => {
    expect(withSpace('1.5rem', ['marginTop'])).toEqual({ marginTop: '1.5rem' });
    expect(withSpace('10px', ['margin'])).toEqual({ margin: '10px' });
    expect(withSpace('10%', ['margin'])).toEqual({ margin: '10%' });
  });

  it('emits auto and multi-value shorthands unchanged', () => {
    expect(withSpace('auto', ['margin'])).toEqual({ margin: 'auto' });
    expect(withSpace('0 auto', ['margin'])).toEqual({ margin: '0px auto' });
  });

  it('appends px to each unitless number in a shorthand', () => {
    expect(withSpace('0 10', ['margin'])).toEqual({ margin: '0px 10px' });
    expect(withSpace('10 20', ['margin'])).toEqual({ margin: '10px 20px' });
    expect(withSpace('10 1.5rem auto -5', ['margin'])).toEqual({
      margin: '10px 1.5rem auto -5px',
    });
  });

  it('only accepts multiple values for the margin shorthand', () => {
    expect(withSpace('0 auto', ['marginLeft', 'marginRight'])).toEqual({});
    expect(withSpace('10 20', ['marginTop'])).toEqual({});
  });

  it('drops a shorthand with more than four values', () => {
    expect(withSpace('1 2 3 4 5', ['margin'])).toEqual({});
  });

  it('returns an empty object for values that are not CSS lengths', () => {
    expect(withSpace('invalid', ['margin'])).toEqual({});
    expect(withSpace('10 px', ['margin'])).toEqual({});
    expect(withSpace('', ['margin'])).toEqual({});
  });
});
