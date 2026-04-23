import { PluginKey } from '@tiptap/pm/state';
import { useEditorState } from '@tiptap/react';
import type * as React from 'react';
import { useBubbleMenuContext } from './context';
import { BubbleMenuImageEditLink } from './image-edit-link';
import { BubbleMenuImageForm } from './image-form';
import { BubbleMenuImageToolbar } from './image-toolbar';
import { BubbleMenuImageUnlink } from './image-unlink';
import { BubbleMenuRoot } from './root';
import { bubbleMenuTriggers } from './triggers';

const imagePluginKey = new PluginKey('imageBubbleMenu');

type ExcludableItem = 'edit-link' | 'unlink';

export interface BubbleMenuImageDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

function BubbleMenuImageDefaultInner({
  excludeItems,
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: Pick<
  BubbleMenuImageDefaultProps,
  'excludeItems' | 'validateUrl' | 'onLinkApply' | 'onLinkRemove'
> & { excludeItems: ExcludableItem[] }) {
  const { editor } = useBubbleMenuContext();
  const imageHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('image').href as string | null) ?? '',
  });

  const has = (item: ExcludableItem) => !excludeItems.includes(item);
  const hasLink = (imageHref ?? '') !== '';
  const showEditLink = has('edit-link');
  const showUnlink = has('unlink') && hasLink;
  const hasToolbarItems = showEditLink || showUnlink;

  return (
    <>
      {hasToolbarItems && (
        <BubbleMenuImageToolbar>
          {showEditLink && <BubbleMenuImageEditLink />}
          {showUnlink && <BubbleMenuImageUnlink onLinkRemove={onLinkRemove} />}
        </BubbleMenuImageToolbar>
      )}
      {showEditLink && (
        <BubbleMenuImageForm
          validateUrl={validateUrl}
          onLinkApply={onLinkApply}
          onLinkRemove={onLinkRemove}
        />
      )}
    </>
  );
}

export function BubbleMenuImageDefault({
  excludeItems = [],
  placement = 'top',
  offset,
  onHide,
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  ...rest
}: BubbleMenuImageDefaultProps) {
  return (
    <BubbleMenuRoot
      trigger={bubbleMenuTriggers.node('image')}
      pluginKey={imagePluginKey}
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      <BubbleMenuImageDefaultInner
        excludeItems={excludeItems}
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </BubbleMenuRoot>
  );
}
