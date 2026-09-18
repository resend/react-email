import { fireEvent, render, screen } from '@testing-library/react';
import { CommandList, orderItemsByCategory } from './command-list';
import type { SlashCommandItem } from './types';

function makeItem(title: string, category: string): SlashCommandItem {
  return {
    title,
    description: `${title} description`,
    icon: null,
    category,
    command: () => {},
  };
}

// The categories are displayed as Text -> Media -> Layout, while the array
// holds Media last, the way a custom command appended to the defaults does.
const items = [
  makeItem('Text', 'Text'),
  makeItem('Divider', 'Layout'),
  makeItem('Image', 'Media'),
];

function renderList(selectedIndex = 0) {
  const onSelect = vi.fn();
  render(
    <CommandList
      items={items}
      onSelect={onSelect}
      query=""
      selectedIndex={selectedIndex}
    />,
  );
  return onSelect;
}

describe('CommandList', () => {
  it('renders the categories in display order', () => {
    renderList();

    const categories = document.querySelectorAll(
      '[data-re-slash-command-category]',
    );
    expect([...categories].map((node) => node.textContent)).toEqual([
      'Text',
      'Media',
      'Layout',
    ]);
  });

  it('selects the clicked item and not the one in its display position', () => {
    const onSelect = renderList();

    fireEvent.click(screen.getByRole('button', { name: 'Image' }));

    // Image is displayed second but is items[2].
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('highlights the item the index points at', () => {
    renderList(2);

    const selected = document.querySelector('[data-selected]');
    expect(selected?.textContent).toContain('Image');
  });
});

describe('orderItemsByCategory', () => {
  it('returns the items in the order they are rendered in', () => {
    expect(orderItemsByCategory(items).map((item) => item.title)).toEqual([
      'Text',
      'Image',
      'Divider',
    ]);
  });

  it('keeps unknown categories after the known ones, in first-seen order', () => {
    const withCustom = [
      makeItem('Poll', 'Interactive'),
      makeItem('Text', 'Text'),
      makeItem('Survey', 'Interactive'),
    ];

    expect(orderItemsByCategory(withCustom).map((item) => item.title)).toEqual([
      'Text',
      'Poll',
      'Survey',
    ]);
  });
});
