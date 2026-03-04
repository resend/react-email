import { ExternalLinkIcon } from 'lucide-react';
import type * as React from 'react';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuOpenLinkProps
  extends Omit<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'> {}

export function LinkBubbleMenuOpenLink({
  className,
  children,
  ...rest
}: LinkBubbleMenuOpenLinkProps) {
  const { linkHref } = useLinkBubbleMenuContext();

  return (
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open link"
      data-re-link-bm-item=""
      data-item="open-link"
      className={className}
      {...rest}
    >
      {children ?? <ExternalLinkIcon />}
    </a>
  );
}
