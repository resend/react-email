import { PencilIcon } from 'lucide-react';
import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuEditLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export function LinkBubbleMenuEditLink({
  className,
  children,
}: LinkBubbleMenuEditLinkProps) {
  const { setIsEditing } = useLinkBubbleMenuContext();

  return (
    <button
      type="button"
      aria-label="Edit link"
      data-re-link-bm-item=""
      data-item="edit-link"
      className={className}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setIsEditing(true)}
    >
      {children ?? <PencilIcon />}
    </button>
  );
}
