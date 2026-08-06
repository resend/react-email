import {
  isPaddingClassName,
  splitPaddingClassNames,
  splitPaddingStyles,
} from './split-padding-props.js';

describe('isPaddingClassName', () => {
  it.each([
    'p-4',
    'px-9',
    'py-2',
    'pt-1',
    'pr-2',
    'pb-3',
    'pl-4',
    'ps-2',
    'pe-2',
    'max-sm:px-5',
    'sm:p-4',
    'md:pt-[10px]',
    // react-email Tailwind often rewrites ":" to "_"
    'max-sm_px-5',
    'sm_p-4',
  ])('detects padding utility %s', (cls) => {
    expect(isPaddingClassName(cls)).toBe(true);
  });

  it.each([
    'bg-red-500',
    'text-center',
    'max-sm:bg-black',
    'w-full',
    'm-4',
  ])('rejects non-padding utility %s', (cls) => {
    expect(isPaddingClassName(cls)).toBe(false);
  });
});

describe('splitPaddingStyles', () => {
  it('moves padding keys to tdStyle and the rest to tableStyle', () => {
    const { tdStyle, tableStyle } = splitPaddingStyles({
      padding: 16,
      paddingTop: 8,
      backgroundColor: 'red',
      maxWidth: '37.5em',
    });
    expect(tdStyle).toEqual({ padding: 16, paddingTop: 8 });
    expect(tableStyle).toEqual({
      backgroundColor: 'red',
      maxWidth: '37.5em',
    });
  });
});

describe('splitPaddingClassNames', () => {
  it('routes padding and media-query padding classes to the td', () => {
    const { tdClassName, tableClassName } = splitPaddingClassNames(
      'px-9 max-sm:px-5 bg-white max-sm_px-5',
    );
    expect(tdClassName?.split(/\s+/).sort()).toEqual(
      ['max-sm:px-5', 'max-sm_px-5', 'px-9'].sort(),
    );
    expect(tableClassName).toBe('bg-white');
  });

  it('returns undefined parts when empty', () => {
    expect(splitPaddingClassNames(undefined)).toEqual({
      tdClassName: undefined,
      tableClassName: undefined,
    });
    expect(splitPaddingClassNames('')).toEqual({
      tdClassName: undefined,
      tableClassName: undefined,
    });
  });
});
