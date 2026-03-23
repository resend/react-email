import { MinusIcon, PlusIcon } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from '@/ui/icon-button';
import { Text } from '@/ui/text';
import * as Tooltip from '@/ui/tooltip';

interface SectionProps {
  /** Section heading. When omitted, the title row is not rendered. */
  title?: string | false;
  children?: React.ReactNode;
  /** When true, section is collapsed and shows + button */
  isCollapsed?: boolean;
  /** Callback when + button is clicked (only shown when isCollapsed=true) */
  onAdd?: () => void;
  /** Callback when - button is clicked (only shown when isCollapsed=false) */
  onRemove?: () => void;
}

export function Section({
  title,
  children,
  isCollapsed,
  onAdd,
  onRemove,
}: SectionProps) {
  return (
    <div
      className={cn(
        'first-of-type:mt-0 first-of-type:border-t-0 first-of-type:pt-0',
        { 'pt-5 border-t border-gray-2 ': !!title },
      )}
    >
      {title && (
        <div className="flex flex-row justify-between items-center">
          <Text color="white" weight="bold">
            {title}
          </Text>
          {isCollapsed && onAdd && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <IconButton
                  onClick={onAdd}
                  appearance="fade"
                  aria-label={`Add ${title}`}
                  size="1"
                >
                  <PlusIcon className="!w-4" />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Content side="top">{`Add ${title}`}</Tooltip.Content>
            </Tooltip.Root>
          )}
          {!isCollapsed && onRemove && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <IconButton
                  onClick={onRemove}
                  appearance="fade"
                  aria-label={`Remove ${title}`}
                  size="1"
                >
                  <MinusIcon className="!w-4" />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Content side="top">{`Remove ${title}`}</Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      )}
      {!isCollapsed && children && (
        <div className={cn('flex flex-col gap-3', title ? 'pt-2' : undefined)}>
          {children}
        </div>
      )}
    </div>
  );
}
