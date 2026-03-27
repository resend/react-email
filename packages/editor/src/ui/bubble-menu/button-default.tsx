import { useEditorState } from '@tiptap/react';
import type * as React from 'react';
import { BubbleMenuButtonEditLink } from './button-edit-link';
import { BubbleMenuButtonForm } from './button-form';
import { BubbleMenuButtonToolbar } from './button-toolbar';
import { BubbleMenuButtonUnlink } from './button-unlink';
import { useBubbleMenuContext } from './context';
import { BubbleMenuRoot } from './root';
import { bubbleMenuTriggers } from './triggers';

export interface BubbleMenuButtonDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

function BubbleMenuButtonDefaultInner({
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: Pick<
  BubbleMenuButtonDefaultProps,
  'validateUrl' | 'onLinkApply' | 'onLinkRemove'
>) {
  const { editor } = useBubbleMenuContext();
  const buttonHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('button').href as string) ?? '',
  });
  const hasLink = (buttonHref ?? '') !== '' && buttonHref !== '#';

  return (
    <>
      <BubbleMenuButtonToolbar>
        <BubbleMenuButtonEditLink />
        {hasLink && <BubbleMenuButtonUnlink onLinkRemove={onLinkRemove} />}
      </BubbleMenuButtonToolbar>
      <BubbleMenuButtonForm
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </>
  );
}

export function BubbleMenuButtonDefault({
  placement = 'top',
  offset,
  onHide,
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  ...rest
}: BubbleMenuButtonDefaultProps) {
  return (
    <BubbleMenuRoot
      shouldShow={bubbleMenuTriggers.node('button')}
      pluginKey="buttonBubbleMenu"
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      <BubbleMenuButtonDefaultInner
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </BubbleMenuRoot>
  );
}
