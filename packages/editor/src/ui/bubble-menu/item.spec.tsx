import { render, screen, fireEvent } from '@testing-library/react';
import { BubbleMenuItem } from './item';

describe('BubbleMenuItem', () => {
  it('renders a button with correct aria attributes when inactive', () => {
    const onCommand = vi.fn();
    render(
      <BubbleMenuItem name="bold" isActive={false} onCommand={onCommand}>
        <span>B</span>
      </BubbleMenuItem>,
    );

    const button = screen.getByRole('button', { name: 'bold' });
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.dataset.reBubbleMenuItem).toBeDefined();
    expect(button.dataset.item).toBe('bold');
    expect(button.dataset.active).toBeUndefined();
  });

  it('sets data-active and aria-pressed when active', () => {
    render(
      <BubbleMenuItem name="bold" isActive={true} onCommand={() => {}}>
        <span>B</span>
      </BubbleMenuItem>,
    );

    const button = screen.getByRole('button', { name: 'bold' });
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.dataset.active).toBeDefined();
  });

  it('calls onCommand on click', () => {
    const onCommand = vi.fn();
    render(
      <BubbleMenuItem name="bold" isActive={false} onCommand={onCommand}>
        <span>B</span>
      </BubbleMenuItem>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    expect(onCommand).toHaveBeenCalledOnce();
  });

  it('applies className', () => {
    render(
      <BubbleMenuItem
        name="bold"
        isActive={false}
        onCommand={() => {}}
        className="custom"
      >
        <span>B</span>
      </BubbleMenuItem>,
    );

    expect(screen.getByRole('button', { name: 'bold' }).className).toBe(
      'custom',
    );
  });
});
