import { render, screen } from '@testing-library/react';
import { BubbleMenuItemGroup } from './group.js';
import { BubbleMenuSeparator } from './separator.js';

describe('BubbleMenuItemGroup', () => {
  it('renders children with correct data attribute and role', () => {
    render(
      <BubbleMenuItemGroup>
        <button type="button">Bold</button>
      </BubbleMenuItemGroup>,
    );
    const group = screen.getByRole('group');
    expect(group).toBeDefined();
    expect(group.dataset.reBubbleMenuGroup).toBeDefined();
    expect(group.textContent).toBe('Bold');
  });

  it('applies className', () => {
    render(
      <BubbleMenuItemGroup className="custom-class">
        <button type="button">Bold</button>
      </BubbleMenuItemGroup>,
    );
    const group = screen.getByRole('group');
    expect(group.className).toBe('custom-class');
  });
});

describe('BubbleMenuSeparator', () => {
  it('renders a separator with correct data attribute', () => {
    render(<BubbleMenuSeparator />);
    const separator = screen.getByRole('separator');
    expect(separator).toBeDefined();
    expect(separator.dataset.reBubbleMenuSeparator).toBeDefined();
  });

  it('applies className', () => {
    render(<BubbleMenuSeparator className="divider" />);
    const separator = screen.getByRole('separator');
    expect(separator.className).toBe('divider');
  });
});
