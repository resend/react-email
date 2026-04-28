import { useEditorState } from '@tiptap/react';
import { setTextAlignment } from '../../utils/set-text-alignment';
import { AlignLeftIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import type { PreWiredItemProps } from './create-mark-bubble-item';
import { BubbleMenuItem } from './item';

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
