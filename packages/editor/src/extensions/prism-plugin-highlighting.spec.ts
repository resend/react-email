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
});
