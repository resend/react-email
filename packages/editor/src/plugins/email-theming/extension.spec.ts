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

const GLOBAL_CSS = '.foo { color: red; }';

function createDocWithBodyBg(backgroundColor: string) {
  return {
    type: 'doc',
    content: [
      {
        type: 'globalContent',
        attrs: {
          data: {
            css: '',
            styles: [
              {
                id: 'body',
                title: 'Background',
                classReference: 'body',
                inputs: [
                  {
                    label: 'Background',
                    type: 'color',
                    value: backgroundColor,
                    prop: 'backgroundColor',
                    classReference: 'body',
                  },
                ],
              },
              {
                id: 'container',
                title: 'Content',
                classReference: 'container',
                inputs: [],
              },
              {
                id: 'typography',
                title: 'Text',
                classReference: 'body',
                inputs: [],
              },
              {
                id: 'link',
                title: 'Link',
                classReference: 'link',
                inputs: [],
              },
              {
                id: 'image',
                title: 'Image',
                classReference: 'image',
                inputs: [],
              },
              {
                id: 'button',
                title: 'Button',
                classReference: 'button',
                inputs: [],
              },
              {
                id: 'code-block',
                title: 'Code Block',
                classReference: 'codeBlock',
                inputs: [],
              },
              {
                id: 'inline-code',
                title: 'Inline Code',
                classReference: 'inlineCode',
                inputs: [],
              },
            ],
            theme: 'basic',
          },
        },
      },
      ...BUTTON_DOC.content,
    ],
  };
}

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

  it('does not duplicate injected CSS when updating with same global css repeatedly', () => {
    editor = createEditor();

    editor.commands.setGlobalContent('css', GLOBAL_CSS);
    editor.commands.setGlobalContent('css', GLOBAL_CSS);
    editor.commands.setGlobalContent('css', GLOBAL_CSS);

    const globalStyleTags = Array.from(
      document.head.querySelectorAll<HTMLStyleElement>(
        'style[id^="tiptap-theme-"][id$="-global"]',
      ),
    );

    expect(globalStyleTags).toHaveLength(1);

    const globalStyleTag = globalStyleTags[0];
    expect(globalStyleTag?.textContent).toContain(GLOBAL_CSS);

    const occurrences =
      globalStyleTag?.textContent?.split(GLOBAL_CSS).length ?? 0;
    expect(occurrences - 1).toBe(1);
  });

  it('applies body background color to the editor DOM element', () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: createDocWithBodyBg('#F0F0F0'),
    });

    expect(editor.view.dom.style.backgroundColor).toBe('#F0F0F0');
  });

  it('does not set background color when no body backgroundColor is defined', () => {
    editor = createEditor();

    expect(editor.view.dom.style.backgroundColor).toBe('');
  });

  it('updates body background color reactively when theme styles change', () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: createDocWithBodyBg('#F0F0F0'),
    });

    expect(editor.view.dom.style.backgroundColor).toBe('#F0F0F0');

    editor.commands.setGlobalContent('styles', [
      {
        id: 'body',
        title: 'Background',
        classReference: 'body',
        inputs: [
          {
            label: 'Background',
            type: 'color',
            value: '#FF0000',
            prop: 'backgroundColor',
            classReference: 'body',
          },
        ],
      },
    ]);

    expect(editor.view.dom.style.backgroundColor).toBe('#FF0000');
  });

  it('clears body background color on destroy', () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: createDocWithBodyBg('#F0F0F0'),
    });

    const dom = editor.view.dom;
    expect(dom.style.backgroundColor).toBe('#F0F0F0');

    editor.destroy();

    expect(dom.style.backgroundColor).toBe('');

    // Prevent afterEach from calling destroy again
    editor = undefined as unknown as Editor;
  });
});
