import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { render } from 'vitest-browser-react';
import { EmailEditor } from '../../email-editor/email-editor';
import {
  getEmailTheming,
  getMergedCssJs,
  getResolvedNodeStyles,
  setGlobalStyles,
} from './extension';
import { EDITOR_THEMES } from './themes';
import type { CssJs, KnownThemeComponents, PanelGroup } from './types';

const CANVAS_FONT_SIZE_PX = 14;

const item = (text: string, ...rest: object[]) => ({
  type: 'listItem',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }, ...rest],
});

const DOC = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'Paragraph' }] },
    {
      type: 'bulletList',
      content: [
        item('Item', {
          type: 'orderedList',
          content: [item('Nested item')],
        }),
      ],
    },
  ],
};

function withFontSizes(
  sizes: Partial<Record<KnownThemeComponents, number>>,
): PanelGroup[] {
  const panels = EDITOR_THEMES.basic.map((group) => ({
    ...group,
    inputs: [...group.inputs],
  }));
  for (const [classReference, value] of Object.entries(sizes) as [
    KnownThemeComponents,
    number,
  ][]) {
    panels
      .filter((group) => group.classReference === classReference)
      .at(-1)
      ?.inputs.push({
        label: 'Font size',
        type: 'number',
        unit: 'px',
        prop: 'fontSize',
        classReference,
        value,
      });
  }
  return panels;
}

function toPx(fontSize: unknown, parentPx: number) {
  return fontSize === undefined
    ? parentPx
    : Number.parseFloat(String(fontSize)) * parentPx;
}

function collectFontSizes(
  editor: Editor,
  css: CssJs,
  parent: ProseMirrorNode,
  contentStart: number,
  depth: number,
  parentPx: number,
  sizes: { node: string; email: number; canvas: number }[] = [],
) {
  parent.forEach((node, offset) => {
    if (node.isText || node.type.name === 'globalContent') {
      return;
    }
    const pos = contentStart + offset;
    const email = toPx(
      getResolvedNodeStyles(node.toJSON(), depth, css).fontSize,
      parentPx,
    );
    const canvas = Number.parseFloat(
      getComputedStyle(editor.view.nodeDOM(pos) as HTMLElement).fontSize,
    );
    sizes.push({ node: `${node.type.name}@${depth}`, email, canvas });
    const isList = ['bulletList', 'orderedList'].includes(node.type.name);
    collectFontSizes(
      editor,
      css,
      node,
      pos + 1,
      isList ? depth + 1 : depth,
      email,
      sizes,
    );
  });
  return sizes;
}

describe('canvas and email font size parity (browser)', () => {
  it.each([
    { body: 15, paragraph: 18, list: 18 },
    { body: 15, paragraph: 15, list: 18, listItem: 16, nestedList: 12 },
  ])('renders %o on the canvas at the size the email resolves', async (fontSizes) => {
    let editor: Editor | null = null;
    render(
      <div style={{ fontSize: CANVAS_FONT_SIZE_PX }}>
        <EmailEditor
          content={DOC}
          onReady={(ref) => {
            editor = ref.editor;
          }}
        />
      </div>,
    );
    await expect.poll(() => editor).not.toBeNull();
    const readyEditor = editor as unknown as Editor;
    setGlobalStyles(readyEditor, withFontSizes(fontSizes));

    const theming = getEmailTheming(readyEditor);
    const css = getMergedCssJs(theming.theme, theming.styles);
    const bodyPx = toPx(css.body.fontSize, CANVAS_FONT_SIZE_PX);

    expect(bodyPx).toBeCloseTo(fontSizes.body);
    expect(
      Number.parseFloat(getComputedStyle(readyEditor.view.dom).fontSize),
    ).toBeCloseTo(bodyPx);

    const sizes = collectFontSizes(
      readyEditor,
      css,
      readyEditor.state.doc,
      0,
      0,
      bodyPx,
    );

    expect(sizes.map((size) => size.node)).toEqual([
      'container@0',
      'paragraph@0',
      'bulletList@0',
      'listItem@1',
      'paragraph@1',
      'orderedList@1',
      'listItem@2',
      'paragraph@2',
      'paragraph@0',
    ]);
    for (const size of sizes) {
      expect(size.canvas, size.node).toBeCloseTo(size.email);
    }
    expect(sizes[1].canvas).toBeCloseTo(fontSizes.paragraph);
    expect(sizes[2].canvas).toBeCloseTo(fontSizes.list);
  });
});
