import type { Editor, Range } from '@tiptap/core';
import type { ComponentType } from 'react';

export type SlashCommandCategory = string;

export interface SearchableItem {
  title: string;
  description: string;
  searchTerms?: string[];
}

export interface SlashCommandItem extends SearchableItem {
  icon: ComponentType<{ size?: number }>;
  category: SlashCommandCategory;
  command: (props: SlashCommandProps) => void;
}

export interface SlashCommandProps {
  editor: Editor;
  range: Range;
}
