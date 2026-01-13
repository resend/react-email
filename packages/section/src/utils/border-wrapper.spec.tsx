import { render } from '@react-email/render';
import {
  BorderWrapper,
  extractBorderProperties,
  hasBorderAndBorderRadius,
} from './border-wrapper.js';

describe('BorderWrapper utilities', () => {
  describe('hasBorderAndBorderRadius', () => {
    it('should return false when no style is provided', () => {
      expect(hasBorderAndBorderRadius()).toBe(false);
    });

    it('should return false when only border is provided', () => {
      expect(hasBorderAndBorderRadius({ border: '1px solid black' })).toBe(
        false,
      );
    });

    it('should return false when only borderRadius is provided', () => {
      expect(hasBorderAndBorderRadius({ borderRadius: '8px' })).toBe(false);
    });

    it('should return true when both border and borderRadius are provided', () => {
      expect(
        hasBorderAndBorderRadius({
          border: '1px solid black',
          borderRadius: '8px',
        }),
      ).toBe(true);
    });

    it('should detect individual border properties', () => {
      expect(
        hasBorderAndBorderRadius({
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'red',
          borderRadius: '4px',
        }),
      ).toBe(true);
    });

    it('should detect individual border radius properties', () => {
      expect(
        hasBorderAndBorderRadius({
          border: '1px solid blue',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }),
      ).toBe(true);
    });
  });

  describe('extractBorderProperties', () => {
    it('should return null when no style is provided', () => {
      expect(extractBorderProperties()).toBe(null);
    });

    it('should return null when no border properties are present', () => {
      expect(extractBorderProperties({ color: 'red', fontSize: '16px' })).toBe(
        null,
      );
    });

    it('should extract border properties when present', () => {
      const style = {
        border: '2px solid red',
        borderRadius: '8px',
        color: 'blue',
      };

      const result = extractBorderProperties(style);
      expect(result).toEqual({
        border: '2px solid red',
        borderTop: undefined,
        borderRight: undefined,
        borderBottom: undefined,
        borderLeft: undefined,
        borderWidth: undefined,
        borderStyle: undefined,
        borderColor: undefined,
        borderRadius: '8px',
        borderTopLeftRadius: undefined,
        borderTopRightRadius: undefined,
        borderBottomLeftRadius: undefined,
        borderBottomRightRadius: undefined,
      });
    });
  });

  describe('BorderWrapper component', () => {
    it('should render children directly when no border properties are present', async () => {
      const result = await render(
        <BorderWrapper style={{ color: 'red' }}>
          <div>Test content</div>
        </BorderWrapper>,
      );

      expect(result).toContain('<div>Test content</div>');
      expect(result).not.toContain('<table');
    });

    it('should wrap with table when border properties are present', async () => {
      const result = await render(
        <BorderWrapper
          style={{
            border: '1px solid black',
            borderRadius: '8px',
            color: 'red',
          }}
        >
          <div>Test content</div>
        </BorderWrapper>,
      );

      expect(result).toContain('<table');
      expect(result).toContain('background-color:black');
      expect(result).toContain('padding:1');
      expect(result).toContain('border-radius:8px');
      expect(result).toContain('<div>Test content</div>');
    });

    it('should handle individual border properties', async () => {
      const result = await render(
        <BorderWrapper
          style={{
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'red',
            borderRadius: '4px',
            color: 'blue',
          }}
        >
          <div>Test content</div>
        </BorderWrapper>,
      );

      expect(result).toContain('background-color:red');
      expect(result).toContain('padding:2');
      expect(result).toContain('border-radius:4px');
    });

    it('should preserve non-border styles on inner element', async () => {
      const result = await render(
        <BorderWrapper
          style={{
            border: '1px solid black',
            borderRadius: '8px',
            color: 'red',
            fontSize: '16px',
            backgroundColor: 'white',
          }}
        >
          <div>Test content</div>
        </BorderWrapper>,
      );

      expect(result).toContain('color:red');
      expect(result).toContain('font-size:16px');
      expect(result).toContain('background-color:white');
      expect(result).not.toContain('border:1px solid black');
    });
  });
});
