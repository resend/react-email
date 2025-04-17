import { computeMargins } from './compute-margins';

describe('parseMargins()', () => {
  it('should compute the margins according to the order of styles', () => {
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
