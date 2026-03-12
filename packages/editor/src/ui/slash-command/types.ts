import type { Editor, Range } from '@tiptap/core';
import type { ComponentType, ReactNode, Ref } from 'react';

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

export interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface CommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  editor: SlashCommandProps['editor'];
  range: SlashCommandProps['range'];
  query: string;
  ref: Ref<CommandListRef>;
}

export type CommandListComponent = ComponentType<CommandListProps>;
