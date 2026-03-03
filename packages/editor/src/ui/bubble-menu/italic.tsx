import { ItalicIcon } from 'lucide-react';
import { createPreWiredItem } from './create-pre-wired-item';

export const BubbleMenuItalic = createPreWiredItem({
  name: 'italic',
  activeName: 'italic',
  command: 'toggleItalic',
  icon: ItalicIcon,
});
