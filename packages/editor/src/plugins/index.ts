import type { Editor, JSONContent } from "@tiptap/core";

export interface EditorPlugin {
  setup(editor: Editor): void;
  mapNodeStyles?(node: JSONContent, editor: Editor): React.CSSProperties;
}

