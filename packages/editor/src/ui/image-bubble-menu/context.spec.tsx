import { renderHook } from '@testing-library/react';
import { useImageBubbleMenuContext } from './context';

describe('useImageBubbleMenuContext', () => {
  it('throws when used outside a Provider', () => {
    expect(() => {
      renderHook(() => useImageBubbleMenuContext());
    }).toThrow(
      'ImageBubbleMenu compound components must be used within <ImageBubbleMenu.Root>',
    );
  });
});
