import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../utils/styles', () => ({
  inlineCssToJs: (style: string) => {
    if (!style) return {};
    const obj: Record<string, string> = {};
    for (const part of style.split(';')) {
      const [k, v] = part.split(':').map((s) => s.trim());
      if (k && v) obj[k] = v;
    }
    return obj;
  },
  jsToInlineCss: (obj: Record<string, string>) =>
    `${Object.entries(obj)
      .map(([k, v]) => `${k}:${v}`)
      .join(';')};`,
  ensureBorderStyleFallback: (s: Record<string, string>) => s,
}));

vi.mock('../../../plugins/email-theming/themes', () => ({
  SUPPORTED_CSS_PROPERTIES: {
    fontSize: { unit: 'px' },
    padding: { unit: 'px' },
  },
}));

vi.mock('./get-node-at-pos', () => ({
  getNodeAtExactPos: vi.fn(),
}));

import { getNodeAtExactPos } from './get-node-at-pos';
import { customUpdateAttributes, customUpdateStyles } from './style-updates';

function createMockEditor(nodeAttrs: Record<string, any>) {
  const dispatched: any[] = [];
  const node = { attrs: { ...nodeAttrs } };
  return {
    editor: {
      state: {
        doc: {},
        tr: {
          setNodeMarkup: (_pos: number, _type: null, attrs: any) => {
            dispatched.push(attrs);
            return { attrs };
          },
        },
      },
      view: {
        dispatch: (tx: any) => dispatched.push(tx),
      },
    } as any,
    node,
    dispatched,
  };
}

describe('customUpdateAttributes', () => {
  it('updates attribute and dispatches transaction', () => {
    const { editor, node } = createMockEditor({ src: 'old.png', alt: '' });
    const setLocal = vi.fn();
    (getNodeAtExactPos as any).mockReturnValue({ node, pos: 5 });

    customUpdateAttributes(
      {
        editor,
        nodePos: { pos: 5, inside: 6 },
        prop: 'src',
        newValue: 'new.png',
      },
      setLocal,
    );

    expect(setLocal).toHaveBeenCalledWith(
      expect.objectContaining({ src: 'new.png' }),
    );
  });

  it('does nothing when node not found', () => {
    const { editor } = createMockEditor({});
    const setLocal = vi.fn();
    (getNodeAtExactPos as any).mockReturnValue(null);

    customUpdateAttributes(
      { editor, nodePos: { pos: 0, inside: 0 }, prop: 'src', newValue: 'x' },
      setLocal,
    );

    expect(setLocal).not.toHaveBeenCalled();
  });
});

describe('customUpdateStyles', () => {
  it('updates a single style property', () => {
    const { editor, node } = createMockEditor({ style: 'color:red;' });
    const setLocal = vi.fn();
    (getNodeAtExactPos as any).mockReturnValue({ node, pos: 0 });

    customUpdateStyles(
      {
        editor,
        nodePos: { pos: 0, inside: 0 },
        prop: 'color',
        newValue: 'blue',
      },
      setLocal,
    );

    expect(setLocal).toHaveBeenCalled();
    const attrs = setLocal.mock.calls[0][0];
    expect(attrs.style).toContain('color:blue');
  });

  it('removes property when value is empty string', () => {
    const { editor, node } = createMockEditor({ style: 'color:red;' });
    const setLocal = vi.fn();
    (getNodeAtExactPos as any).mockReturnValue({ node, pos: 0 });

    customUpdateStyles(
      { editor, nodePos: { pos: 0, inside: 0 }, prop: 'color', newValue: '' },
      setLocal,
    );

    const attrs = setLocal.mock.calls[0][0];
    expect(attrs.style).not.toContain('color');
  });

  it('appends unit for known CSS properties with numeric value', () => {
    const { editor, node } = createMockEditor({ style: '' });
    const setLocal = vi.fn();
    (getNodeAtExactPos as any).mockReturnValue({ node, pos: 0 });

    customUpdateStyles(
      {
        editor,
        nodePos: { pos: 0, inside: 0 },
        prop: 'fontSize',
        newValue: 16,
      },
      setLocal,
    );

    const attrs = setLocal.mock.calls[0][0];
    expect(attrs.style).toContain('fontSize:16px');
  });

  it('handles batch changes', () => {
    const { editor, node } = createMockEditor({ style: '' });
    const setLocal = vi.fn();
    (getNodeAtExactPos as any).mockReturnValue({ node, pos: 0 });

    customUpdateStyles(
      {
        editor,
        nodePos: { pos: 0, inside: 0 },
        changes: [
          ['color', 'red'],
          ['fontSize', 14],
        ],
      },
      setLocal,
    );

    const attrs = setLocal.mock.calls[0][0];
    expect(attrs.style).toContain('color:red');
    expect(attrs.style).toContain('fontSize:14px');
  });

  it('does nothing when node not found', () => {
    const { editor } = createMockEditor({});
    const setLocal = vi.fn();
    (getNodeAtExactPos as any).mockReturnValue(null);

    customUpdateStyles(
      {
        editor,
        nodePos: { pos: 0, inside: 0 },
        prop: 'color',
        newValue: 'red',
      },
      setLocal,
    );

    expect(setLocal).not.toHaveBeenCalled();
  });
});
