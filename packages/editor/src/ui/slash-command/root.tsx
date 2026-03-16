import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import type { Editor } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { useCurrentEditor } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { CommandList } from './command-list';
import { defaultSlashCommands } from './commands';
import { filterAndRankItems } from './search';
import type { SlashCommandItem, SlashCommandRootProps } from './types';
import { isAtMaxColumnsDepth } from './utils';

const pluginKey = new PluginKey('slash-command');

interface SuggestionState {
  active: boolean;
  query: string;
  items: SlashCommandItem[];
  command: ((item: SlashCommandItem) => void) | null;
  clientRect: (() => DOMRect | null) | null;
}

const INITIAL_STATE: SuggestionState = {
  active: false,
  query: '',
  items: [],
  command: null,
  clientRect: null,
};

function defaultFilterItems(
  items: SlashCommandItem[],
  query: string,
  editor: Editor,
): SlashCommandItem[] {
  const filtered = isAtMaxColumnsDepth(editor)
    ? items.filter(
        (item) => item.category !== 'Layout' || !item.title.includes('column'),
      )
    : items;

  return filterAndRankItems(filtered, query);
}

export function SlashCommandRoot({
  items: itemsProp,
  filterItems: filterItemsProp,
  char = '/',
  allow: allowProp,
  children,
}: SlashCommandRootProps) {
  const { editor } = useCurrentEditor();
  const [state, setState] = useState<SuggestionState>(INITIAL_STATE);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const itemsRef = useRef(itemsProp ?? defaultSlashCommands);
  const filterRef = useRef(filterItemsProp ?? defaultFilterItems);
  const allowRef = useRef(
    allowProp ??
      (({ editor: e }: { editor: Editor }) => !e.isActive('codeBlock')),
  );

  itemsRef.current = itemsProp ?? defaultSlashCommands;
  filterRef.current = filterItemsProp ?? defaultFilterItems;
  allowRef.current =
    allowProp ??
    (({ editor: e }: { editor: Editor }) => !e.isActive('codeBlock'));

  const keyDownHandlerRef = useRef<(event: KeyboardEvent) => boolean>(
    () => false,
  );

  const { refs, floatingStyles } = useFloating({
    open: state.active,
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!state.clientRect) return;
    refs.setReference({
      getBoundingClientRect: state.clientRect,
    });
  }, [state.clientRect, refs]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [state.items]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): boolean => {
      if (state.items.length === 0) return false;

      if (event.key === 'ArrowUp') {
        setSelectedIndex(
          (i) => (i + state.items.length - 1) % state.items.length,
        );
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % state.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        const item = state.items[selectedIndex];
        if (item && state.command) {
          state.command(item);
        }
        return true;
      }
      return false;
    },
    [state.items, state.command, selectedIndex],
  );

  keyDownHandlerRef.current = handleKeyDown;

  const onSelect = useCallback(
    (index: number) => {
      const item = state.items[index];
      if (item && state.command) {
        state.command(item);
      }
    },
    [state.items, state.command],
  );

  useEffect(() => {
    if (!editor) return;

    const plugin = Suggestion<SlashCommandItem, SlashCommandItem>({
      pluginKey,
      editor,
      char,
      allow: ({ editor: e }) => allowRef.current({ editor: e }),
      command: ({ editor: e, range, props }) => {
        props.command({ editor: e, range });
      },
      items: ({ query, editor: e }) =>
        filterRef.current(itemsRef.current, query, e),
      render: () => ({
        onStart: (props) => {
          setState({
            active: true,
            query: props.query,
            items: props.items,
            command: props.command,
            clientRect: props.clientRect ?? null,
          });
        },
        onUpdate: (props) => {
          setState({
            active: true,
            query: props.query,
            items: props.items,
            command: props.command,
            clientRect: props.clientRect ?? null,
          });
        },
        onKeyDown: ({ event }) => {
          if (event.key === 'Escape') {
            setState(INITIAL_STATE);
            return true;
          }
          return keyDownHandlerRef.current(event);
        },
        onExit: () => {
          setState(INITIAL_STATE);
        },
      }),
    });

    editor.registerPlugin(plugin);
    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, char]);

  if (!editor || !state.active) return null;

  const renderProps = {
    items: state.items,
    query: state.query,
    selectedIndex,
    onSelect,
  };

  let content: ReactNode;
  if (children) {
    content = children(renderProps);
  } else {
    content = <CommandList {...renderProps} />;
  }

  return createPortal(
    <div ref={refs.setFloating} style={floatingStyles}>
      {content}
    </div>,
    document.body,
  );
}
