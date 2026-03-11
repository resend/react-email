import { useEditorState } from '@tiptap/react';
import type * as React from 'react';
import { useBubbleMenuContext } from './context.js';
import { BubbleMenuItem } from './item.js';

export interface PreWiredItemProps {
  className?: string;
  /** Override the default icon */
  children?: React.ReactNode;
}

interface MarkBubbleItemConfig {
  name: string;
  activeName: string;
  activeParams?: Record<string, unknown>;
  command: string;
  icon: React.ReactNode;
}

export function createMarkBubbleItem(config: MarkBubbleItemConfig) {
  function MarkBubbleItem({ className, children }: PreWiredItemProps) {
    const { editor } = useBubbleMenuContext();

    const isActive = useEditorState({
      editor,
      selector: ({ editor }) => {
        if (config.activeParams) {
          return (
            editor?.isActive(config.activeName, config.activeParams) ?? false
          );
        }
        return editor?.isActive(config.activeName) ?? false;
      },
    });

    const handleCommand = () => {
      const chain = editor.chain().focus();
      const method = (chain as unknown as Record<string, () => typeof chain>)[
        config.command
      ];
      if (method) {
        method.call(chain).run();
      }
    };

    return (
      <BubbleMenuItem
        name={config.name}
        isActive={isActive}
        onCommand={handleCommand}
        className={className}
      >
        {children ?? config.icon}
      </BubbleMenuItem>
    );
  }

  MarkBubbleItem.displayName = `BubbleMenu${config.name.charAt(0).toUpperCase() + config.name.slice(1)}`;

  return MarkBubbleItem;
}
