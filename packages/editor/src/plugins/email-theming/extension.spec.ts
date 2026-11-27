import { Editor, type JSONContent } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { EmailTheming, getMergedCssJs, stylesToCss } from './extension';
import { EDITOR_THEMES } from './themes';
import type {
  EditorTheme,
  KnownThemeComponents,
  PanelGroup,
  ThemeConfig,
} from './types';

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

const LIST_DOC = {
  type: 'doc',
  content: [
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Item' }],
            },
          ],
        },
      ],
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

function createEditor(content: JSONContent = BUTTON_DOC) {
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

    const buttonRule = themeStyleTag?.textContent?.match(
      /\.node-button\{[^}]*\}/,
    )?.[0];
    expect(buttonRule).toContain('box-sizing:border-box;');
  });

  it('injects list styles against the rendered list node classes', () => {
    editor = createEditor(LIST_DOC);

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );

    expect(themeStyleTag).not.toBeNull();
    expect(themeStyleTag?.textContent).toContain('.node-list');
    expect(themeStyleTag?.textContent).toContain('.node-listItem');
    expect(themeStyleTag?.textContent).toContain('.node-list .node-list');
    expect(editor.getHTML()).toContain('class="node-list node-bulletList"');
    expect(editor.getHTML()).toContain('class="node-listItem"');
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

  it('injects body background color on the scoped editor selector', () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: createDocWithBodyBg('#F0F0F0'),
    });

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );

    expect(themeStyleTag).not.toBeNull();
    expect(themeStyleTag?.textContent).toContain('background-color:#F0F0F0;');
    expect(themeStyleTag?.textContent).not.toContain('.node-body');
  });

  it('does not inject a body background color when not defined', () => {
    editor = createEditor();

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );

    expect(themeStyleTag).not.toBeNull();
    expect(themeStyleTag?.textContent).not.toContain(
      'background-color:#F0F0F0;',
    );
  });

  it('updates body background color in scoped CSS when theme styles change', () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: createDocWithBodyBg('#F0F0F0'),
    });

    const initialThemeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );
    expect(initialThemeStyleTag?.textContent).toContain(
      'background-color:#F0F0F0;',
    );

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

    const updatedThemeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );
    expect(updatedThemeStyleTag?.textContent).toContain(
      'background-color:#FF0000;',
    );
  });

  it('removes injected style tag on destroy', () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: createDocWithBodyBg('#F0F0F0'),
    });

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );
    expect(themeStyleTag).not.toBeNull();

    editor.destroy();

    const themeStyleTagAfterDestroy =
      document.head.querySelector<HTMLStyleElement>(
        'style[id^="tiptap-theme-"][id$="-theme"]',
      );
    expect(themeStyleTagAfterDestroy).toBeNull();

    // Prevent afterEach from calling destroy again
    editor = undefined as unknown as Editor;
  });
});

describe('EmailTheming with ThemeConfig', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
    document.head
      .querySelectorAll('style[id^="tiptap-theme-"]')
      .forEach((node) => {
        node.remove();
      });
  });

  it('applies custom theme styles from ThemeConfig', () => {
    const customTheme: ThemeConfig = {
      extends: 'basic',
      styles: {
        body: { backgroundColor: '#f4f4f5' },
      },
    };

    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: customTheme })],
      content: BUTTON_DOC,
    });

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );

    expect(themeStyleTag).not.toBeNull();
    expect(themeStyleTag?.textContent).toContain('background-color:#f4f4f5;');
  });

  it('applies ThemeConfig without extends using minimal reset', () => {
    const customTheme: ThemeConfig = {
      styles: {
        button: { backgroundColor: '#0670DB' },
      },
    };

    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: customTheme })],
      content: BUTTON_DOC,
    });

    const themeStyleTag = document.head.querySelector<HTMLStyleElement>(
      'style[id^="tiptap-theme-"][id$="-theme"]',
    );

    expect(themeStyleTag).not.toBeNull();
    expect(themeStyleTag?.textContent).toContain('background-color:#0670DB;');
    expect(themeStyleTag?.textContent).not.toContain(
      'background-color:#000000;',
    );
  });
});

describe('list spacing', () => {
  const em = (value: unknown) => Number.parseFloat(String(value ?? 0)) || 0;

  it.each([
    'basic',
    'minimal',
  ] as const)('keeps the same gap around nested list items in the %s theme', (theme) => {
    const css = stylesToCss(EDITOR_THEMES[theme], theme);
    const item = css.listItem;
    const nested = css.nestedList;

    const itemToItem = em(item.paddingBottom) + em(item.paddingTop);
    // The nested list sits inside the parent item, after its paragraph.
    const parentToNested = em(nested.paddingTop) + em(item.paddingTop);
    const nestedToNext =
      em(item.paddingBottom) +
      em(nested.paddingBottom) +
      em(item.paddingBottom) +
      em(item.paddingTop);

    expect(itemToItem).toBeGreaterThan(0);
    expect(parentToNested).toBe(itemToItem);
    expect(nestedToNext).toBe(itemToItem);
  });
});

describe('font sizes', () => {
  type FontSizes = Partial<Record<KnownThemeComponents, number>>;

  function withFontSizes(theme: EditorTheme, sizes: FontSizes): PanelGroup[] {
    const panels = EDITOR_THEMES[theme].map((group) => ({
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

  const cases: [EditorTheme, FontSizes, Record<string, string | undefined>][] =
    [
      ['basic', {}, { body: '1em', h1: '2.25em', paragraph: '1em' }],
      ['basic', { body: 14, h1: 15 }, { body: '1em', h1: `${15 / 14}em` }],
      ['basic', { body: 14, h1: 14 }, { h1: '1em' }],
      [
        'basic',
        { body: 15 },
        {
          body: `${15 / 14}em`,
          h1: '2.25em',
          paragraph: '1em',
          button: '0.875em',
          listItem: undefined,
        },
      ],
      ['basic', { body: 15, h1: 15 }, { h1: '1em' }],
      ['basic', { body: 15, h1: 14 }, { h1: `${14 / 15}em` }],
      ['basic', { body: 15, paragraph: 15 }, { paragraph: '1em' }],
      [
        'basic',
        { body: 15, list: 18, listItem: 16, nestedList: 12 },
        {
          list: `${18 / 15}em`,
          listItem: `${16 / 18}em`,
          nestedList: `${12 / 16}em`,
        },
      ],
      ['basic', { body: 15, listItem: 15 }, { listItem: '1em' }],
      ['basic', { body: 15, nestedList: 12 }, { nestedList: `${12 / 15}em` }],
      ['minimal', {}, { body: undefined, h1: undefined, paragraph: undefined }],
      ['minimal', { h1: 28 }, { body: undefined, h1: '2em' }],
      [
        'minimal',
        { body: 15, h1: 30, paragraph: 15 },
        { body: `${15 / 14}em`, h1: '2em', paragraph: '1em' },
      ],
    ];

  it.each(
    cases,
  )('compiles %s theme sizes %o relative to the parent size', (theme, sizes, expected) => {
    const css = getMergedCssJs(theme, withFontSizes(theme, sizes));

    for (const [key, fontSize] of Object.entries(expected)) {
      expect(css[key as KnownThemeComponents].fontSize, key).toBe(fontSize);
    }
  });

  it('leaves a size as is when its parent size is zero', () => {
    const css = getMergedCssJs(
      'basic',
      withFontSizes('basic', { body: 0, h1: 28 }),
    );

    expect(css.h1.fontSize).toBe('2em');
  });

  it.each([
    '',
    undefined,
    '2em',
  ])('lets a later non-px size %o replace an earlier px size', (value) => {
    const panels = withFontSizes('basic', { body: 15, h1: 20, paragraph: 15 });
    for (const classReference of ['body', 'h1'] as const) {
      panels.push({
        title: 'Override',
        classReference,
        inputs: [
          {
            label: 'Font size',
            type: 'number',
            unit: 'px',
            prop: 'fontSize',
            classReference,
            value,
          },
        ],
      });
    }

    const css = getMergedCssJs('basic', panels);

    expect(css.body.fontSize).toBe(value);
    expect(css.h1.fontSize).toBe(value);
    expect(css.paragraph.fontSize).toBe(`${15 / 14}em`);
  });

  it('renders code at the explicit code block size', () => {
    expect(getMergedCssJs('basic', undefined).codeTag.fontSize).toBe('.92em');

    const css = getMergedCssJs(
      'basic',
      withFontSizes('basic', { body: 15, codeBlock: 14 }),
    );

    expect(css.codeBlock.fontSize).toBe(`${14 / 15}em`);
    expect(css.codeTag.fontSize).toBe('1em');
    expect(getMergedCssJs('basic', undefined).codeTag.fontSize).toBe('.92em');
  });

  it('returns the same styles from stylesToCss', () => {
    const panels = withFontSizes('basic', { body: 15, h1: 15, listItem: 16 });

    expect(stylesToCss(panels, 'basic')).toEqual(
      getMergedCssJs('basic', panels),
    );
  });
});
