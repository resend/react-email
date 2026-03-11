import type { Editor } from '@tiptap/core';
import { defaultSlashCommands } from './commands';
import { SlashCommandExtension } from './extension';
import { createRenderItems } from './render';
import { filterAndRankItems } from './search';
import type { CommandListComponent, SlashCommandItem } from './types';
import { isAtMaxColumnsDepth } from './utils';

function defaultFilterItems(
  items: SlashCommandItem[],
  query: string,
  editor: Editor,
): SlashCommandItem[] {
  const filtered = isAtMaxColumnsDepth(editor)
    ? items.filter(
        (item) => item.category !== 'Layout' || !item.title.includes('Column'),
      )
    : items;

  return filterAndRankItems(filtered, query);
}

export function createSlashCommand(options?: {
  items?: SlashCommandItem[];
  filterItems?: (
    items: SlashCommandItem[],
    query: string,
    editor: Editor,
  ) => SlashCommandItem[];
  component?: CommandListComponent;
}) {
  const items = options?.items ?? defaultSlashCommands;
  const filterFn = options?.filterItems ?? defaultFilterItems;

  return SlashCommandExtension.configure({
    suggestion: {
      items: ({ query, editor }: { query: string; editor: Editor }) =>
        filterFn(items, query, editor),
      render: createRenderItems(options?.component),
    },
  });
}
