import type * as React from 'react';
import { useButtonBubbleMenuContext } from './context';
import { ButtonBubbleMenuEditLink } from './edit-link';
import { ButtonBubbleMenuForm } from './form';
import { ButtonBubbleMenuRoot } from './root';
import { ButtonBubbleMenuToolbar } from './toolbar';
import { ButtonBubbleMenuUnlink } from './unlink';

export interface ButtonBubbleMenuDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

function ButtonBubbleMenuDefaultInner({
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: Pick<
  ButtonBubbleMenuDefaultProps,
  'validateUrl' | 'onLinkApply' | 'onLinkRemove'
>) {
  const { buttonHref } = useButtonBubbleMenuContext();
  const hasLink = buttonHref !== '' && buttonHref !== '#';

  return (
    <>
      <ButtonBubbleMenuToolbar>
        <ButtonBubbleMenuEditLink />
        {hasLink && <ButtonBubbleMenuUnlink onLinkRemove={onLinkRemove} />}
      </ButtonBubbleMenuToolbar>
      <ButtonBubbleMenuForm
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </>
  );
}

export function ButtonBubbleMenuDefault({
  placement,
  offset,
  onHide,
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  ...rest
}: ButtonBubbleMenuDefaultProps) {
  return (
    <ButtonBubbleMenuRoot
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      <ButtonBubbleMenuDefaultInner
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </ButtonBubbleMenuRoot>
  );
}
