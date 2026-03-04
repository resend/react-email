import { render } from '@testing-library/react';
import { LinkBubbleMenuRoot } from './root';

describe('LinkBubbleMenuRoot', () => {
  it('renders null when no editor context is available', () => {
    const { container } = render(
      <LinkBubbleMenuRoot>
        <div>child</div>
      </LinkBubbleMenuRoot>,
    );
    expect(container.innerHTML).toBe('');
  });
});
