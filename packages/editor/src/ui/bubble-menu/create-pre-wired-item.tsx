import { useEditorState } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import type * as React from 'react';
import { useBubbleMenuContext } from './context';
import { BubbleMenuItem } from './item';

export interface PreWiredItemProps {
  className?: string;
  /** Override the default icon */
  children?: React.ReactNode;
}

interface PreWiredItemConfig {
  name: string;
  activeName: string;
  activeParams?: Record<string, unknown>;
  command: string;
  icon: LucideIcon;
}

export function createPreWiredItem(config: PreWiredItemConfig) {
  function PreWiredItem({ className, children }: PreWiredItemProps) {
    const { editor } = useBubbleMenuContext();
    const Icon = config.icon;

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
        {children ?? <Icon />}
      </BubbleMenuItem>
    );
  }

  PreWiredItem.displayName = `BubbleMenu${config.name.charAt(0).toUpperCase() + config.name.slice(1)}`;

  return PreWiredItem;
}
