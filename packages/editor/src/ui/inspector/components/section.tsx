'use client';

import * as React from 'react';
import { MinusIcon, PlusIcon } from '../../icons';
import { IconButton, Text, Tooltip } from '../primitives';

interface SectionProps {
  title?: string;
  children?: React.ReactNode;
  initialCollapsed?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function Section({
  title,
  children,
  initialCollapsed = false,
  onAdd,
  onRemove,
}: SectionProps) {
  const [collapsed, setCollapsed] = React.useState(initialCollapsed);

  return (
    <div
      data-re-inspector-section=""
      {...(title ? { 'data-has-title': '' } : {})}
    >
      {title && (
        <div data-re-inspector-section-header="">
          <button
            type="button"
            data-re-inspector-section-toggle=""
            onClick={() => setCollapsed((c) => !c)}
          >
            <Text>{title}</Text>
          </button>
          {collapsed && onAdd && (
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconButton onClick={onAdd} aria-label={`Add ${title}`}>
                  <PlusIcon size={16} />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Content>{`Add ${title}`}</Tooltip.Content>
            </Tooltip.Root>
          )}
          {!collapsed && onRemove && (
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
      {!collapsed && children && (
        <div data-re-inspector-section-body="">{children}</div>
      )}
    </div>
  );
}
