import type { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTestEditor } from '../../__tests__/editor-test-helpers';
import {
  BULLET_LIST,
  BUTTON,
  CODE,
  DIVIDER,
  defaultSlashCommands,
  FOUR_COLUMNS,
  H1,
  H2,
  H3,
  NUMBERED_LIST,
  QUOTE,
  SECTION,
  TEXT,
  THREE_COLUMNS,
  TWO_COLUMNS,
} from './commands';
import type { SlashCommandItem } from './types';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

interface NodeShape {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: NodeShape[];
}

function findNodeOfType(editor: Editor, type: string): NodeShape | undefined {
  const walk = (nodes: NodeShape[] | undefined): NodeShape | undefined => {
    if (!nodes) return undefined;
    for (const n of nodes) {
      if (n.type === type) return n;
      const inner = walk(n.content);
      if (inner) return inner;
    }
    return undefined;
  };
  return walk((editor.getJSON() as NodeShape).content);
}

function hasNodeOfType(editor: Editor, type: string): boolean {
  return findNodeOfType(editor, type) !== undefined;
}

const COMMAND_TABLE: Array<{
  name: string;
  cmd: SlashCommandItem;
  expectedNode: string;
}> = [
  { name: 'TEXT', cmd: TEXT, expectedNode: 'paragraph' },
  { name: 'H1', cmd: H1, expectedNode: 'heading' },
  { name: 'H2', cmd: H2, expectedNode: 'heading' },
  { name: 'H3', cmd: H3, expectedNode: 'heading' },
  { name: 'BULLET_LIST', cmd: BULLET_LIST, expectedNode: 'bulletList' },
  { name: 'NUMBERED_LIST', cmd: NUMBERED_LIST, expectedNode: 'orderedList' },
  { name: 'QUOTE', cmd: QUOTE, expectedNode: 'blockquote' },
  { name: 'CODE', cmd: CODE, expectedNode: 'codeBlock' },
  { name: 'BUTTON', cmd: BUTTON, expectedNode: 'button' },
  { name: 'DIVIDER', cmd: DIVIDER, expectedNode: 'horizontalRule' },
  { name: 'SECTION', cmd: SECTION, expectedNode: 'section' },
  { name: 'TWO_COLUMNS', cmd: TWO_COLUMNS, expectedNode: 'twoColumns' },
  { name: 'THREE_COLUMNS', cmd: THREE_COLUMNS, expectedNode: 'threeColumns' },
  { name: 'FOUR_COLUMNS', cmd: FOUR_COLUMNS, expectedNode: 'fourColumns' },
];

describe.each(COMMAND_TABLE)('slash command $name', ({ cmd, expectedNode }) => {
  let editor: Editor | null = null;
  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  it('has the required SlashCommandItem shape', () => {
    expect(cmd.title).toBeTruthy();
    expect(cmd.description).toBeTruthy();
    expect(typeof cmd.command).toBe('function');
    expect(Array.isArray(cmd.searchTerms)).toBe(true);
    expect(cmd.searchTerms.length).toBeGreaterThan(0);
  });

  it(`inserts a ${expectedNode} node into the editor`, () => {
    editor = createTestEditor();
    const { from, to } = editor.state.selection;
    cmd.command({ editor, range: { from, to } });
    expect(hasNodeOfType(editor, expectedNode)).toBe(true);
  });
});

describe('slash commands — heading levels', () => {
  let editor: Editor | null = null;
  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  it.each([
    { cmd: H1, level: 1 },
    { cmd: H2, level: 2 },
    { cmd: H3, level: 3 },
  ])('$cmd.title sets heading level to $level', ({ cmd, level }) => {
    editor = createTestEditor();
    const { from, to } = editor.state.selection;
    cmd.command({ editor, range: { from, to } });
    const heading = findNodeOfType(editor, 'heading');
    expect(heading?.attrs?.level).toBe(level);
  });
});

describe('defaultSlashCommands', () => {
  it('includes all canonical commands', () => {
    for (const { cmd } of COMMAND_TABLE) {
      expect(defaultSlashCommands).toContain(cmd);
    }
  });
});
