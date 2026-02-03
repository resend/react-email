import { Extension, type JSONContent } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import type { Node, Schema } from '@tiptap/pm/model';
import { Fragment, Slice } from '@tiptap/pm/model';
import {
  type EditorState,
  Plugin,
  PluginKey,
  type Transaction,
} from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';

const MINIMAL_SCHEMA_DEFAULT = {
  type: 'doc',
  content: [
    { type: 'heading', attributes: { level: 1 } },
    { type: 'paragraph', attributes: {} },
  ],
};

export const createUnsubscribeEditorExtensions = (
  minimalSchema: JSONContent = MINIMAL_SCHEMA_DEFAULT,
) => [
  StarterKit.configure({
    horizontalRule: false,
    blockquote: false,
    bulletList: false,
    code: false,
    codeBlock: false,
  }),
  Link.configure({
    protocols: ['http', 'https', 'mailto'],
    openOnClick: false,
  }),

  /**
   * Avoid pasting content with formatting and links.
   */
  Extension.create({
    name: 'cleanPaste',

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('cleanPaste'),

          props: {
            handlePaste(view, event, slice) {
              const clipboardData =
                event.clipboardData || (window as any).clipboardData;

              if (!clipboardData) {
                return false;
              }

              const plainText = clipboardData.getData('text/plain');

              if (!plainText) {
                return false;
              }

              event.preventDefault();

              const cleanNodes = createCleanNodesFromText(
                plainText,
                view.state.schema,
              );

              const cleanSlice = new Slice(
                Fragment.from(cleanNodes),
                slice.openStart,
                slice.openEnd,
              );

              const tr = view.state.tr.replaceSelection(cleanSlice);
              view.dispatch(tr);

              return true;
            },
          },
        }),
      ];
    },
  }),
  Extension.create({
    name: 'ensureMinimalSchema',

    onUpdate() {
      // Automatically restore minimal schema after any update
      const { state } = this.editor;
      const { tr } = state;
      const doc = state.doc;
      let modified = false;

      const requiredNodeCount = minimalSchema.content?.length ?? 0;

      // Check if we have the required minimal elements
      if (doc.content.childCount < requiredNodeCount) {
        const nodes = createMinimalNodes(state, doc, minimalSchema);
        tr.replaceWith(0, doc.content.size, nodes);
        modified = true;
      } else {
        // Ensure nodes match the required schema in order
        modified = validateAndFixSchema(state, tr, doc, minimalSchema);
      }

      if (modified) {
        this.editor.view.dispatch(tr);
      }
    },
  }),
];

// Helper functions
function createNodeOfType(
  state: EditorState,
  nodeType: string,
  attributes: JSONContent[string] = {},
  content?: Node['content'],
): Node {
  const nodeSchema = state.schema.nodes[nodeType];

  if (!nodeSchema) {
    throw new Error(`Node type "${nodeType}" not found in schema`);
  }

  return nodeSchema.create(attributes, content);
}

function createMinimalNodes(
  state: EditorState,
  doc: Node,
  minimalSchema: JSONContent,
): Node[] {
  const nodes: Node[] = [];
  const existingNodes = [];

  // Collect existing nodes
  for (let i = 0; i < doc.content.childCount; i++) {
    existingNodes.push(doc.content.child(i));
  }

  if (!minimalSchema.content) {
    return nodes;
  }

  // Create nodes according to schema
  for (let i = 0; i < minimalSchema.content.length; i++) {
    const requiredType = minimalSchema.content[i].type;
    const existingNode = existingNodes.find(
      (node) => node.type.name === requiredType,
    );

    if (!requiredType) {
      throw new Error('Required type not found in minimal schema');
    }

    if (existingNode) {
      // Use existing node of correct type
      nodes.push(existingNode);
    } else {
      // Check if we can convert an existing node
      const convertibleNode = existingNodes.find(
        (node) => !nodes.some((n) => n === node), // Not already used
      );

      if (convertibleNode && convertibleNode.content.size > 0) {
        // Convert existing node with content
        nodes.push(
          createNodeOfType(
            state,
            requiredType,
            minimalSchema.content[i].attributes,
            convertibleNode.content,
          ),
        );
      } else {
        // Create empty node
        nodes.push(
          createNodeOfType(
            state,
            requiredType,
            minimalSchema.content[i].attributes,
          ),
        );
      }
    }
  }

  return nodes;
}

function validateAndFixSchema(
  state: EditorState,
  tr: Transaction,
  doc: Node,
  minimalSchema: JSONContent,
): boolean {
  let modified = false;
  let currentPos = 0;

  if (!minimalSchema.content || !minimalSchema.content.length) {
    return modified;
  }

  for (let i = 0; i < minimalSchema.content.length; i++) {
    const requiredType = minimalSchema.content[i].type;

    if (!requiredType) {
      continue;
    }

    if (i < doc.content.childCount) {
      const currentNode = doc.content.child(i);

      if (currentNode.type.name !== requiredType) {
        // Convert node to required type
        const newNode = createNodeOfType(
          state,
          requiredType,
          minimalSchema.content[i].attributes,
          currentNode.content.size > 0 ? currentNode.content : undefined,
        );
        tr.replaceWith(currentPos, currentPos + currentNode.nodeSize, newNode);
        modified = true;
      }

      currentPos += doc.content.child(i).nodeSize;
    } else {
      // Add missing node
      const newNode = createNodeOfType(
        state,
        requiredType,
        minimalSchema.content[i].attributes,
      );
      tr.insert(currentPos, newNode);
      modified = true;
    }
  }

  return modified;
}

function createCleanNodesFromText(
  text: string,
  schema: Schema<any, any>,
): Node[] {
  const nodes: Node[] = [];

  const paragraphs = text.split(/\n\s*\n/);

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      continue;
    }

    const lines = paragraph.split(/\n/);

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        continue;
      }

      if (schema.nodes.paragraph) {
        const textNode = schema.text(trimmedLine);
        const paragraphNode = schema.nodes.paragraph.create(null, textNode);
        nodes.push(paragraphNode);
      }
    }
  }

  if (nodes.length === 0 && schema.nodes.paragraph) {
    nodes.push(schema.nodes.paragraph.create());
  }

  return nodes;
}
