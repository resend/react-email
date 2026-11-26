import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
import { CodeBlockPrism } from './code-block';

describe('PrismPlugin', () => {
  let editor: Editor | undefined;

  afterEach(() => {
    editor?.destroy();
    editor = undefined;
  });

  it('highlights every code block once a PHP block loads its grammar', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    editor = new Editor({
      element,
      extensions: [StarterKit.configure({ codeBlock: false }), CodeBlockPrism],
      content: {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: { language: 'php' },
            content: [{ type: 'text', text: '<?php echo $greeting;' }],
          },
          {
            type: 'codeBlock',
            attrs: { language: 'javascript' },
            content: [{ type: 'text', text: 'const x = 1;' }],
          },
        ],
      },
    });

    const tokensIn = (index: number, selector: string) =>
      element.querySelectorAll('pre')[index]?.querySelectorAll(selector)
        .length ?? 0;

    await expect.poll(() => tokensIn(0, '.token.delimiter')).toBe(1);
    expect(tokensIn(0, '.token.variable')).toBe(1);
    expect(tokensIn(1, '.token.keyword')).toBe(1);
  });

  it('leaves code in a language Prism does not have unhighlighted', () => {
    const element = document.createElement('div');
    document.body.append(element);
    editor = new Editor({
      element,
      extensions: [StarterKit.configure({ codeBlock: false }), CodeBlockPrism],
      content: {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: { language: 'not-a-language' },
            content: [{ type: 'text', text: 'const x = 1;' }],
          },
        ],
      },
    });

    expect(element.querySelectorAll('pre .token')).toHaveLength(0);
  });

  it.each([
    ['php', '<div class="a"><?php echo $x; ?></div>', '.token.php'],
    [
      'handlebars',
      '<p class="x">{{#if ok}}{{name}}{{/if}}</p>',
      '.token.handlebars',
    ],
  ])('highlights the markup around embedded %s code', async (language, text, embedded) => {
    const element = document.createElement('div');
    document.body.append(element);
    editor = new Editor({
      element,
      extensions: [StarterKit.configure({ codeBlock: false }), CodeBlockPrism],
      content: {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: { language },
            content: [{ type: 'text', text }],
          },
        ],
      },
    });

    const tokens = (selector: string) =>
      element.querySelector('pre')?.querySelectorAll(selector).length ?? 0;

    await expect.poll(() => tokens(embedded)).toBeGreaterThan(0);
    expect(tokens('.token.tag')).toBeGreaterThan(0);
    expect(tokens('.token.attr-name')).toBe(1);
  });
});
