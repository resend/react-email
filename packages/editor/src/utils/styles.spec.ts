import {
  expandShorthandProperties,
  inlineCssToJs,
  jsToInlineCss,
  resolveConflictingStyles,
} from './styles.js';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

describe('resolveConflictingStyles', () => {
  describe('basic functionality', () => {
    it('should merge reset styles with inline styles', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = { color: 'red' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        color: 'red',
      });
    });

    it('should allow inline styles to override expanded reset styles', () => {
      const resetStyles = { margin: '0' };
      const inlineStyles = { marginTop: '10px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
      });
    });
  });

  describe('margin conflicts', () => {
    it('should resolve margin auto centering conflict', () => {
      const resetStyles = { margin: '0' };
      const inlineStyles = { marginLeft: 'auto', marginRight: 'auto' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
      });
    });

    it('should allow partial margin overrides', () => {
      const resetStyles = { margin: '0' };
      const inlineStyles = { marginTop: '20px', marginBottom: '20px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '20px',
        marginRight: '0',
        marginBottom: '20px',
        marginLeft: '0',
      });
    });

    it('should handle margin with multiple values in reset', () => {
      const resetStyles = { margin: '10px 20px' };
      const inlineStyles = { marginLeft: 'auto' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '20px',
        marginBottom: '10px',
        marginLeft: 'auto',
      });
    });
  });

  describe('padding conflicts', () => {
    it('should resolve padding conflicts', () => {
      const resetStyles = { padding: '0' };
      const inlineStyles = { paddingTop: '15px', paddingBottom: '15px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        paddingTop: '15px',
        paddingRight: '0',
        paddingBottom: '15px',
        paddingLeft: '0',
      });
    });

    it('should handle padding with multiple values in reset', () => {
      const resetStyles = { padding: '5px 10px' };
      const inlineStyles = { paddingLeft: '20px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        paddingTop: '5px',
        paddingRight: '10px',
        paddingBottom: '5px',
        paddingLeft: '20px',
      });
    });
  });

  describe('mixed properties', () => {
    it('should handle both margin and padding conflicts', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: '10px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
        paddingTop: '10px',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
      });
    });

    it('should preserve non-spacing properties from both sources', () => {
      const resetStyles = {
        margin: '0',
        padding: '0',
        fontSize: '16px',
      };
      const inlineStyles = {
        marginTop: '10px',
        color: 'blue',
        backgroundColor: 'white',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        fontSize: '16px',
        color: 'blue',
        backgroundColor: 'white',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty inline styles', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {};

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
      });
    });

    it('should handle reset styles without shorthand properties', () => {
      const resetStyles = { fontSize: '16px', lineHeight: '1.5' };
      const inlineStyles = { color: 'red' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        fontSize: '16px',
        lineHeight: '1.5',
        color: 'red',
      });
    });

    it('should handle inline styles overriding non-spacing properties', () => {
      const resetStyles = { margin: '0', fontSize: '16px' };
      const inlineStyles = { fontSize: '20px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        fontSize: '20px',
      });
    });
  });

  describe('real-world email scenarios', () => {
    it('should handle centered button with margin auto', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '24px',
        paddingRight: '24px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
        paddingTop: '12px',
        paddingRight: '24px',
        paddingBottom: '12px',
        paddingLeft: '24px',
      });
    });

    it('should handle section with custom spacing', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {
        paddingTop: '20px',
        paddingBottom: '20px',
        marginTop: '10px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '20px',
        paddingRight: '0',
        paddingBottom: '20px',
        paddingLeft: '0',
      });
    });

    it('should handle complex reset with multiple properties', () => {
      const resetStyles = {
        margin: '0',
        padding: '0',
        fontSize: '16px',
        lineHeight: '1.5',
        fontWeight: 400,
      };
      const inlineStyles = {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: '18px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        fontSize: '18px',
        lineHeight: '1.5',
        fontWeight: 400,
      });
    });
  });
});

describe('jsToInlineCss', () => {
  it('should convert a simple style object to inline CSS', () => {
    expect(jsToInlineCss({ color: 'red' })).toBe('color:red;');
  });

  it('should convert camelCase keys to kebab-case', () => {
    expect(jsToInlineCss({ backgroundColor: 'blue' })).toBe(
      'background-color:blue;',
    );
    expect(jsToInlineCss({ fontSize: '16px' })).toBe('font-size:16px;');
    expect(jsToInlineCss({ borderTopLeftRadius: '4px' })).toBe(
      'border-top-left-radius:4px;',
    );
  });

  it('should join multiple properties with semicolons', () => {
    expect(jsToInlineCss({ color: 'red', fontSize: '16px' })).toBe(
      'color:red;font-size:16px;',
    );
  });

  it('should return an empty string for an empty object', () => {
    expect(jsToInlineCss({})).toBe('');
  });

  it('should filter out undefined values', () => {
    expect(jsToInlineCss({ color: undefined })).toBe('');
  });

  it('should filter out null values', () => {
    expect(jsToInlineCss({ color: null })).toBe('');
  });

  it('should filter out empty string values', () => {
    expect(jsToInlineCss({ color: '' })).toBe('');
  });

  // Meant to avoid https://github.com/resend/resend/pull/8030#discussion_r2789386279, but we're unsure if this is actually bug
  // it('should keep 0 as a valid CSS value', () => {
  //   expect(jsToInlineCss({ margin: 0 })).toBe('margin:0;');
  //   expect(jsToInlineCss({ padding: 0 })).toBe('padding:0;');
  //   expect(jsToInlineCss({ border: 0 })).toBe('border:0;');
  //   expect(jsToInlineCss({ opacity: 0 })).toBe('opacity:0;');
  //   expect(jsToInlineCss({ top: 0 })).toBe('top:0;');
  //   expect(jsToInlineCss({ left: 0 })).toBe('left:0;');
  //   expect(jsToInlineCss({ borderRadius: 0 })).toBe('border-radius:0;');
  //   expect(jsToInlineCss({ fontSize: 0 })).toBe('font-size:0;');
  // });

  it('should keep non-zero numeric values', () => {
    expect(jsToInlineCss({ lineHeight: 1.5 })).toBe('line-height:1.5;');
    expect(jsToInlineCss({ zIndex: 10 })).toBe('z-index:10;');
  });

  it('should handle a mix of valid and filtered-out values', () => {
    expect(
      jsToInlineCss({
        color: 'red',
        margin: 0,
        padding: undefined,
        fontSize: '14px',
        border: null,
        display: '',
      }),
    ).toBe('color:red;font-size:14px;');
  });

  it('should handle keys that are already lowercase', () => {
    expect(jsToInlineCss({ display: 'flex', color: 'green' })).toBe(
      'display:flex;color:green;',
    );
  });
});

describe('inlineCssToJs', () => {
  it('should return an empty object for an empty string', () => {
    expect(inlineCssToJs('')).toEqual({});
  });

  it('should return an empty object for undefined input', () => {
    expect(inlineCssToJs(undefined as unknown as string)).toEqual({});
  });

  it('should return an empty object for an object input', () => {
    expect(inlineCssToJs({} as unknown as string)).toEqual({});
  });

  it('should parse a single CSS property', () => {
    expect(inlineCssToJs('color: red')).toEqual({ color: 'red' });
  });

  it('should parse multiple CSS properties', () => {
    expect(inlineCssToJs('color: red; font-size: 16px')).toEqual({
      color: 'red',
      fontSize: '16px',
    });
  });

  it('should handle a trailing semicolon', () => {
    expect(inlineCssToJs('color: red;')).toEqual({ color: 'red' });
  });

  it('should convert kebab-case to camelCase', () => {
    expect(inlineCssToJs('background-color: blue')).toEqual({
      backgroundColor: 'blue',
    });
  });

  it('should convert multi-hyphen properties to camelCase', () => {
    expect(inlineCssToJs('border-top-left-radius: 4px')).toEqual({
      borderTopLeftRadius: '4px',
    });
  });

  it('should trim whitespace around keys and values', () => {
    expect(inlineCssToJs('  color : red ;  font-size : 14px  ')).toEqual({
      color: 'red',
      fontSize: '14px',
    });
  });

  it('should skip properties with no value', () => {
    expect(inlineCssToJs('color:')).toEqual({});
  });

  it('should skip properties with only whitespace as value', () => {
    expect(inlineCssToJs('color:   ')).toEqual({});
  });

  describe('removeUnit option', () => {
    it('should remove px units when removeUnit is true', () => {
      expect(inlineCssToJs('width: 100px', { removeUnit: true })).toEqual({
        width: '100',
      });
    });

    it('should remove % units when removeUnit is true', () => {
      expect(inlineCssToJs('width: 50%', { removeUnit: true })).toEqual({
        width: '50',
      });
    });

    it('should remove multiple units in one value when removeUnit is true', () => {
      expect(inlineCssToJs('margin: 10px 20px', { removeUnit: true })).toEqual({
        margin: '10 20',
      });
    });

    it('should not remove units when removeUnit is false', () => {
      expect(inlineCssToJs('width: 100px', { removeUnit: false })).toEqual({
        width: '100px',
      });
    });

    it('should not remove units by default', () => {
      expect(inlineCssToJs('width: 100px')).toEqual({
        width: '100px',
      });
    });
  });
});

describe('expandShorthandProperties', () => {
  describe('margin shorthand expansion', () => {
    it('should expand single value margin to all sides', () => {
      const result = expandShorthandProperties({ margin: '0' });
      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
      });
    });

    it('should expand two value margin (vertical horizontal)', () => {
      const result = expandShorthandProperties({ margin: '10px 20px' });
      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '20px',
        marginBottom: '10px',
        marginLeft: '20px',
      });
    });

    it('should expand three value margin (top horizontal bottom)', () => {
      const result = expandShorthandProperties({ margin: '10px 20px 30px' });
      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '20px',
        marginBottom: '30px',
        marginLeft: '20px',
      });
    });

    it('should expand four value margin (top right bottom left)', () => {
      const result = expandShorthandProperties({
        margin: '10px 20px 30px 40px',
      });
      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '20px',
        marginBottom: '30px',
        marginLeft: '40px',
      });
    });

    it('should handle margin with auto values', () => {
      const result = expandShorthandProperties({ margin: '0 auto' });
      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
      });
    });

    it('should handle numeric margin values', () => {
      const result = expandShorthandProperties({ margin: '0' });
      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
      });
    });
  });

  describe('padding shorthand expansion', () => {
    it('should expand single value padding to all sides', () => {
      const result = expandShorthandProperties({ padding: '0' });
      expect(result).toEqual({
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
      });
    });

    it('should expand two value padding (vertical horizontal)', () => {
      const result = expandShorthandProperties({ padding: '10px 20px' });
      expect(result).toEqual({
        paddingTop: '10px',
        paddingRight: '20px',
        paddingBottom: '10px',
        paddingLeft: '20px',
      });
    });

    it('should expand three value padding (top horizontal bottom)', () => {
      const result = expandShorthandProperties({ padding: '10px 20px 30px' });
      expect(result).toEqual({
        paddingTop: '10px',
        paddingRight: '20px',
        paddingBottom: '30px',
        paddingLeft: '20px',
      });
    });

    it('should expand four value padding (top right bottom left)', () => {
      const result = expandShorthandProperties({
        padding: '10px 20px 30px 40px',
      });
      expect(result).toEqual({
        paddingTop: '10px',
        paddingRight: '20px',
        paddingBottom: '30px',
        paddingLeft: '40px',
      });
    });

    it('should handle numeric padding values', () => {
      const result = expandShorthandProperties({ padding: '0' });
      expect(result).toEqual({
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
      });
    });
  });

  describe('border radius longhand handling', () => {
    it('should preserve a single border radius corner', () => {
      const result = expandShorthandProperties({
        borderTopLeftRadius: '8px',
      });
      expect(result).toEqual({
        borderTopLeftRadius: '8px',
      });
    });

    it('should preserve two different border radius corners', () => {
      const result = expandShorthandProperties({
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '4px',
      });
      expect(result).toEqual({
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '4px',
      });
    });

    it('should preserve three border radius corners without collapsing', () => {
      const result = expandShorthandProperties({
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '8px',
      });
      expect(result).toEqual({
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '8px',
      });
    });

    it('should preserve all four corners when they differ', () => {
      const result = expandShorthandProperties({
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '16px',
      });
      expect(result).toEqual({
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '16px',
      });
    });

    it('should add borderRadius shorthand when all four corners are identical', () => {
      const result = expandShorthandProperties({
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      });
      expect(result).toEqual({
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        borderRadius: '8px',
      });
    });

    it('should preserve border radius corners alongside other properties', () => {
      const result = expandShorthandProperties({
        borderTopLeftRadius: '8px',
        borderBottomRightRadius: '4px',
        margin: '0',
        color: 'red',
      });
      expect(result).toEqual({
        borderTopLeftRadius: '8px',
        borderBottomRightRadius: '4px',
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        color: 'red',
      });
    });
  });

  describe('mixed properties', () => {
    it('should expand both margin and padding', () => {
      const result = expandShorthandProperties({
        margin: '0',
        padding: '10px 20px',
      });
      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '10px',
        paddingRight: '20px',
        paddingBottom: '10px',
        paddingLeft: '20px',
      });
    });

    it('should preserve longhand properties alongside shorthand', () => {
      const result = expandShorthandProperties({
        margin: '0',
        paddingTop: '10px',
        color: 'red',
      });
      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '10px',
        color: 'red',
      });
    });

    it('should preserve non-spacing properties', () => {
      const result = expandShorthandProperties({
        margin: '0',
        fontSize: '16px',
        color: 'blue',
        backgroundColor: 'white',
      });
      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        fontSize: '16px',
        color: 'blue',
        backgroundColor: 'white',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty object', () => {
      const result = expandShorthandProperties({});
      expect(result).toEqual({});
    });

    it('should handle null input', () => {
      const result = expandShorthandProperties(null as any);
      expect(result).toEqual({});
    });

    it('should handle undefined input', () => {
      const result = expandShorthandProperties(undefined as any);
      expect(result).toEqual({});
    });

    it('should skip undefined values', () => {
      const result = expandShorthandProperties({
        margin: undefined as any,
        padding: '10px',
      });
      expect(result).toEqual({
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
      });
    });

    it('should skip null values', () => {
      const result = expandShorthandProperties({
        margin: null as any,
        padding: '10px',
      });
      expect(result).toEqual({
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
      });
    });

    it('should handle extra whitespace in shorthand values', () => {
      const result = expandShorthandProperties({ margin: '  10px   20px  ' });
      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '20px',
        marginBottom: '10px',
        marginLeft: '20px',
      });
    });
  });

  describe('real-world scenarios', () => {
    it('should handle the margin auto centering case', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = { marginLeft: 'auto', marginRight: 'auto' };

      const expandedReset = expandShorthandProperties(resetStyles);
      const merged = { ...expandedReset, ...inlineStyles };

      expect(merged).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
      });
    });

    it('should allow specific padding overrides', () => {
      const resetStyles = { padding: '0' };
      const inlineStyles = { paddingTop: '20px', paddingBottom: '20px' };

      const expandedReset = expandShorthandProperties(resetStyles);
      const merged = { ...expandedReset, ...inlineStyles };

      expect(merged).toEqual({
        paddingTop: '20px',
        paddingRight: '0',
        paddingBottom: '20px',
        paddingLeft: '0',
      });
    });

    it('should handle complex reset styles with multiple properties', () => {
      const resetStyles = {
        margin: '0',
        padding: '0',
        fontSize: '16px',
        lineHeight: '1.5',
      };

      const result = expandShorthandProperties(resetStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        fontSize: '16px',
        lineHeight: '1.5',
      });
    });
  });
});
