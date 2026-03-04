import { UnlinkIcon } from 'lucide-react';
import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuUnlinkProps {
  className?: string;
  children?: React.ReactNode;
}

export function LinkBubbleMenuUnlink({
  className,
  children,
}: LinkBubbleMenuUnlinkProps) {
  const { editor } = useLinkBubbleMenuContext();

  return (
    <button
      type="button"
      aria-label="Remove link"
      data-re-link-bm-item=""
      data-item="unlink"
      className={className}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => editor.chain().focus().unsetLink().run()}
    >
      {children ?? <UnlinkIcon />}
    </button>
  );
}
