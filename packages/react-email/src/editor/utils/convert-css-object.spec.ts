import { describe, expect, it } from 'vitest';
import { expandShorthandProperties } from './convert-css-object';

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
