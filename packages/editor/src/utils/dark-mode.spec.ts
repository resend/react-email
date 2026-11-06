import { protectButtonColors } from './dark-mode';

describe('protectButtonColors', () => {
  it('nudges pure black backgrounds off #000 and pins a lighter label', () => {
    expect(
      protectButtonColors({ backgroundColor: '#000', color: '#ffffff' }),
    ).toEqual({
      backgroundColor: '#010101',
      color: '#ffffff',
      WebkitTextFillColor: '#ffffff',
    });
    expect(
      protectButtonColors({ backgroundColor: 'rgb(0, 0, 0)', color: '#000' }),
    ).toEqual({ backgroundColor: '#010101', color: '#000' });
  });

  it('pins a light label on a colored background', () => {
    expect(
      protectButtonColors({ backgroundColor: '#2563eb', color: '#fff' }),
    ).toMatchObject({
      backgroundColor: '#2563eb',
      WebkitTextFillColor: '#fff',
    });
  });

  it('leaves dark labels, translucent or unknown backgrounds, and images alone', () => {
    const untouched = [
      { backgroundColor: '#ffffff', color: '#111111' },
      { backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' },
      { backgroundColor: '#00000080', color: '#fff' },
      { backgroundColor: 'rgba(0, 0, 0, 1.2.3)', color: '#fff' },
      { backgroundColor: 'black', color: '#fff' },
      { color: '#fff' },
    ];
    for (const style of untouched) {
      expect(protectButtonColors(style)).toBe(style);
    }
    expect(
      protectButtonColors({
        backgroundColor: '#123456',
        color: '#fff',
        backgroundImage: 'url(a.png)',
      }),
    ).not.toHaveProperty('WebkitTextFillColor');
  });
});
