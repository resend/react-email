import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { SlashCommandItem, SlashCommandProps } from './types';
import { updateScrollView } from './utils';

const CATEGORY_ORDER = ['Text', 'Media', 'Layout', 'Utility'];

function groupByCategory(
  items: SlashCommandItem[],
): { category: string; items: SlashCommandItem[] }[] {
  const seen = new Map<string, SlashCommandItem[]>();

  for (const item of items) {
    const existing = seen.get(item.category);
    if (existing) {
      existing.push(item);
    } else {
      seen.set(item.category, [item]);
    }
  }

  const ordered: { category: string; items: SlashCommandItem[] }[] = [];
  for (const cat of CATEGORY_ORDER) {
    const group = seen.get(cat);
    if (group) {
      ordered.push({ category: cat, items: group });
      seen.delete(cat);
    }
  }
  for (const [category, group] of seen) {
    ordered.push({ category, items: group });
  }

  return ordered;
}

interface CommandItemProps {
  item: SlashCommandItem;
  selected: boolean;
  onSelect: () => void;
}

function CommandItem({ item, selected, onSelect }: CommandItemProps) {
  const Icon = item.icon;
  return (
    <button
      className="re-slash-command-item"
      data-selected={selected || undefined}
      onClick={onSelect}
      type="button"
    >
      <Icon size={20} />
      <span>{item.title}</span>
    </button>
  );
}

export interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface CommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  editor: SlashCommandProps['editor'];
  range: SlashCommandProps['range'];
  query: string;
  ref: Ref<CommandListRef>;
}

export function CommandList({ items, command, query, ref }: CommandListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const selected = container.querySelector<HTMLElement>(
      '[data-selected="true"]',
    );
    if (selected) {
      updateScrollView(container, selected);
    }
  }, [selectedIndex]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) command(item);
    },
    [items, command],
  );

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
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
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }),
    [items.length, selectItem, selectedIndex],
  );

  if (items.length === 0) {
    return (
      <div className="re-slash-command-container">
        <div className="re-slash-command-empty">No results</div>
      </div>
    );
  }

  const isFiltering = query.trim().length > 0;

  if (isFiltering) {
    return (
      <div className="re-slash-command-container" ref={containerRef}>
        {items.map((item, index) => (
          <CommandItem
            item={item}
            key={item.title}
            onSelect={() => selectItem(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    );
  }

  const groups = groupByCategory(items);
  let flatIndex = 0;

  return (
    <div className="re-slash-command-container" ref={containerRef}>
      {groups.map((group) => (
        <div key={group.category}>
          <div className="re-slash-command-category">{group.category}</div>
          {group.items.map((item) => {
            const currentIndex = flatIndex++;
            return (
              <CommandItem
                item={item}
                key={item.title}
                onSelect={() => selectItem(currentIndex)}
                selected={currentIndex === selectedIndex}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
