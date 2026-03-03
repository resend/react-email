import { render, screen } from '@testing-library/react';
import { BubbleMenuGroup } from './group';
import { BubbleMenuSeparator } from './separator';

describe('BubbleMenuGroup', () => {
  it('renders children with correct data attribute and role', () => {
    render(
      <BubbleMenuGroup>
        <button type="button">Bold</button>
      </BubbleMenuGroup>,
    );
    const group = screen.getByRole('group');
    expect(group).toBeDefined();
    expect(group.dataset.reBubbleMenuGroup).toBeDefined();
    expect(group.textContent).toBe('Bold');
  });

  it('applies className', () => {
    render(
      <BubbleMenuGroup className="custom-class">
        <button type="button">Bold</button>
      </BubbleMenuGroup>,
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
