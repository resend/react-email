import type { Editor, JSONContent } from '@tiptap/core';
import type { ComposeContext } from './compose-context';

export interface SerializerPlugin {
  getNodeStyles(
    node: JSONContent,
    depth: number,
    context: ComposeContext,
  ): React.CSSProperties;
  BaseTemplate(props: {
    previewText?: string;
    children: React.ReactNode;
    context: ComposeContext;
    /**
     * @deprecated Kept so BaseTemplate implementations written against the
     * editor-based API keep working: it carries the live editor when
     * composing with `{ editor }`, and falls back to the context otherwise.
     * Read `context` instead.
     */
    editor?: Editor | ComposeContext;
    previewMode?: boolean;
  }): React.ReactNode;
}
