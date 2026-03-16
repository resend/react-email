import { useLayoutEffect, useRef } from 'react';
import type { CommandListProps, SlashCommandItem } from './types';
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
}: CommandListProps) {
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
      <div data-re-slash-command="" ref={containerRef}>
        {items.map((item, index) => (
          <CommandItem
            item={item}
            key={item.title}
            onSelect={() => onSelect(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    );
  }

  const groups = groupByCategory(items);
  let flatIndex = 0;

  return (
    <div data-re-slash-command="" ref={containerRef}>
      {groups.map((group) => (
        <div key={group.category}>
          <div data-re-slash-command-category="">{group.category}</div>
          {group.items.map((item) => {
            const currentIndex = flatIndex++;
            return (
              <CommandItem
                item={item}
                key={item.title}
                onSelect={() => onSelect(currentIndex)}
                selected={currentIndex === selectedIndex}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
