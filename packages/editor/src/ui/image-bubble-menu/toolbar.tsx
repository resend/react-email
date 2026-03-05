import type * as React from 'react';
import { useImageBubbleMenuContext } from './context';

export interface ImageBubbleMenuToolbarProps {
  className?: string;
  children: React.ReactNode;
}

export function ImageBubbleMenuToolbar({
  className,
  children,
}: ImageBubbleMenuToolbarProps) {
  const { isEditing } = useImageBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-img-bm-toolbar="" className={className}>
      {children}
    </div>
  );
}
