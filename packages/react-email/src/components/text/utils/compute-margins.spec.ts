import { computeMargins } from './compute-margins.js';

describe('parseMargins()', () => {
  it('works with numeric and text margins', () => {
    expect(computeMargins({ margin: 24 })).toEqual({
      marginTop: 24,
      marginRight: 24,
      marginBottom: 24,
      marginLeft: 24,
    });

    expect(computeMargins({ margin: '24px' })).toEqual({
      marginTop: '24px',
      marginRight: '24px',
      marginBottom: '24px',
      marginLeft: '24px',
    });

    expect(computeMargins({ margin: '24px', marginTop: 10 })).toEqual({
      marginTop: 10,
      marginRight: '24px',
      marginBottom: '24px',
      marginLeft: '24px',
    });
  });

  it('keeps spaces inside CSS functions in the margin shorthand', () => {
    expect(computeMargins({ margin: 'calc(10px + 2px) 0' })).toEqual({
      marginTop: 'calc(10px + 2px)',
      marginRight: '0',
      marginBottom: 'calc(10px + 2px)',
      marginLeft: '0',
    });

    expect(computeMargins({ margin: 'max(8px, 2vw) auto' })).toEqual({
      marginTop: 'max(8px, 2vw)',
      marginRight: 'auto',
      marginBottom: 'max(8px, 2vw)',
      marginLeft: 'auto',
    });

    expect(
      computeMargins({
        margin: '0 calc(var(--gap) * 2) 4px clamp(1px, 2vw, 3px)',
      }),
    ).toEqual({
      marginTop: '0',
      marginRight: 'calc(var(--gap) * 2)',
      marginBottom: '4px',
      marginLeft: 'clamp(1px, 2vw, 3px)',
    });

    expect(computeMargins({ margin: '  10px\n\t20px  ' })).toEqual({
      marginTop: '10px',
      marginRight: '20px',
      marginBottom: '10px',
      marginLeft: '20px',
    });
  });

  it('computes the margins according to the order of styles', () => {
    expect(
      computeMargins({
        margin: 0,
        marginBottom: '1rem',
      }),
    ).toEqual({
      marginTop: 0,
      marginRight: 0,
      marginLeft: 0,
      marginBottom: '1rem',
    });

    expect(
      computeMargins({
        marginBottom: '1rem',
        margin: 0,
      }),
    ).toEqual({
      marginTop: 0,
      marginRight: 0,
      marginLeft: 0,
      marginBottom: 0,
    });

    expect(
      computeMargins({
        marginTop: '2rem',
        marginLeft: '10px',
        margin: '3em',
        marginRight: '9px',
        marginBottom: '1px',
      }),
    ).toEqual({
      marginTop: '3em',
      marginLeft: '3em',
      marginRight: '9px',
      marginBottom: '1px',
    });
  });
});
