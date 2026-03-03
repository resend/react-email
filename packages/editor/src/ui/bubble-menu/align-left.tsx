import { useEditorState } from '@tiptap/react';
import { AlignLeftIcon } from 'lucide-react';
import { useBubbleMenuContext } from './context';
import type { PreWiredItemProps } from './create-pre-wired-item';
import { BubbleMenuItem } from './item';

export function BubbleMenuAlignLeft({
  className,
  children,
}: PreWiredItemProps) {
  const { editor } = useBubbleMenuContext();

  const isActive = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor?.isActive({ alignment: 'left' }) ?? false,
  });

  return (
    <BubbleMenuItem
      name="align-left"
      isActive={isActive}
      onCommand={() => editor.chain().focus().setAlignment('left').run()}
      className={className}
    >
      {children ?? <AlignLeftIcon />}
    </BubbleMenuItem>
  );
}
