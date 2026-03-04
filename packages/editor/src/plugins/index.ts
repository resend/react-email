import type { Editor, JSONContent } from '@tiptap/core';

export interface Plugin {
  setup(editor: Editor): void;
  mapNodeStyles?(
    node: JSONContent,
    depth: number,
    editor: Editor,
  ): React.CSSProperties;
}

export function createPlugin<T extends Plugin>(plugin: T): T {
  return plugin;
}
