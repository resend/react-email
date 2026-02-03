import { describe, expect, it } from 'vitest';
import type { PanelGroup } from '@/types/editor/styles';
import { transformToCssJs } from './css-transforms';

describe('transformToCssJs', () => {
  it('returns empty object for non-array input', () => {
    const result = transformToCssJs(null as any);
    expect(result).toEqual({});

    const result2 = transformToCssJs(undefined as any);
    expect(result2).toEqual({});

    const result3 = transformToCssJs('not-an-array' as any);
    expect(result3).toEqual({});
  });

  it('returns empty object for empty array', () => {
    const result = transformToCssJs([]);
    expect(result).toEqual({});
  });

  it('transforms basic styles without units', () => {
    const styles: PanelGroup[] = [
      {
        title: 'Basic',
        inputs: [
          {
            label: 'Color',
            type: 'color',
            value: '#FF0000',
            prop: 'color',
            classReference: 'body',
          },
          {
            label: 'Background',
            type: 'color',
            value: '#FFFFFF',
            prop: 'backgroundColor',
            classReference: 'container',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      body: { color: '#FF0000' },
      container: { backgroundColor: '#FFFFFF' },
    });
  });

  it('appends units to numeric values', () => {
    const styles: PanelGroup[] = [
      {
        title: 'With Units',
        inputs: [
          {
            label: 'Width',
            type: 'number',
            value: 100,
            unit: 'px',
            prop: 'width',
            classReference: 'container',
          },
          {
            label: 'Height',
            type: 'number',
            value: 200,
            unit: 'px',
            prop: 'height',
            classReference: 'container',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      container: { width: '100px', height: '200px' },
    });
  });

  it('converts fontSize from px to em for mobile adjustment', () => {
    const styles: PanelGroup[] = [
      {
        title: 'Font Size',
        inputs: [
          {
            label: 'Font Size',
            type: 'number',
            value: 26,
            unit: 'px',
            prop: 'fontSize',
            classReference: 'body',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      body: { fontSize: '2em' }, // 26 / 13 = 2
    });
  });

  it('includes container background when body is not white', () => {
    const styles: PanelGroup[] = [
      {
        title: 'Body',
        inputs: [
          {
            label: 'Background',
            type: 'color',
            value: '#F0F0F0',
            prop: 'backgroundColor',
            classReference: 'body',
          },
        ],
      },
      {
        title: 'Container',
        inputs: [
          {
            label: 'Background',
            type: 'color',
            value: '#FFFFFF',
            prop: 'backgroundColor',
            classReference: 'container',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      body: { backgroundColor: '#F0F0F0' },
      container: { backgroundColor: '#FFFFFF' },
    });
  });

  it('includes non-black text colors for body', () => {
    const styles: PanelGroup[] = [
      {
        title: 'Body',
        inputs: [
          {
            label: 'Color',
            type: 'color',
            value: '#333333',
            prop: 'color',
            classReference: 'body',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      body: { color: '#333333' },
    });
  });

  it('handles mixed input types and properties', () => {
    const styles: PanelGroup[] = [
      {
        title: 'Mixed Properties',
        inputs: [
          {
            label: 'Width',
            type: 'number',
            value: 600,
            unit: 'px',
            prop: 'width',
            classReference: 'container',
          },
          {
            label: 'Align',
            type: 'select',
            value: 'center',
            prop: 'align',
            classReference: 'container',
          },
          {
            label: 'Background',
            type: 'color',
            value: '#F5F5F5',
            prop: 'backgroundColor',
            classReference: 'container',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      container: {
        width: '600px',
        align: 'center',
        backgroundColor: '#F5F5F5',
      },
    });
  });

  it('handles multiple class references', () => {
    const styles: PanelGroup[] = [
      {
        title: 'Multiple Classes',
        inputs: [
          {
            label: 'Body Color',
            type: 'color',
            value: '#333333',
            prop: 'color',
            classReference: 'body',
          },
          {
            label: 'Link Color',
            type: 'color',
            value: '#0066CC',
            prop: 'color',
            classReference: 'link',
          },
          {
            label: 'Button Background',
            type: 'color',
            value: '#000000',
            prop: 'backgroundColor',
            classReference: 'button',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      body: { color: '#333333' },
      link: { color: '#0066CC' },
      button: { backgroundColor: '#000000' },
    });
  });

  it('handles string values with units', () => {
    const styles: PanelGroup[] = [
      {
        title: 'String Values',
        inputs: [
          {
            label: 'Width',
            type: 'number',
            value: 'auto',
            unit: 'px',
            prop: 'width',
            classReference: 'button',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      button: { width: 'auto' }, // Should not append unit for string values
    });
  });

  it('handles complex nested structure', () => {
    const styles: PanelGroup[] = [
      {
        title: 'Complex Theme',
        inputs: [
          {
            label: 'Body Background',
            type: 'color',
            value: '#FFFFFF',
            prop: 'backgroundColor',
            classReference: 'body',
          },
          {
            label: 'Container Background',
            type: 'color',
            value: '#FFFFFF',
            prop: 'backgroundColor',
            classReference: 'container',
          },
          {
            label: 'Container Width',
            type: 'number',
            value: 600,
            unit: 'px',
            prop: 'width',
            classReference: 'container',
          },
          {
            label: 'Padding Left',
            type: 'number',
            value: 20,
            unit: 'px',
            prop: 'paddingLeft',
            classReference: 'container',
          },
          {
            label: 'Padding Right',
            type: 'number',
            value: 20,
            unit: 'px',
            prop: 'paddingRight',
            classReference: 'container',
          },
          {
            label: 'Body Font Size',
            type: 'number',
            value: 16,
            unit: 'px',
            prop: 'fontSize',
            classReference: 'body',
          },
          {
            label: 'Body Color',
            type: 'color',
            value: '#000000',
            prop: 'color',
            classReference: 'body',
          },
        ],
      },
    ];

    const result = transformToCssJs(styles);
    expect(result).toEqual({
      body: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontSize: '1.2307692307692308em', // 16 / 13
      },
      container: {
        backgroundColor: '#FFFFFF',
        width: '600px',
        paddingLeft: '20px',
        paddingRight: '20px',
      },
    });
  });
});
