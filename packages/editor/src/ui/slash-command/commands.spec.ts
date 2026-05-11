import type { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

function makeFakeEditor() {
  const ops: string[] = [];
  const calls: Record<string, unknown[][]> = {};

  // Proxy chain so any tiptap command name is auto-tracked. `run` and
  // `setNode` are explicit so we can assert their args directly.
  const setNode = vi.fn((node: string, _attrs?: unknown) => {
    ops.push(`setNode:${node}`);
    return chainProxy;
  });
  const run = vi.fn(() => true);

  const chainProxy: Record<string, unknown> = new Proxy(
    {},
    {
      get(_t, prop: string) {
        if (prop === 'setNode') return setNode;
        if (prop === 'run') return run;
        return (...args: unknown[]) => {
          ops.push(prop);
          calls[prop] = (calls[prop] ?? []).concat([args]);
          return chainProxy;
        };
      },
    },
  ) as Record<string, unknown>;

  return {
    editor: { chain: () => chainProxy } as unknown as Editor,
    ops,
    calls,
    chain: { setNode, run } as { setNode: typeof setNode; run: typeof run },
  };
}

const FAKE_RANGE = { from: 0, to: 0 };

const COMMAND_TABLE: Array<{ name: string; cmd: SlashCommandItem }> = [
  { name: 'TEXT', cmd: TEXT },
  { name: 'H1', cmd: H1 },
  { name: 'H2', cmd: H2 },
  { name: 'H3', cmd: H3 },
  { name: 'BULLET_LIST', cmd: BULLET_LIST },
  { name: 'NUMBERED_LIST', cmd: NUMBERED_LIST },
  { name: 'QUOTE', cmd: QUOTE },
  { name: 'CODE', cmd: CODE },
  { name: 'BUTTON', cmd: BUTTON },
  { name: 'DIVIDER', cmd: DIVIDER },
  { name: 'SECTION', cmd: SECTION },
  { name: 'TWO_COLUMNS', cmd: TWO_COLUMNS },
  { name: 'THREE_COLUMNS', cmd: THREE_COLUMNS },
  { name: 'FOUR_COLUMNS', cmd: FOUR_COLUMNS },
];

describe('slash commands', () => {
  afterEach(() => vi.clearAllMocks());

  it.each(COMMAND_TABLE)('$name has the required SlashCommandItem fields', ({
    cmd,
  }) => {
    expect(cmd.title).toBeTruthy();
    expect(cmd.description).toBeTruthy();
    expect(typeof cmd.command).toBe('function');
    expect(Array.isArray(cmd.searchTerms)).toBe(true);
    expect(cmd.searchTerms.length).toBeGreaterThan(0);
  });

  it.each(COMMAND_TABLE)('$name dispatches at least one chain operation', ({
    cmd,
  }) => {
    const { editor, ops } = makeFakeEditor();
    cmd.command({ editor, range: FAKE_RANGE });
    expect(ops.length).toBeGreaterThan(0);
  });

  it.each(COMMAND_TABLE)('$name calls run() exactly once', ({ cmd }) => {
    const { editor, chain } = makeFakeEditor();
    cmd.command({ editor, range: FAKE_RANGE });
    expect(chain.run).toHaveBeenCalledTimes(1);
  });

  it('defaultSlashCommands includes all canonical commands', () => {
    expect(defaultSlashCommands).toContain(TEXT);
    expect(defaultSlashCommands).toContain(H1);
    expect(defaultSlashCommands).toContain(BULLET_LIST);
    expect(defaultSlashCommands).toContain(BUTTON);
    expect(defaultSlashCommands).toContain(SECTION);
    expect(defaultSlashCommands).toContain(TWO_COLUMNS);
    expect(defaultSlashCommands.length).toBeGreaterThanOrEqual(
      COMMAND_TABLE.length,
    );
  });

  // Heading levels must be distinct: H1/H2/H3 setNode calls carry the
  // appropriate level attr.
  it('H1/H2/H3 use distinct heading levels', () => {
    const f1 = makeFakeEditor();
    H1.command({ editor: f1.editor, range: FAKE_RANGE });
    expect(f1.chain.setNode).toHaveBeenCalledWith('heading', { level: 1 });

    const f2 = makeFakeEditor();
    H2.command({ editor: f2.editor, range: FAKE_RANGE });
    expect(f2.chain.setNode).toHaveBeenCalledWith('heading', { level: 2 });

    const f3 = makeFakeEditor();
    H3.command({ editor: f3.editor, range: FAKE_RANGE });
    expect(f3.chain.setNode).toHaveBeenCalledWith('heading', { level: 3 });
  });
});
