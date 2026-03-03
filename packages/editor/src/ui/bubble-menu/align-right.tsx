import { useEditorState } from '@tiptap/react';
import { AlignRightIcon } from 'lucide-react';
import { useBubbleMenuContext } from './context';
import type { PreWiredItemProps } from './create-pre-wired-item';
import { BubbleMenuItem } from './item';

export function BubbleMenuAlignRight({
  className,
  children,
}: PreWiredItemProps) {
  const { editor } = useBubbleMenuContext();

  const isActive = useEditorState({
    editor,
    selector: ({ editor }) => editor?.isActive({ alignment: 'right' }) ?? false,
  });

  return (
    <BubbleMenuItem
      name="align-right"
      isActive={isActive}
      onCommand={() => editor.chain().focus().setAlignment('right').run()}
      className={className}
    >
      {children ?? <AlignRightIcon />}
    </BubbleMenuItem>
  );
}
