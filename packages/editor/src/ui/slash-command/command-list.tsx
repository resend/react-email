import { useLayoutEffect, useRef } from 'react';
import type { SlashCommandItem, SlashCommandRenderProps } from './types';
import { updateScrollView } from './utils';

const CATEGORY_ORDER = ['Text', 'Media', 'Layout', 'Utility'];

/** An item together with its index in the list the root holds. */
interface IndexedItem {
  item: SlashCommandItem;
  index: number;
}

function groupByCategory(
  items: SlashCommandItem[],
): { category: string; items: IndexedItem[] }[] {
  const seen = new Map<string, IndexedItem[]>();

  items.forEach((item, index) => {
    const existing = seen.get(item.category);
    if (existing) {
      existing.push({ item, index });
    } else {
      seen.set(item.category, [{ item, index }]);
    }
  });

  const ordered: { category: string; items: IndexedItem[] }[] = [];
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

/**
 * The order the grouped list is rendered in. Keeping the items in this order
 * means a row has the same index on both sides: the one `onSelect` and the
 * arrow keys resolve against, and the one it is rendered at.
 */
export function orderItemsByCategory(
  items: SlashCommandItem[],
): SlashCommandItem[] {
  return groupByCategory(items).flatMap((group) =>
    group.items.map(({ item }) => item),
  );
}

interface CommandItemProps {
  item: SlashCommandItem;
  selected: boolean;
  onSelect: () => void;
}

function CommandItem({ item, selected, onSelect }: CommandItemProps) {
  return (
    <button
      data-re-slash-command-item=""
      data-selected={selected || undefined}
      onClick={onSelect}
      type="button"
    >
      {item.icon}
      <span>{item.title}</span>
    </button>
  );
}

export function CommandList({
  items,
  query,
  selectedIndex,
  onSelect,
}: SlashCommandRenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const selected = container.querySelector<HTMLElement>('[data-selected]');
    if (selected) {
      updateScrollView(container, selected);
    }
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <div data-re-slash-command="">
        <div data-re-slash-command-empty="">No results</div>
      </div>
    );
  }

  const isFiltering = query.trim().length > 0;

  if (isFiltering) {
    return (
      <div data-re-slash-command="">
        <div data-re-slash-command-scroll="" ref={containerRef}>
          {items.map((item, index) => (
            <CommandItem
              item={item}
              key={item.title}
              onSelect={() => onSelect(index)}
              selected={index === selectedIndex}
            />
          ))}
        </div>
      </div>
    );
  }

  const groups = groupByCategory(items);

  return (
    <div data-re-slash-command="">
      <div data-re-slash-command-scroll="" ref={containerRef}>
        {groups.map((group) => (
          <div key={group.category}>
            <div data-re-slash-command-category="">{group.category}</div>
            {group.items.map(({ item, index }) => (
              <CommandItem
                item={item}
                key={item.title}
                onSelect={() => onSelect(index)}
                selected={index === selectedIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
