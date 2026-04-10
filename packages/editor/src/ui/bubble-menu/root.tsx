import { PluginKey } from '@tiptap/pm/state';
import { useCurrentEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { BubbleMenuAlignCenter } from './align-center';
import { BubbleMenuAlignLeft } from './align-left';
import { BubbleMenuAlignRight } from './align-right';
import { BubbleMenuBold } from './bold';
import { BubbleMenuCode } from './code';
import { BubbleMenuContext } from './context';
import { BubbleMenuItemGroup } from './group';
import { BubbleMenuItalic } from './italic';
import { BubbleMenuLinkSelector } from './link-selector';
import { BubbleMenuNodeSelector } from './node-selector';
import { BubbleMenuStrike } from './strike';
import { bubbleMenuTriggers, type TriggerFn } from './triggers';
import { BubbleMenuUnderline } from './underline';
import { BubbleMenuUppercase } from './uppercase';

const defaultPluginKey = new PluginKey('bubbleMenu');

export interface BubbleMenuRootProps
  extends React.ComponentPropsWithoutRef<'div'> {
  trigger?: TriggerFn;
  pluginKey?: PluginKey;
  hideWhenActiveNodes?: string[];
  hideWhenActiveMarks?: string[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
}

function BubbleMenuRoot({
  trigger,
  pluginKey = defaultPluginKey,
  hideWhenActiveNodes = [],
  hideWhenActiveMarks = [],
  placement = 'bottom',
  offset = 8,
  onHide,
  className,
  children,
  ...rest
}: BubbleMenuRootProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  const resolvedTrigger =
    trigger ??
    bubbleMenuTriggers.textSelection(hideWhenActiveNodes, hideWhenActiveMarks);

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={pluginKey}
      data-re-bubble-menu=""
      shouldShow={resolvedTrigger}
      options={{
        placement,
        offset,
        onHide: () => {
          setIsEditing(false);
          onHide?.();
        },
      }}
      className={className}
      {...rest}
    >
      <BubbleMenuContext.Provider value={{ editor, isEditing, setIsEditing }}>
        {children}
      </BubbleMenuContext.Provider>
    </BubbleMenu>
  );
}

const textPluginKey = new PluginKey('textBubbleMenu');

export interface BubbleMenuDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  hideWhenActiveNodes?: string[];
  hideWhenActiveMarks?: string[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
}

function BubbleMenuDefault({
  hideWhenActiveNodes,
  hideWhenActiveMarks,
  placement,
  offset,
  onHide,
  className,
  ...rest
}: BubbleMenuDefaultProps) {
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = React.useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = React.useState(false);

  const handleNodeSelectorOpenChange = React.useCallback((open: boolean) => {
    setIsNodeSelectorOpen(open);
    if (open) {
      setIsLinkSelectorOpen(false);
    }
  }, []);

  const handleLinkSelectorOpenChange = React.useCallback((open: boolean) => {
    setIsLinkSelectorOpen(open);
    if (open) {
      setIsNodeSelectorOpen(false);
    }
  }, []);

  const handleHide = React.useCallback(() => {
    setIsNodeSelectorOpen(false);
    setIsLinkSelectorOpen(false);
    onHide?.();
  }, [onHide]);

  return (
    <BubbleMenuRoot
      pluginKey={textPluginKey}
      hideWhenActiveNodes={hideWhenActiveNodes}
      hideWhenActiveMarks={hideWhenActiveMarks}
      placement={placement}
      offset={offset}
      onHide={handleHide}
      className={className}
      {...rest}
    >
      <BubbleMenuNodeSelector
        open={isNodeSelectorOpen}
        onOpenChange={handleNodeSelectorOpenChange}
      />
      <BubbleMenuLinkSelector
        open={isLinkSelectorOpen}
        onOpenChange={handleLinkSelectorOpenChange}
      />
      <BubbleMenuItemGroup>
        <BubbleMenuBold />
        <BubbleMenuItalic />
        <BubbleMenuUnderline />
        <BubbleMenuStrike />
        <BubbleMenuCode />
        <BubbleMenuUppercase />
      </BubbleMenuItemGroup>
      <BubbleMenuItemGroup>
        <BubbleMenuAlignLeft />
        <BubbleMenuAlignCenter />
        <BubbleMenuAlignRight />
      </BubbleMenuItemGroup>
    </BubbleMenuRoot>
  );
}

function BubbleMenuRootWithDefault({ children, ...rest }: BubbleMenuRootProps) {
  if (children) {
    return <BubbleMenuRoot {...rest}>{children}</BubbleMenuRoot>;
  }

  return <BubbleMenuDefault {...rest} />;
}

export { BubbleMenuRootWithDefault as BubbleMenuRoot };
