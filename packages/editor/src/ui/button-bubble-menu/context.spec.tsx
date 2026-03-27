import { renderHook } from '@testing-library/react';
import { useButtonBubbleMenuContext } from './context';

describe('useButtonBubbleMenuContext', () => {
  it('throws when used outside a Provider', () => {
    expect(() => {
      renderHook(() => useButtonBubbleMenuContext());
    }).toThrow(
      'ButtonBubbleMenu compound components must be used within <ButtonBubbleMenu.Root>',
    );
  });
});
