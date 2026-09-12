import { useEditorState } from '@tiptap/react';
import { getSelectionAlignment, setTextAlignment } from '../../utils';
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
    selector: ({ editor }) =>
      editor ? getSelectionAlignment(editor) === 'left' : false,
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
