import { act, cleanup, render } from '@testing-library/react';
import type { Editor } from '@tiptap/core';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import { StarterKit } from '../../extensions';
import { defaultSlashCommands } from './commands';
import { SlashCommandRoot } from './root';
import { filterAndRankItems } from './search';
import type {
  SlashCommandItem,
  SlashCommandRenderProps,
  SlashCommandRootProps,
} from './types';

const image: SlashCommandItem = {
  title: 'Image',
  description: 'Insert an image',
  icon: null,
  category: 'Media',
  command: vi.fn(),
};

const items = [...defaultSlashCommands, image];

let editor: Editor | null = null;

function CaptureEditor() {
  editor = useCurrentEditor().editor;
  return null;
}

async function openMenu(props: SlashCommandRootProps) {
  render(
    <EditorProvider extensions={[StarterKit]} immediatelyRender>
      <CaptureEditor />
      <SlashCommandRoot {...props} />
    </EditorProvider>,
  );
  await act(async () => {
    if (!editor!.isInitialized) {
      await new Promise((resolve) => editor!.on('create', resolve));
    }
    editor!.commands.focus('end');
    editor!.commands.insertContent('/');
  });
}

async function press(key: string) {
  await act(async () => {
    editor!.view.dom.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
  });
}

function rows() {
  return [
    ...document.querySelectorAll<HTMLElement>('[data-re-slash-command-item]'),
  ];
}

function highlighted() {
  return document.querySelector('[data-selected]')?.textContent;
}

async function expectArrowKeysToFollowTheRows() {
  const drawn = rows().map((row) => row.textContent);
  expect(drawn.indexOf('Image')).toBe(drawn.indexOf('Code block') + 1);

  const visited = [highlighted()];
  for (let i = 1; i < drawn.length; i++) {
    await press('ArrowDown');
    visited.push(highlighted());
  }
  expect(visited).toEqual(drawn);
}

afterEach(() => {
  cleanup();
  editor = null;
  vi.mocked(image.command).mockClear();
});

describe('SlashCommandRoot', () => {
  it('moves the highlight down the rows in the order they are drawn', async () => {
    await openMenu({ items });

    await expectArrowKeysToFollowTheRows();
  });

  it('follows the drawn rows with a filterItems that does not sort', async () => {
    await openMenu({ items, filterItems: filterAndRankItems });

    await expectArrowKeysToFollowTheRows();
  });

  it('runs the highlighted item on Enter', async () => {
    await openMenu({ items, filterItems: filterAndRankItems });

    while (highlighted() !== 'Image') {
      await press('ArrowDown');
    }
    await press('Enter');

    expect(image.command).toHaveBeenCalledTimes(1);
  });

  it('does not fail when the anchor leaves the DOM while the menu is open', async () => {
    const rejections: unknown[] = [];
    const onRejection = (reason: unknown) => rejections.push(reason);
    process.on('unhandledRejection', onRejection);
    try {
      await openMenu({ items });

      // The suggestion plugin removes its decoration before the menu closes,
      // so its clientRect() returns null while floating-ui re-measures.
      const dom = editor!.view.dom;
      const querySelector = dom.querySelector.bind(dom);
      vi.spyOn(dom, 'querySelector').mockImplementation((selector: string) =>
        selector.startsWith('[data-decoration-id')
          ? null
          : querySelector(selector),
      );
      await act(async () => {
        window.dispatchEvent(new Event('resize'));
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(rejections).toEqual([]);
    } finally {
      process.off('unhandledRejection', onRejection);
    }
  });

  it('gives a custom renderer the items in array order', async () => {
    const children = vi.fn((_props: SlashCommandRenderProps) => null);
    await openMenu({ items, children });

    const received = children.mock.lastCall?.[0].items.map(
      (item) => item.title,
    );
    expect(received).toEqual(items.map((item) => item.title));
  });
});
