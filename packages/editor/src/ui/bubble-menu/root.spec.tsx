import { render } from '@testing-library/react';
import { BubbleMenuRoot } from './root.js';

describe('BubbleMenuRoot', () => {
  it('renders null when no editor context is available', () => {
    const { container } = render(
      <BubbleMenuRoot>
        <div>child</div>
      </BubbleMenuRoot>,
    );
    expect(container.innerHTML).toBe('');
  });
});
