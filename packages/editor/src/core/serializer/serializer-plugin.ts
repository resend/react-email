import type { Editor, JSONContent } from '@tiptap/core';

export interface SerializerPlugin {
  getNodeStyles(
    node: JSONContent,
    depth: number,
    editor: Editor,
  ): React.CSSProperties;
  BaseTemplate(props: {
    previewText: string | null;
    children: React.ReactNode;
    editor: Editor;
  }): React.ReactNode;
}
