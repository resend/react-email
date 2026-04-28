import type { Editor, Range } from '@tiptap/core';
import type { ReactNode } from 'react';

export type SlashCommandCategory = string;

export interface SearchableItem {
  title: string;
  description: string;
  searchTerms?: string[];
}

export interface SlashCommandItem extends SearchableItem {
  icon: ReactNode;
  category: SlashCommandCategory;
  command: (props: SlashCommandProps) => void;
}

export interface SlashCommandProps {
  editor: Editor;
  range: Range;
}

export interface SlashCommandRenderProps {
  items: SlashCommandItem[];
  query: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export interface SlashCommandRootProps {
  items?: SlashCommandItem[];
  filterItems?: (
    items: SlashCommandItem[],
    query: string,
    editor: Editor,
  ) => SlashCommandItem[];
  char?: string;
  allow?: (props: { editor: Editor }) => boolean;
  children?: (props: SlashCommandRenderProps) => ReactNode;
}
