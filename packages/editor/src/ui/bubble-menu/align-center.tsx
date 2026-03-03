import { useEditorState } from '@tiptap/react';
import { AlignCenterIcon } from 'lucide-react';
import { setTextAlignment } from '../../utils/set-text-alignment';
import { useBubbleMenuContext } from './context';
import type { PreWiredItemProps } from './create-pre-wired-item';
import { BubbleMenuItem } from './item';

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
