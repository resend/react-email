import { renderHook } from '@testing-library/react';
import { useLinkBubbleMenuContext } from './context';

describe('useLinkBubbleMenuContext', () => {
  it('throws when used outside a Provider', () => {
    expect(() => {
      renderHook(() => useLinkBubbleMenuContext());
    }).toThrow(
      'LinkBubbleMenu compound components must be used within <LinkBubbleMenu.Root>',
    );
  });
});
