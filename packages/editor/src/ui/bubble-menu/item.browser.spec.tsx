import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { BubbleMenuItem } from './item';

describe('BubbleMenuItem (browser)', () => {
  it('renders with correct aria attributes when inactive', async () => {
    render(
      <BubbleMenuItem name="bold" isActive={false} onCommand={() => {}}>
        <span>B</span>
      </BubbleMenuItem>,
    );

    const button = page.getByRole('button', { name: 'bold' });
    await expect.element(button).toBeVisible();
    await expect.element(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('sets aria-pressed when active', async () => {
    render(
      <BubbleMenuItem name="bold" isActive={true} onCommand={() => {}}>
        <span>B</span>
      </BubbleMenuItem>,
    );

    const button = page.getByRole('button', { name: 'bold' });
    await expect.element(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onCommand on click', async () => {
    const onCommand = vi.fn();
    render(
      <BubbleMenuItem name="bold" isActive={false} onCommand={onCommand}>
        <span>B</span>
      </BubbleMenuItem>,
    );

    const button = page.getByRole('button', { name: 'bold' });
    await expect.element(button).toBeVisible();
    await button.click();
    expect(onCommand).toHaveBeenCalledOnce();
  });
});
