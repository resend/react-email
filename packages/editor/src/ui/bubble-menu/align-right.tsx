import { useEditorState } from '@tiptap/react';
import { AlignRightIcon } from 'lucide-react';
import { setTextAlignment } from '../../utils/set-text-alignment';
import { useBubbleMenuContext } from './context';
import type { PreWiredItemProps } from './create-mark-bubble-item';
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
      onCommand={() => setTextAlignment(editor, 'right')}
      className={className}
    >
      {children ?? <AlignRightIcon />}
    </BubbleMenuItem>
  );
}
