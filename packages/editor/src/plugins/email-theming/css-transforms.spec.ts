import { expect, it } from 'vitest';
import { transformToCssJs } from './css-transforms';
import type { PanelGroup } from './types';

it('returns empty object for non-array input', () => {
  const result = transformToCssJs(
    null as unknown as Parameters<typeof transformToCssJs>[0],
  );
  expect(result).toEqual({});

  const result2 = transformToCssJs(
    undefined as unknown as Parameters<typeof transformToCssJs>[0],
  );
  expect(result2).toEqual({});

  const result3 = transformToCssJs(
    'not-an-array' as unknown as Parameters<typeof transformToCssJs>[0],
  );
  expect(result3).toEqual({});
});

it('returns empty object for empty array', () => {
  const result = transformToCssJs([]);
  expect(result).toEqual({});
});

it('transforms basic styles without units', () => {
  const styles: PanelGroup[] = [
    {
      id: 'body',
      title: 'Body',
      inputs: [
        {
          label: 'Color',
          type: 'color',
          value: '#FF0000',
          prop: 'color',
        },
      ],
    },
    {
      id: 'container',
      title: 'Container',
      inputs: [
        {
          label: 'Background',
          type: 'color',
          value: '#FFFFFF',
          prop: 'backgroundColor',
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
      id: 'container',
      title: 'With Units',
      inputs: [
        {
          label: 'Width',
          type: 'number',
          value: 100,
          unit: 'px',
          prop: 'width',
        },
        {
          label: 'Height',
          type: 'number',
          value: 200,
          unit: 'px',
          prop: 'height',
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
      id: 'body',
      title: 'Font Size',
      inputs: [
        {
          label: 'Font Size',
          type: 'number',
          value: 26,
          unit: 'px',
          prop: 'fontSize',
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
      id: 'body',
      title: 'Body',
      inputs: [
        {
          label: 'Background',
          type: 'color',
          value: '#F0F0F0',
          prop: 'backgroundColor',
        },
      ],
    },
    {
      id: 'container',
      title: 'Container',
      inputs: [
        {
          label: 'Background',
          type: 'color',
          value: '#FFFFFF',
          prop: 'backgroundColor',
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
      id: 'body',
      title: 'Body',
      inputs: [
        {
          label: 'Color',
          type: 'color',
          value: '#333333',
          prop: 'color',
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
      id: 'container',
      title: 'Mixed Properties',
      inputs: [
        {
          label: 'Width',
          type: 'number',
          value: 600,
          unit: 'px',
          prop: 'width',
        },
        {
          label: 'Align',
          type: 'select',
          value: 'center',
          prop: 'align',
        },
        {
          label: 'Background',
          type: 'color',
          value: '#F5F5F5',
          prop: 'backgroundColor',
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

it('handles multiple sections with different ids', () => {
  const styles: PanelGroup[] = [
    {
      id: 'body',
      title: 'Body',
      inputs: [
        {
          label: 'Body Color',
          type: 'color',
          value: '#333333',
          prop: 'color',
        },
      ],
    },
    {
      id: 'link',
      title: 'Link',
      inputs: [
        {
          label: 'Link Color',
          type: 'color',
          value: '#0066CC',
          prop: 'color',
        },
      ],
    },
    {
      id: 'button',
      title: 'Button',
      inputs: [
        {
          label: 'Button Background',
          type: 'color',
          value: '#000000',
          prop: 'backgroundColor',
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
      id: 'button',
      title: 'String Values',
      inputs: [
        {
          label: 'Width',
          type: 'number',
          value: 'auto',
          unit: 'px',
          prop: 'width',
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
      id: 'body',
      title: 'Body',
      inputs: [
        {
          label: 'Body Background',
          type: 'color',
          value: '#FFFFFF',
          prop: 'backgroundColor',
        },
        {
          label: 'Body Font Size',
          type: 'number',
          value: 16,
          unit: 'px',
          prop: 'fontSize',
        },
        {
          label: 'Body Color',
          type: 'color',
          value: '#000000',
          prop: 'color',
        },
      ],
    },
    {
      id: 'container',
      title: 'Container',
      inputs: [
        {
          label: 'Container Background',
          type: 'color',
          value: '#FFFFFF',
          prop: 'backgroundColor',
        },
        {
          label: 'Container Width',
          type: 'number',
          value: 600,
          unit: 'px',
          prop: 'width',
        },
        {
          label: 'Padding Left',
          type: 'number',
          value: 20,
          unit: 'px',
          prop: 'paddingLeft',
        },
        {
          label: 'Padding Right',
          type: 'number',
          value: 20,
          unit: 'px',
          prop: 'paddingRight',
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

it('skips groups without an id', () => {
  const styles: PanelGroup[] = [
    {
      title: 'No ID',
      inputs: [
        {
          label: 'Color',
          type: 'color',
          value: '#FF0000',
          prop: 'color',
        },
      ],
    },
  ];

  const result = transformToCssJs(styles);
  expect(result).toEqual({});
});
