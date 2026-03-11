import { useEditorState } from '@tiptap/react';
import { AlignCenterIcon } from 'lucide-react';
import { setTextAlignment } from '../../utils/set-text-alignment.js';
import { useBubbleMenuContext } from './context.js';
import type { PreWiredItemProps } from './create-mark-bubble-item.js';
import { BubbleMenuItem } from './item.js';

export function BubbleMenuAlignCenter({
  className,
  children,
}: PreWiredItemProps) {
  const { editor } = useBubbleMenuContext();

  const isActive = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor?.isActive({ alignment: 'center' }) ?? false,
  });

  return (
    <BubbleMenuItem
      name="align-center"
      isActive={isActive}
      onCommand={() => setTextAlignment(editor, 'center')}
      className={className}
    >
      {children ?? <AlignCenterIcon />}
    </BubbleMenuItem>
  );
}
