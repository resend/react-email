import type * as React from 'react';
import { useEditorState } from '@tiptap/react';
import { ExternalLinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkOpenLinkProps
  extends Omit<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'> {}

export function BubbleMenuLinkOpenLink({
  className,
  children,
  ...rest
}: BubbleMenuLinkOpenLinkProps) {
  const { editor } = useBubbleMenuContext();

  const linkHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('link').href as string) ?? '',
  });

  return (
    <a
      {...rest}
      href={linkHref ?? ''}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open link"
      data-re-link-bm-item=""
      data-item="open-link"
      className={className}
    >
      {children ?? <ExternalLinkIcon />}
    </a>
  );
}
