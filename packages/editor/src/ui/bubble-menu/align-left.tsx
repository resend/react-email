import { useEditorState } from '@tiptap/react';
import { AlignLeftIcon } from 'lucide-react';
import { setTextAlignment } from '../../utils/set-text-alignment.js';
import { useBubbleMenuContext } from './context.js';
import type { PreWiredItemProps } from './create-mark-bubble-item.js';
import { BubbleMenuItem } from './item.js';

export function BubbleMenuAlignLeft({
  className,
  children,
}: PreWiredItemProps) {
  const { editor } = useBubbleMenuContext();

  const isActive = useEditorState({
    editor,
    selector: ({ editor }) => editor?.isActive({ alignment: 'left' }) ?? false,
  });

  return (
    <BubbleMenuItem
      name="align-left"
      isActive={isActive}
      onCommand={() => setTextAlignment(editor, 'left')}
      className={className}
    >
      {children ?? <AlignLeftIcon />}
    </BubbleMenuItem>
  );
}
