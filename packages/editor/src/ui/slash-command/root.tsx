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
  clientRect: (() => DOMRect | null) | null;
}

const INITIAL_STATE: SuggestionState = {
  active: false,
  query: '',
  items: [],
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

  const commandRef = useRef<((item: SlashCommandItem) => void) | null>(null);
  const suggestionItemsRef = useRef<SlashCommandItem[]>([]);
  const selectedIndexRef = useRef(0);

  suggestionItemsRef.current = state.items;
  selectedIndexRef.current = selectedIndex;

  const { refs, floatingStyles } = useFloating({
    open: state.active,
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!state.clientRect) return;
    const clientRect = state.clientRect;
    refs.setReference({
      getBoundingClientRect: () => clientRect()!,
    });
  }, [state.clientRect, refs]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [state.items]);

  const onSelect = useCallback((index: number) => {
    const item = suggestionItemsRef.current[index];
    if (item && commandRef.current) {
      commandRef.current(item);
    }
  }, []);

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
          commandRef.current = props.command;
          setState({
            active: true,
            query: props.query,
            items: props.items,
            clientRect: props.clientRect ?? null,
          });
        },
        onUpdate: (props) => {
          commandRef.current = props.command;
          setState({
            active: true,
            query: props.query,
            items: props.items,
            clientRect: props.clientRect ?? null,
          });
        },
        onKeyDown: ({ event }) => {
          if (event.key === 'Escape') {
            setState(INITIAL_STATE);
            return true;
          }

          const items = suggestionItemsRef.current;
          if (items.length === 0) return false;

          if (event.key === 'ArrowUp') {
            setSelectedIndex((i) => (i + items.length - 1) % items.length);
            return true;
          }
          if (event.key === 'ArrowDown') {
            setSelectedIndex((i) => (i + 1) % items.length);
            return true;
          }
          if (event.key === 'Enter') {
            const item = items[selectedIndexRef.current];
            if (item && commandRef.current) {
              commandRef.current(item);
            }
            return true;
          }
          return false;
        },
        onExit: () => {
          setState(INITIAL_STATE);
          requestAnimationFrame(() => {
            commandRef.current = null;
          });
        },
      }),
    });

    editor.registerPlugin(plugin, (newPlugin, plugins) => [
      newPlugin,
      ...plugins,
    ]);
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
