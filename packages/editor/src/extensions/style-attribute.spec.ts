/* @vitest-environment node */

import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { Div } from './div';
// import { Heading } from './heaidng';
import { StyleAttribute } from './style-attribute';
import { Table, TableCell, TableHeader, TableRow } from './table';

const extensions: Parameters<typeof generateJSON>[1] = [
  StarterKit.configure({
    heading: false,
  }) as (typeof extensions)[number],
  // Heading,
  Div,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  StyleAttribute.configure({
    types: [
      // 'heading',
      'paragraph',
      'div',
      'table',
      'tableRow',
      'tableCell',
      'tableHeader',
    ],
  }),
];

function getStyleFromJson(json: ReturnType<typeof generateJSON>) {
  return json.content?.[0]?.attrs?.style;
}

describe('StyleAttribute', () => {
  it('preserves inline styles on paragraph', () => {
    const html =
      '<p style="font-size: 14px; color: rgb(0, 0, 0); font-family: Arial">Hello</p>';
    const json = generateJSON(html, extensions);
    expect(getStyleFromJson(json)).toBe(
      'font-size: 14px; color: rgb(0, 0, 0); font-family: Arial',
    );
  });

  // it('preserves inline styles on heading', () => {
  //   const html = '<h1 style="margin: 0; font-size: 32px">Title</h1>';
  //   const json = generateJSON(html, extensions);
  //   expect(getStyleFromJson(json)).toBe('margin: 0; font-size: 32px');
  // });

  it('preserves inline styles on div', () => {
    const html =
      '<div style="padding: 20px 0; background-color: #f4f4f5"><p>Content</p></div>';
    const json = generateJSON(html, extensions);
    expect(getStyleFromJson(json)).toBe(
      'padding: 20px 0; background-color: #f4f4f5',
    );
  });

  it('preserves inline styles on table elements', () => {
    const html = `<table style="border-collapse: collapse; width: 100%">
      <tr style="background-color: #ffffff">
        <td style="padding: 8px; border: 1px solid #e5e7eb">Cell</td>
      </tr>
    </table>`;
    const json = generateJSON(html, extensions);

    expect(json.content[0].attrs.style).toBe(
      'border-collapse: collapse; width: 100%',
    );
    const row = json.content[0].content[0];
    expect(row.attrs.style).toBe('background-color: #ffffff');
    const cell = row.content[0];
    expect(cell.attrs.style).toBe('padding: 8px; border: 1px solid #e5e7eb');
  });

  it('returns empty string when no style attribute', () => {
    const html = '<p>No styles</p>';
    const json = generateJSON(html, extensions);
    expect(getStyleFromJson(json)).toBe('');
  });
});
