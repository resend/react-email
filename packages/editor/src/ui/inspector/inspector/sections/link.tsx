import { useCurrentEditor } from '@tiptap/react';
import { LinkInput } from '../../../dialogs/link-input';
import { Section } from '../components/section';

interface LinkSectionProps {
  href: string;
  onChange?: (prop: string, value: string) => void;
  isCollapsed: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  /** If true, handles link marks (text links) instead of node attributes */
  isLinkMark?: boolean;
  /** Node type (e.g., 'image', 'button') for direct attribute updates */
  nodeType?: string;
}

export function LinkSection({
  href,
  onChange,
  isCollapsed,
  onAdd,
  onRemove,
  isLinkMark = false,
  nodeType,
}: LinkSectionProps) {
  const { editor } = useCurrentEditor();

  // For link marks, let LinkInput handle it internally (no callback)
  // For node attributes, provide the appropriate handler
  const handleHrefChange =
    isLinkMark || !editor
      ? undefined
      : (newHref: string) => {
          if (nodeType === 'image' || nodeType === 'button') {
            editor.commands.updateAttributes(nodeType, {
              href: newHref || null,
            });
          } else {
            onChange?.('href', newHref);
          }
        };

  return (
    <Section
      title="Link"
      isCollapsed={isCollapsed}
      onAdd={onAdd}
      onRemove={onRemove}
    >
      <LinkInput href={href} onHrefChange={handleHrefChange} />
    </Section>
  );
}
