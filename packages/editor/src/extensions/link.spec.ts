import { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EmailTheming } from '../plugins/email-theming/extension';
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
