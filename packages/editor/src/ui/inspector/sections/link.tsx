import { useCurrentEditor } from '@tiptap/react';
import { Section } from '../components/section';
import { Label, TextField } from '../primitives';

interface LinkSectionProps {
  href: string;
  onChange?: (prop: string, value: string) => void;
  isCollapsed: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  isLinkMark?: boolean;
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

  const handleHrefChange = (newHref: string) => {
    if (isLinkMark || !editor) return;
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
      <div data-re-inspector-field="">
        <Label>URL</Label>
        <TextField.Root>
          <TextField.Input
            value={href}
            onChange={(e) => handleHrefChange(e.target.value)}
            placeholder="https://"
          />
        </TextField.Root>
      </div>
    </Section>
  );
}
