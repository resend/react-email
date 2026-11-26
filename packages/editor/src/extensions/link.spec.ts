import { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  EmailTheming,
  setGlobalStyles,
} from '../plugins/email-theming/extension';
import { EDITOR_THEMES } from '../plugins/email-theming/themes';
import { StarterKit } from './index';

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

function docWithLink(style?: string) {
  const attrs: Record<string, unknown> = { href: 'https://resend.com' };
  if (style !== undefined) {
    attrs.style = style;
  }
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            marks: [{ type: 'link', attrs }],
            text: 'click',
          },
        ],
      },
    ],
  };
}

function createEditor(theme: 'basic' | 'minimal', content = docWithLink()) {
  return new Editor({
    extensions: [StarterKit, EmailTheming.configure({ theme })],
    content,
  });
}

function findLinkMark(editor: Editor) {
  const walk = (nodes: unknown[]): Record<string, unknown> | undefined => {
    for (const n of nodes) {
      const node = n as Record<string, unknown>;
      const marks = node.marks as Array<Record<string, unknown>> | undefined;
      const linkMark = marks?.find((m) => m.type === 'link');
      if (linkMark) return linkMark;
      const children = node.content as unknown[] | undefined;
      if (children) {
        const found = walk(children);
        if (found) return found;
      }
    }
    return undefined;
  };
  return walk((editor.getJSON().content ?? []) as unknown[]);
}

const COLOR_RE = /color:\s*#0670DB/i;
const UNDERLINE_RE = /text-decoration:\s*underline/i;

describe('Link mark theming', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
    document.head
      .querySelectorAll('style[id^="tiptap-theme-"]')
      .forEach((node) => {
        node.remove();
      });
  });

  it('emits theme-resolved color and text-decoration on plain links (basic)', () => {
    editor = createEditor('basic');
    const html = editor.getHTML();
    expect(html).toMatch(COLOR_RE);
    expect(html).toMatch(UNDERLINE_RE);
  });

  it('emits theme-resolved color and text-decoration on plain links (minimal)', () => {
    editor = createEditor('minimal');
    const html = editor.getHTML();
    expect(html).toMatch(COLOR_RE);
    expect(html).toMatch(UNDERLINE_RE);
  });

  it('preserves class="node-link" in the rendered output', () => {
    editor = createEditor('basic');
    expect(editor.getHTML()).toContain('class="node-link"');
  });

  it('lets user-specified color win over the theme color', () => {
    editor = createEditor('basic', docWithLink('color: red'));
    const html = editor.getHTML();
    expect(html).toMatch(/color:\s*red/i);
    expect(html).not.toMatch(COLOR_RE);
    expect(html).toMatch(UNDERLINE_RE);
  });

  it('keeps mark.attrs.style empty for plain links (inspector contract)', () => {
    editor = createEditor('basic');
    const mark = findLinkMark(editor);
    expect(mark?.type).toBe('link');
    expect((mark?.attrs as Record<string, unknown>).style).toBe('');
  });

  it('round-trips a plain <a href> through setContent+getHTML with themed style', () => {
    editor = createEditor('basic');
    editor.commands.setContent(
      '<p><a href="https://resend.com">click</a></p>',
      { emitUpdate: true },
    );
    const html = editor.getHTML();
    expect(html).toMatch(COLOR_RE);
    expect(html).toMatch(UNDERLINE_RE);
  });
});

describe('Link mark theming in the live editor', () => {
  let editor: Editor;

  function withLinkColor(color: string) {
    return EDITOR_THEMES.basic.map((group) =>
      group.id === 'link'
        ? {
            ...group,
            inputs: group.inputs.map((input) =>
              input.prop === 'color' ? { ...input, value: color } : input,
            ),
          }
        : group,
    );
  }

  function linkText(text: string, style: string) {
    return {
      type: 'text',
      text,
      marks: [{ type: 'link', attrs: { href: 'https://resend.com', style } }],
    };
  }

  function mountEditor() {
    const element = document.createElement('div');
    document.body.appendChild(element);
    return new Editor({
      element,
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              linkText('themed', ''),
              { type: 'text', text: ' ' },
              linkText('custom', 'color: #ff0000'),
            ],
          },
        ],
      },
    });
  }

  function renderedLink(text: string) {
    const link = Array.from(editor.view.dom.querySelectorAll('a')).find(
      (a) => a.textContent === text,
    );
    if (!link) {
      throw new Error(`link "${text}" not rendered`);
    }
    return link;
  }

  function linkColor(text: string) {
    return getComputedStyle(renderedLink(text)).color.toLowerCase();
  }

  afterEach(() => {
    editor?.destroy();
    document.body.innerHTML = '';
  });

  it('repaints existing links when the theme link color changes', () => {
    editor = mountEditor();
    expect(linkColor('themed')).toBe('#0670db');

    setGlobalStyles(editor, withLinkColor('#C2410C'));

    expect(linkColor('themed')).toBe('#c2410c');
  });

  it('keeps per-link colors over the theme link color', () => {
    editor = mountEditor();
    setGlobalStyles(editor, withLinkColor('#C2410C'));

    expect(linkColor('custom')).toBe('#ff0000');
  });

  it('does not bake the theme style into the live link DOM', () => {
    editor = mountEditor();
    expect(renderedLink('themed').getAttribute('style')).toBeNull();
    expect(renderedLink('themed').className).toBe('node-link');
    expect(renderedLink('custom').getAttribute('style')).toMatch(
      /^color: #ff0000;?$/,
    );
  });

  it('serializes the current theme link color in getHTML', () => {
    editor = mountEditor();
    setGlobalStyles(editor, withLinkColor('#C2410C'));

    expect(editor.getHTML()).toMatch(/<a[^>]*color:\s*#C2410C[^>]*>themed/i);
    expect(editor.getHTML()).toMatch(/<a[^>]*color:\s*#ff0000[^>]*>custom/i);
  });
});
