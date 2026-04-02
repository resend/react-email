import type * as React from 'react';
import { MinusIcon, PlusIcon } from '../../icons';
import { IconButton, Text, Tooltip } from '../primitives';

interface SectionProps {
  title?: string | false;
  children?: React.ReactNode;
  isCollapsed?: boolean;
  onAdd?: () => void;
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
      data-re-inspector-section=""
      {...(title ? { 'data-has-title': '' } : {})}
    >
      {title && (
        <div data-re-inspector-section-header="">
          <Text color="white" weight="bold">
            {title}
          </Text>
          {isCollapsed && onAdd && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconButton onClick={onAdd} aria-label={`Add ${title}`}>
                  <PlusIcon size={16} />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Content>{`Add ${title}`}</Tooltip.Content>
            </Tooltip.Root>
          )}
          {!isCollapsed && onRemove && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconButton onClick={onRemove} aria-label={`Remove ${title}`}>
                  <MinusIcon size={16} />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Content>{`Remove ${title}`}</Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      )}
      {!isCollapsed && children && (
        <div data-re-inspector-section-body="">{children}</div>
      )}
    </div>
  );
}
