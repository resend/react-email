import type * as React from 'react';
import { useImageBubbleMenuContext } from './context.js';

export interface ImageBubbleMenuToolbarProps
  extends React.ComponentProps<'div'> {}

export function ImageBubbleMenuToolbar({
  children,
  ...rest
}: ImageBubbleMenuToolbarProps) {
  const { isEditing } = useImageBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-img-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
