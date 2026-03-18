import { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { EmailTheming } from './extension';

vi.mock('@tiptap/react', () => ({
  ReactNodeViewRenderer: () => () => null,
  useEditorState: vi.fn(),
}));

vi.mock('tippy.js', () => ({
  default: vi.fn(),
}));

vi.mock('@/env', () => ({
  env: new Proxy(
    {},
    {
      get: () => '',
    },
  ),
}));

const BUTTON_DOC = {
  type: 'doc',
  content: [
    {
      type: 'button',
      attrs: {
        url: 'https://resend.com',
      },
      content: [{ type: 'text', text: 'Button' }],
    },
  ],
};

const LEGACY_MINIMAL_DOC = {
  type: 'doc',
  content: [
    {
      type: 'globalContent',
      attrs: {
        data: {
          css: '',
          styles: [
            { title: 'Body', classReference: 'body', inputs: [] },
            { title: 'Container', classReference: 'container', inputs: [] },
            { title: 'Typography', classReference: 'body', inputs: [] },
            { title: 'Link', classReference: 'link', inputs: [] },
            { title: 'Image', classReference: 'image', inputs: [] },
            { title: 'Button', classReference: 'button', inputs: [] },
            { title: 'Code Block', classReference: 'codeBlock', inputs: [] },
            { title: 'Inline Code', classReference: 'inlineCode', inputs: [] },
          ],
          theme: 'minimal',
        },
      },
    },
    ...BUTTON_DOC.content,
  ],
};

function createEditor(content = BUTTON_DOC) {
  return new Editor({
    extensions: [
      StarterKit,
      EmailTheming.configure({
        theme: 'basic',
      }),
    ],
    content,
  });
}

describe('EmailTheming', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
    document.head
      .querySelectorAll('style[id^="tiptap-theme-"]')
      .forEach((node) => {
        node.remove();
      });
  });

  it('injects default theme styles when no saved styles are available', () => {
    editor = createEditor();

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );

    expect(themeStyleTag).not.toBeNull();
    expect(themeStyleTag?.textContent).toContain('.node-button');
    expect(themeStyleTag?.textContent).toContain('background-color:#000000;');
    expect(themeStyleTag?.textContent).toContain('padding-top:7px;');
  });

  it('keeps legacy saved minimal theme styles from falling back to basic', () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming],
      content: LEGACY_MINIMAL_DOC,
    });

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );

    expect(themeStyleTag).not.toBeNull();
    expect(themeStyleTag?.textContent).toContain('.node-button');
    expect(themeStyleTag?.textContent).not.toContain(
      'background-color:#000000;',
    );
    expect(themeStyleTag?.textContent).not.toContain('padding-top:7px;');
  });
});
